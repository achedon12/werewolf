import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: `http://${hostname}:${port}`,
            methods: ["GET", "POST"]
        }
    });

    async function addGameLog(gameId, message) {
        try {
            console.log(`📝 Tentative d'ajout de log pour ${gameId}: ${message}`);

            const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}/log`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
            }

            const data = await res.json();
            console.log("✅ Log ajouté avec succès:", data);
            return data;
        } catch (err) {
            console.error("❌ Erreur lors de l'ajout du log :", err.message);
            // Ne pas throw pour éviter de bloquer le flux principal
            return { error: err.message };
        }
    }

    async function removePlayer(gameId, userId) {
        try {
            console.log(`🗑️ Tentative de suppression du joueur ${userId} de la game ${gameId}`);

            const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}/leave/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
            }
            const data = await res.json();
            console.log("✅ Joueur supprimé avec succès:", data);
            return data;
        } catch (err) {
            console.error("❌ Erreur lors de la suppression du joueur :", err.message);
            return { error: err.message };
        }
    }

    async function getGameLogs(gameId) {
        try {
            const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}/log`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                console.log(res.json());
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            return data.logs || [];
        } catch (err) {
            console.error("❌ Erreur lors de la récupération des logs :", err);
            return [];
        }
    }

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
        console.log(`🔌 Nouvelle connexion Socket.IO: ${socket.id}`);

        const roomLogger = setInterval(() => {
            const rooms = Array.from(io.sockets.adapter.rooms.entries())
                .filter(([roomId, sockets]) => roomId.startsWith('game-'))
                .map(([roomId, sockets]) => `${roomId}: ${sockets.size} joueurs`);

            if (rooms.length > 0) {
                console.log("🎮 Rooms actives:", rooms);
            }
        }, 30000);

        socket.on("join-game", async (gameId, nickname, userId) => {
            try {
                console.log(`🎯 Tentative de rejoindre la game ${gameId} par ${socket.id}`);

                const previousRooms = Array.from(socket.rooms).filter(room => room.startsWith('game-'));
                previousRooms.forEach(room => {
                    socket.leave(room);
                });

                const roomName = `game-${gameId}`;
                socket.join(roomName);

                connectedPlayers.set(socket.id, {
                    gameId: gameId,
                    nickname: nickname,
                    userId: userId,
                    joinedAt: new Date()
                });

                // Ajouter le log de connexion
                await addGameLog(gameId, `🎮 ${nickname || 'Un joueur'} a rejoint la partie`);

                io.to(roomName).emit("game-logs", await getGameLogs(gameId));

                io.to(roomName).emit("game-update", await updatedGameData(gameId));

            } catch (error) {
                console.error("❌ Erreur join-game:", error);
                socket.emit("game-error", {
                    message: "Impossible de rejoindre la partie",
                    error: error.message
                });
            }
        });

        socket.on("player-action", async (data) => {
            try {
                const { gameId, action, targetPlayerId, type, playerName } = data;

                if (!gameId) {
                    throw new Error("Game ID manquant");
                }

                const roomName = `game-${gameId}`;

                console.log(`⚡ Traitement de l'action: ${type} par ${playerName}`);

                // Ajouter un log pour l'action
                let actionMessage = "";
                switch (type) {
                    case "vote":
                        actionMessage = `🗳️ ${playerName} a voté`;
                        break;
                    case "attack":
                        actionMessage = `🐺 ${playerName} a attaqué`;
                        break;
                    case "reveal":
                        actionMessage = `🔮 ${playerName} a utilisé son pouvoir`;
                        break;
                    default:
                        actionMessage = `⚡ ${playerName} a effectué une action`;
                }

                await addGameLog(gameId, actionMessage);

                // Diffuser les mises à jour
                io.to(roomName).emit("game-update", await updatedGameData(gameId));

                console.log(`🔄 Mise à jour après action envoyée à ${roomName}`);

            } catch (error) {
                console.error("❌ Erreur lors du traitement de l'action:", error);
                socket.emit("action-error", {
                    error: "Échec de l'action",
                    details: error.message
                });
            }
        });

        socket.on("send-chat", async (data) => {
            try {
                const { gameId, message, playerName = "Anonyme" } = data;

                if (!gameId || !message) {
                    console.warn("⚠️ Données de chat incomplètes:", data);
                    return;
                }

                const roomName = `game-${gameId}`;

                console.log(`💬 Chat message dans ${roomName} de ${playerName}: ${message}`);

                // Ajouter le message de chat aux logs
                await addGameLog(gameId, `💬 ${playerName}: ${message}`);

                // Diffuser le message à TOUS les joueurs de la room
                io.to(roomName).emit("chat-message", {
                    playerId: socket.id,
                    playerName: playerName,
                    message: message,
                    timestamp: new Date().toISOString(),
                    type: "player"
                });


            } catch (error) {
                console.error("❌ Erreur lors de l'envoi du chat:", error);
            }
        });

        socket.on("request-logs", async (gameId) => {
            try {
                const logs = await getGameLogs(gameId);
                socket.emit("game-logs", logs);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des logs:", error);
                socket.emit("logs-error", { error: "Impossible de charger les logs" });
            }
        });

        socket.on("leave-game", async (gameId, nickname, userId) => {
            try {
                const roomName = `game-${gameId}`;
                socket.leave(roomName);

                const playerInfo = connectedPlayers.get(socket.id);
                connectedPlayers.delete(socket.id);

                await addGameLog(gameId, `🚪 ${nickname || playerInfo?.nickname || 'Un joueur'} a quitté la partie`);
                await removePlayer(gameId, userId);
                io.to(roomName).emit('game-update', await updatedGameData(gameId));
                io.to(roomName).emit("game-logs", await getGameLogs(gameId));

            } catch (error) {
                console.error("❌ Erreur lors du leave-game:", error);
            }
        });

        socket.on("disconnect", async (reason) => {
            console.log(`🔌 Socket ${socket.id} déconnecté: ${reason}`);

            clearInterval(roomLogger);

            const playerInfo = connectedPlayers.get(socket.id);
            console.log(`ℹ️ Infos du joueur déconnecté:`, playerInfo);
            if (playerInfo) {
                const roomName = `game-${playerInfo.gameId}`;

                await addGameLog(playerInfo.gameId, `🔌 ${playerInfo.nickname || 'Un joueur'} s'est déconnecté`);
                await removePlayer(playerInfo.gameId, playerInfo.userId);
                io.to(roomName).emit('game-update', await updatedGameData(playerInfo.gameId));
                io.to(roomName).emit("game-logs", await getGameLogs(playerInfo.gameId));

                connectedPlayers.delete(socket.id);
            }
        });

        socket.on("connect_error", (error) => {
            console.error(`❌ Erreur de connexion Socket.IO (${socket.id}):`, error);
        });

        socket.on("ping", () => {
            socket.emit("pong", { timestamp: new Date().toISOString() });
        });
    });

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
            console.log(`📡 Serveur Socket.IO actif sur le même port`);
        });

    process.on('SIGTERM', () => {
        console.log('🛑 Arrêt du serveur...');
        httpServer.close(() => {
            console.log('✅ Serveur arrêté proprement');
            process.exit(0);
        });
    });
});