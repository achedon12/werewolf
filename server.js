import {createServer} from "node:http";
import next from "next";
import {Server} from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({dev, hostname, port});
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: `http://${hostname}:${port}`,
            methods: ["GET", "POST"]
        }
    });

    const gameRooms = new Map();
    const CHANNEL_TYPES = ['general', 'werewolves', 'vote'];

    const createGameRoom = (gameId) => {
        const roomData = {
            id: gameId,
            createdAt: new Date(),
            lastActivity: new Date(),
            channels: {
                general: new Set(),
                werewolves: new Set(),
                vote: new Set()
            },
            players: new Map(),
            actionHistory: [],
            state: 'waiting',
            phase: 'day'
        };

        gameRooms.set(gameId, roomData);
        return roomData;
    }

    const addGameAction = (gameId, actionData) => {
        const roomData = gameRooms.get(gameId);
        if (!roomData) return null;

        const action = {
            id: `${gameId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: actionData.type,
            playerName: actionData.playerName,
            playerRole: actionData.playerRole,
            message: actionData.message,
            details: actionData.details || {},
            createdAt: new Date().toISOString(),
            phase: actionData.phase || 'general'
        };

        roomData.actionHistory.push(action);

        if (roomData.actionHistory.length > 100) {
            roomData.actionHistory = roomData.actionHistory.slice(-100);
        }

        roomData.lastActivity = new Date();

        return action;
    }

    const getGameHistory = (gameId) => {
        const roomData = gameRooms.get(gameId);
        if (!roomData) return [];
        return roomData.actionHistory;
    }

    const cleanupInactiveRooms = () => {
        const now = new Date();
        const inactiveTime = 15 * 60 * 1000;

        for (const [gameId, room] of gameRooms.entries()) {
            if (now - room.lastActivity > inactiveTime) {
                const clientsInRoom = io.sockets.adapter.rooms.get(`game-${gameId}`);
                if (!clientsInRoom || clientsInRoom.size === 0) {
                    gameRooms.delete(gameId);
                }
            }
        }
    }

    setInterval(cleanupInactiveRooms, 5 * 60 * 1000);

    async function updatedGameData(gameId) {
        try {
            const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}`);
            return await res.json();
        } catch (err) {
            console.error("❌ Erreur lors de la récupération des données de la game :", err);
            return {};
        }
    }

    const connectedPlayers = new Map();

    io.on("connection", (socket) => {

        socket.on("join-game", async (gameId, userData, playerRole) => {
            try {
                userData.role = playerRole;
                userData.isAlive = true;
                userData.online = true;

                /*const previousRooms = Array.from(socket.rooms);
                previousRooms.forEach(room => {
                    if (room.startsWith('game-')) {
                        socket.leave(room);
                    }
                });*/

                let roomData = gameRooms.get(gameId);
                if (!roomData) {
                    roomData = createGameRoom(gameId);
                }

                roomData.lastActivity = new Date();

                const mainRoom = `game-${gameId}`;
                socket.join(mainRoom);

                connectedPlayers.set(socket.id, {
                    ...userData,
                    gameId,
                    joinedAt: new Date(),
                    socketId: socket.id
                });

                roomData.players.set(socket.id, {
                    socketId: socket.id,
                    ...userData
                });

                const generalChannel = `game-${gameId}-general`;
                socket.join(generalChannel);
                roomData.channels.general.add(socket.id);

                addGameAction(gameId, {
                    type: "player_joined",
                    playerName: userData.nickname,
                    playerRole: playerRole,
                    message: `${userData.nickname} a rejoint la partie`,
                    phase: "connection",
                });

                setImmediate(() => {
                    const clientsInRoom = io.sockets.adapter.rooms.get(mainRoom);

                    io.in(mainRoom).emit("game-history", getGameHistory(gameId));
                    io.in(mainRoom).emit("players-update", {
                        players: Array.from(roomData.players.values())
                    });

                    const availableChannels = {
                        general: true,
                        werewolves: playerRole === "Loup-Garou",
                        vote: roomData.phase === 'voting'
                    };
                    socket.emit("available-channels", availableChannels);

                    io.to(generalChannel).emit("chat-message", {
                        type: "system",
                        playerName: "Système",
                        message: `${userData.nickname} a rejoint la partie`,
                        createdAt: new Date().toISOString(),
                        channel: "general"
                    });

                });
            } catch (error) {
                console.error("❌ Erreur join-game:", error);
                socket.emit("game-error", {
                    message: "Impossible de rejoindre la partie",
                    error: error.message
                });
            }
        });

        // Rejoindre un canal spécifique
        socket.on("join-channel", (gameId, channelType) => {
            try {
                const playerInfo = connectedPlayers.get(socket.id);
                if (!playerInfo) return;

                const roomData = gameRooms.get(gameId);
                if (!roomData) return;

                // Vérifier les permissions pour le canal des loups-garous
                if (channelType === "werewolves" && playerInfo.role !== "Loup-Garou") {
                    socket.emit("chat-error", {
                        error: "Accès refusé : réservé aux Loups-Garous"
                    });
                    return;
                }

                const channelRoom = `game-${gameId}-${channelType}`;

                // Quitter les autres canaux du même type si nécessaire
                CHANNEL_TYPES.forEach(channel => {
                    if (channel !== channelType && roomData.channels[channel].has(socket.id)) {
                        const oldChannel = `game-${gameId}-${channel}`;
                        socket.leave(oldChannel);
                        roomData.channels[channel].delete(socket.id);
                    }
                });

                // Rejoindre le nouveau canal
                socket.join(channelRoom);
                roomData.channels[channelType].add(socket.id);
                roomData.lastActivity = new Date();

                socket.emit("channel-joined", {
                    channel: channelType,
                    message: `Vous avez rejoint le canal ${channelType}`
                });

            } catch (error) {
                console.error("❌ Erreur join-channel:", error);
            }
        });

        // Envoyer un message dans un canal
        socket.on("send-chat", async (data) => {
            try {
                const {gameId, message, channel = "general"} = data;
                const playerInfo = connectedPlayers.get(socket.id);

                if (!gameId || !message || !playerInfo) {
                    return;
                }

                const roomData = gameRooms.get(gameId);
                if (!roomData) return;

                // Vérifier que le joueur est dans le canal
                if (!roomData.channels[channel].has(socket.id)) {
                    socket.emit("chat-error", {
                        error: "Vous n'êtes pas dans ce canal"
                    });
                    return;
                }

                // Vérifier les permissions spécifiques
                if (channel === "werewolves" && playerInfo.role !== "Loup-Garou") {
                    socket.emit("chat-error", {
                        error: "Accès refusé au canal des loups"
                    });
                    return;
                }

                const messageData = {
                    playerId: socket.id,
                    playerName: playerInfo.nickname,
                    playerRole: playerInfo.role,
                    message: message,
                    channel: channel,
                    createdAt: new Date().toISOString(),
                    type: "player"
                };

                // Émettre le message au canal cible
                const channelRoom = `game-${gameId}-${channel}`;
                io.to(channelRoom).emit("chat-message", messageData);

                // Mettre à jour l'activité de la room
                roomData.lastActivity = new Date();

                // Ajouter l'action de chat à l'historique seulement pour le canal général
                if (channel === "general") {
                    addGameAction(gameId, {
                        type: "chat_message",
                        playerName: playerInfo.nickname,
                        playerRole: playerInfo.role,
                        message: `${playerInfo.nickname}: ${message}`,
                        details: {channel: channel},
                        phase: "chat"
                    });
                }

            } catch (error) {
                console.error("❌ Erreur lors de l'envoi du chat:", error);
            }
        });

        // Gestion des actions de jeu
        socket.on("player-action", async (data) => {
            try {
                const {gameId, action, targetPlayerId, type, playerName, playerRole, details = {}} = data;
                const playerInfo = connectedPlayers.get(socket.id);

                if (!gameId || !playerInfo) {
                    throw new Error("Données manquantes");
                }

                const roomData = gameRooms.get(gameId);
                if (!roomData) return;

                // Déterminer le message selon le type d'action
                let actionMessage = "";
                let actionType = "game_action";

                switch (type) {
                    case "vote":
                        actionMessage = `🗳️ ${playerName} a voté contre un joueur`;
                        actionType = "player_vote";
                        break;
                    case "attack":
                        actionMessage = `🐺 ${playerName} a attaqué un villageois`;
                        actionType = "werewolf_attack";
                        break;
                    case "reveal":
                        actionMessage = `🔮 ${playerName} a utilisé son pouvoir de voyante`;
                        actionType = "seer_reveal";
                        break;
                    case "heal":
                        actionMessage = `🏥 ${playerName} a soigné un joueur`;
                        actionType = "doctor_heal";
                        break;
                    case "phase_change":
                        actionMessage = `🔄 La phase change: ${details.phase}`;
                        actionType = "phase_change";
                        break;
                    case "player_eliminated":
                        actionMessage = `💀 ${playerName} a été éliminé`;
                        actionType = "player_eliminated";
                        break;
                    default:
                        actionMessage = `⚡ ${playerName} a effectué une action`;
                        actionType = "game_action";
                }

                // Ajouter l'action à l'historique
                const newAction = addGameAction(gameId, {
                    type: actionType,
                    playerName: playerName,
                    playerRole: playerRole,
                    message: actionMessage,
                    details: details,
                    phase: roomData.phase || "game"
                });

                // Diffuser la nouvelle action à tous les joueurs de la game
                io.to(`game-${gameId}`).emit("new-action", newAction);

                // Mettre à jour les données du jeu si nécessaire
                if (type !== "chat_message") {
                    const gameData = await updatedGameData(gameId);
                    io.to(`game-${gameId}`).emit("game-update", gameData);
                }

            } catch (error) {
                console.error("❌ Erreur lors du traitement de l'action:", error);
                socket.emit("action-error", {
                    error: "Échec de l'action",
                    details: error.message
                });
            }
        });

        socket.on("request-history", (gameId) => {
            try {
                const history = getGameHistory(gameId);
                socket.emit("game-history", history);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération de l'historique:", error);
                socket.emit("history-error", {error: "Impossible de charger l'historique"});
            }
        });

        // javascript
        socket.on("disconnect", async (reason) => {
            const playerInfo = connectedPlayers.get(socket.id);

            if (!playerInfo) return;

            const roomData = gameRooms.get(playerInfo.gameId);
            if (roomData) {
                CHANNEL_TYPES.forEach(channel => {
                    roomData.channels[channel].delete(socket.id);
                });

                if (roomData.state === 'waiting') {
                    roomData.players.delete(socket.id);
                } else {
                    const player = roomData.players.get(socket.id);
                    if (player) {
                        player.online = false;
                        roomData.players.set(socket.id, player);
                    }
                }

                roomData.lastActivity = new Date();

                const leaveAction = addGameAction(playerInfo.gameId, {
                    type: "player_left",
                    playerName: playerInfo.nickname,
                    playerRole: playerInfo.role,
                    message: `${playerInfo.nickname} a quitté la partie`,
                    phase: "connection"
                });

                setImmediate(() => {
                    io.in(`game-${playerInfo.gameId}`).emit("players-update", {
                        players: Array.from(roomData.players.values())
                    });

                    if (leaveAction) {
                        io.in(`game-${playerInfo.gameId}`).emit("new-action", leaveAction);
                    } else {
                        io.in(`game-${playerInfo.gameId}`).emit("new-action", {
                            type: "player_left",
                            playerName: playerInfo.nickname,
                            message: `${playerInfo.nickname} a quitté la partie`,
                            createdAt: new Date().toISOString()
                        });
                    }

                    io.in(`game-${playerInfo.gameId}-general`).emit("chat-message", {
                        type: "system",
                        playerName: "Système",
                        message: `${playerInfo.nickname} s'est déconnecté`,
                        createdAt: new Date().toISOString(),
                        channel: "general"
                    });

                    console.log(`🔔 Broadcast déconnexion pour ${playerInfo.nickname} dans game-${playerInfo.gameId}`);
                });
            }

            connectedPlayers.delete(socket.id);
        });


        // Événements de gestion des rooms
        socket.on("get-room-info", (gameId) => {
            const roomData = gameRooms.get(gameId);
            if (roomData) {
                socket.emit("room-info", {
                    playersCount: roomData.players.size,
                    channels: {
                        general: roomData.channels.general.size,
                        werewolves: roomData.channels.werewolves.size,
                        vote: roomData.channels.vote.size
                    },
                    historyCount: roomData.actionHistory.length,
                    lastActivity: roomData.lastActivity
                });
            }
        });

        // Ping pour maintenir la connexion
        socket.on("ping", () => {
            socket.emit("pong", {
                createdAt: new Date().toISOString(),
                serverTime: Date.now()
            });
        });
    });

    // Middleware pour logger les requêtes HTTP
    httpServer.on('request', (req, res) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`🌐 ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error("❌ Erreur du serveur HTTP:", err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`🚀 Serveur Next.js prêt sur http://${hostname}:${port}`);
            console.log(`📡 Serveur Socket.IO actif avec gestion des rooms et historique d'actions`);
        });

    process.on('SIGTERM', () => {
        console.log('🛑 Arrêt du serveur...');
        // Sauvegarder l'historique des rooms si nécessaire
        console.log(`💾 ${gameRooms.size} rooms actives avec leur historique`);
        httpServer.close(() => {
            console.log('✅ Serveur arrêté proprement');
            process.exit(0);
        });
    });
});