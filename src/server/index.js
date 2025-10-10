import {createServer} from "node:http";
import next from "next";
import {Server} from "socket.io";
import { defaultGameConfig, getRoleById } from "../utils/Roles.js";

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

    async function updateGameData(gameId, updatedData) {
        try {
            const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: updatedData.name, configuration: updatedData.configuration, type: updatedData.type, state: updatedData.state, phase: updatedData.phase, players: updatedData.players})
            });
            return await res.json();
        } catch (err) {
            console.error("❌ Erreur lors de la mise à jour des données de la game :", err);
            return {};
        }
    }

    const connectedPlayers = new Map();

    io.on("connection", (socket) => {

        socket.on("join-game", async (gameId, userData, playerRole) => {
            try {
                userData = {
                    ...userData,
                    role: playerRole,
                    isAlive: true,
                    online: true,
                    joinedAt: new Date()
                }

                let roomData = gameRooms.get(gameId);
                if (!roomData) {
                    roomData = createGameRoom(gameId);
                }

                roomData.lastActivity = new Date();

                const mainRoom = `game-${gameId}`;

                const existingEntry = Array.from(roomData.players.entries()).find(
                    ([sid, p]) => p && p.id && userData.id && p.id === userData.id
                );
                if (existingEntry) {
                    const [oldSid] = existingEntry;
                    if (oldSid !== socket.id) {
                        const oldPlayer = roomData.players.get(oldSid);
                        if (oldPlayer) {
                            userData.role = oldPlayer.role || userData.role;
                            userData.isAdmin = oldPlayer.isAdmin || false;
                        }
                        roomData.players.delete(oldSid);
                        connectedPlayers.delete(oldSid);
                        const oldSocket = io.sockets.sockets.get(oldSid);
                        if (oldSocket) {
                            oldSocket.leave(mainRoom);
                            CHANNEL_TYPES.forEach(ch => oldSocket.leave(`game-${gameId}-${ch}`));
                            try {
                                oldSocket.emit("force-disconnect", {reason: "duplicate_session"});
                            } catch (e) {
                            }
                        }
                    }
                }

                socket.join(mainRoom);

                connectedPlayers.set(socket.id, {
                    ...userData,
                    gameId,
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

                setImmediate(async () => {
                    io.in(mainRoom).emit("game-history", getGameHistory(gameId));
                    io.in(mainRoom).emit("players-update", {
                        players: Array.from(roomData.players.values())
                    });

                    const availableChannels = {
                        general: true,
                        werewolves: playerRole === "Loup-Garou",
                        vote: roomData.phase === "voting"
                    };
                    socket.emit("available-channels", availableChannels);
                    const gameData = await updatedGameData(gameId);
                    roomData.configuration = gameData.configuration;
                    roomData.type = gameData.type;
                    roomData.name = gameData.name;
                    socket.emit("game-update", gameData);

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

                socket.join(channelRoom);
                roomData.channels[channelType].add(socket.id);
                roomData.lastActivity = new Date();

            } catch (error) {
                console.error("❌ Erreur join-channel:", error);
            }
        });

        socket.on("send-chat", async (data) => {
            try {
                const {gameId, message, channel = "general"} = data;
                const playerInfo = connectedPlayers.get(socket.id);

                if (!gameId || !message || !playerInfo) {
                    return;
                }

                const roomData = gameRooms.get(gameId);
                if (!roomData) return;

                if (!roomData.channels[channel].has(socket.id)) {
                    socket.emit("chat-error", {
                        error: "Vous n'êtes pas dans ce canal"
                    });
                    return;
                }

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

                const channelRoom = `game-${gameId}-${channel}`;
                io.to(channelRoom).emit("chat-message", messageData);

                roomData.lastActivity = new Date();

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

        socket.on("leave-game", (gameId, userData) => {
            try {
                const playerInfo = connectedPlayers.get(socket.id) || {
                    gameId,
                    nickname: userData?.nickname,
                    role: userData?.role
                };
                const roomId = playerInfo?.gameId || gameId;
                const roomData = gameRooms.get(roomId);

                if (!playerInfo || !roomData) {
                    // rien à faire
                    return;
                }

                // retirer des canaux
                CHANNEL_TYPES.forEach(channel => {
                    roomData.channels[channel].delete(socket.id);
                });

                // si la partie est en attente, supprimer le joueur, sinon marquer offline
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

                const leaveAction = addGameAction(roomId, {
                    type: "player_left",
                    playerName: playerInfo.nickname,
                    playerRole: playerInfo.role,
                    message: `${playerInfo.nickname} a quitté la partie`,
                    phase: "connection"
                });

                setImmediate(() => {
                    io.in(`game-${roomId}`).emit("players-update", {
                        players: Array.from(roomData.players.values())
                    });

                    if (leaveAction) {
                        io.in(`game-${roomId}`).emit("new-action", leaveAction);
                    } else {
                        io.in(`game-${roomId}`).emit("new-action", {
                            type: "player_left",
                            playerName: playerInfo.nickname,
                            message: `${playerInfo.nickname} a quitté la partie`,
                            createdAt: new Date().toISOString()
                        });
                    }

                    io.in(`game-${roomId}-general`).emit("chat-message", {
                        type: "system",
                        playerName: "Système",
                        message: `${playerInfo.nickname} s'est déconnecté`,
                        createdAt: new Date().toISOString(),
                        channel: "general"
                    });
                });

                // nettoyage des maps et quitter les rooms
                connectedPlayers.delete(socket.id);
                try {
                    socket.leave(`game-${roomId}`);
                    CHANNEL_TYPES.forEach(ch => socket.leave(`game-${roomId}-${ch}`));
                } catch (e) {
                }
            } catch (err) {
                console.error("❌ Erreur leave-game:", err);
            }
        });

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
                });
            }

            connectedPlayers.delete(socket.id);
        });

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

        socket.on("start-game", (gameId) => {
            const roomData = gameRooms.get(gameId);

            if (!roomData) {
                socket.emit("game-error", `Partie avec ID ${gameId} non trouvée, Veuillez recharger la page.`);
                return;
            }

            const configuration = JSON.parse(roomData.configuration)
            const connectedPlayers = Array.from(roomData.players.values()).filter(p => p.online);
            const gamePlayers = Object.values(configuration).reduce((a, b) => a + b, 0)

            if (connectedPlayers.length !== gamePlayers) {
                socket.emit("game-error", `Nombre de joueurs insuffisant pour démarrer la partie (joueurs connectés: ${connectedPlayers.length}, joueurs requis: ${gamePlayers})`);
                return;
            }

            // TODO: reset for prod
            // if (roomData.state !== 'En attente') {
            //     socket.emit("game-error", `La partie a déjà commencé ou est terminée.`);
            //     return;
            // }

            roomData.state = 'En cours';
            roomData.phase = 'nuit';
            roomData.lastActivity = new Date();

            addGameAction(gameId, {
                type: "game_event",
                playerName: "Système",
                playerRole: "system",
                message: `🚀 La partie a commencé ! Phase: Nuit`,
                phase: "game_start"
            });

            io.to(`game-${gameId}-general`).emit("chat-message", {
                type: "system",
                playerName: "Système",
                message: `🚀 La partie commence ! Bonne chance à tous.`,
                createdAt: new Date().toISOString(),
                channel: "general"
            });

            // roles distribution
            const roleCounts = configuration;
            let roles = [];
            Object.entries(roleCounts).forEach(([role, count]) => {
                const roleData = getRoleById(Number(role));
                for (let i = 0; i < count; i++) roles.push(roleData.name);
            });

            roles = roles.sort(() => Math.random() - 0.5);

            connectedPlayers.forEach((player, idx) => {
                player.role = roles[idx];
                const socketId = player.socketId;
                if (roomData.players.has(socketId)) {
                    roomData.players.get(socketId).role = player.role;
                }
            });

            roomData.config = defaultGameConfig;

            setImmediate(async () => {
                io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
                io.to(`game-${gameId}`).emit("howl");
                io.to(`game-${gameId}`).emit("ambiant-settings", {
                    themeEnabled: true,
                    soundsEnabled: true
                });
                io.to(`game-${gameId}`).emit("starting-soon", 10);
                io.to(`game-${gameId}`).emit("players-update", {
                    players: Array.from(roomData.players.values())
                });

                await updateGameData(gameId, {state: "En cours", phase: "Nuit", players: Array.from(roomData.players.values())});
                const gameData = await updatedGameData(gameId);
                io.to(`game-${gameId}`).emit("game-update", gameData);
            });
        });

        socket.on("update-game", async(gameId, updatedData) => {
            const roomData = gameRooms.get(gameId);
            if (!roomData) return;

            await updateGameData(gameId, updatedData);
            io.to(`game-${gameId}`).emit("game-update", await updatedGameData(gameId));
            roomData.lastActivity = new Date();
            socket.emit("admin-confirm-action", `Les données de la partie ont été mises à jour`);
        });

        socket.on("exclude-player", (gameId, targetPlayerId, reason) => {
            const roomData = gameRooms.get(gameId);
            if (!roomData) return;

            let targetSocketId = null;
            let targetPlayer = null;
            // TODO: if game is started : kill player, else just remove
            for (const [socketId, player] of roomData.players.entries()) {
                if (player.id === targetPlayerId) {
                    targetSocketId = socketId;
                    targetPlayer = player;
                    break;
                }
            }

            if (!targetPlayer) {
                socket.emit("game-error", `Joueur avec ID ${targetPlayerId} non trouvé`);
                return;
            }

            roomData.players.delete(targetPlayerId);
            CHANNEL_TYPES.forEach(channel => roomData.channels[channel].delete(targetPlayerId));
            connectedPlayers.delete(targetPlayerId);

            const action = addGameAction(gameId, {
                type: "player_excluded",
                playerName: targetPlayer.nickname,
                playerRole: targetPlayer.role,
                message: `❌ ${targetPlayer.nickname} a été exclu de la partie (${reason})`,
                phase: "game"
            });

            io.in(`game-${gameId}`).emit("players-update", {
                players: Array.from(roomData.players.values())
            });
            if (action) {
                io.in(`game-${gameId}`).emit("new-action", action);
            }
            io.in(`game-${gameId}-general`).emit("chat-message", {
                type: "system",
                playerName: "Système",
                message: `❌ ${targetPlayer.nickname} a été exclu de la partie (${reason})`,
                createdAt: new Date().toISOString(),
                channel: "general"
            });
            socket.emit("admin-confirm-action", `Le joueur ${targetPlayer.nickname} a bien été exclu (${reason})`);

            if (targetSocketId) {
                const targetSocket = io.sockets.sockets.get(targetSocketId);
                if (targetSocket) {
                    try {
                        targetSocket.emit("exclude-player-confirm", `Vous avez été exclu de la partie: ${reason}`);
                        targetSocket.leave(`game-${gameId}`);
                        CHANNEL_TYPES.forEach(ch => targetSocket.leave(`game-${gameId}-${ch}`));
                    } catch (e) {
                    }
                }
            }
        });

        socket.on("add-bot", (gameId, botName) => {
            const roomData = gameRooms.get(gameId);

            if (!roomData) {
                socket.emit("game-error", `Partie avec ID ${gameId} non trouvée, Veuillez recharger la page.`);
                return;
            }

            const botId = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const botData = {
                id: botId,
                socketId: null,
                nickname: botName || `Bot-${Math.floor(Math.random() * 1000)}`,
                avatar: null,
                isAdmin: false,
                role: "",
                isAlive: true,
                online: true,
                isBot: true,
                joinedAt: new Date()
            };
            roomData.players.set(botId, botData);
            roomData.lastActivity = new Date();

            addGameAction(gameId, {
                type: "bot_added",
                playerName: botData.nickname,
                playerRole: "Bot",
                message: `🤖 ${botData.nickname} a rejoint la partie`,
                phase: "game"
            });

            io.in(`game-${gameId}`).emit("players-update", {
                players: Array.from(roomData.players.values())
            });
            io.in(`game-${gameId}-general`).emit("chat-message", {
                type: "system",
                playerName: "Système",
                message: `🤖 ${botData.nickname} a rejoint la partie`,
                createdAt: new Date().toISOString(),
                channel: "general"
            });
            socket.emit("admin-confirm-action", `Le bot ${botData.nickname} a bien été ajouté à la partie`);
        })

        socket.on("ping", () => {
            socket.emit("pong", {
                createdAt: new Date().toISOString(),
                serverTime: Date.now()
            });
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