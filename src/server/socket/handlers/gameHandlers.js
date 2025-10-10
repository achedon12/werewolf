import {
    addPlayerToChannel,
    addPlayerToGame,
    connectedPlayers,
    createGameRoom, gameRooms,
    getGameRoom,
    removePlayerFromGame
} from "../utils/roomManager.js";
import {addGameAction, getGameHistory} from "../utils/actionLogger.js";
import {updatedGameData} from "../utils/gameManager.js";
import {ACTION_TYPES, CHANNEL_TYPES} from "../../config/constants.js";

export const handleJoinGame = async (socket, io, gameId, userData, playerRole) => {
    try {
        userData = {
            ...userData,
            role: playerRole,
            isAlive: true,
            online: true,
            joinedAt: new Date()
        };

        let roomData = getGameRoom(gameId);
        if (!roomData) {
            roomData = createGameRoom(gameId);
        }

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
                    oldSocket.leave(`game-${gameId}`);
                    CHANNEL_TYPES.forEach(ch => oldSocket.leave(`game-${gameId}-${ch}`));
                    try {
                        oldSocket.emit("force-disconnect", {reason: "duplicate_session"});
                    } catch (e) {
                    }
                }
            }
        }

        addPlayerToGame(socket, gameId, userData);

        await addPlayerToChannel(socket, io, gameId, "general");

        addGameAction(gameId, {
            type: ACTION_TYPES.PLAYER_JOINED,
            playerName: userData.nickname,
            playerRole: playerRole,
            message: `${userData.nickname} a rejoint la partie`,
            phase: "connection",
        });

        await notifyGameUpdate(socket, io, gameId, roomData, userData);

    } catch (error) {
        console.error("❌ Erreur join-game:", error);
        socket.emit("game-error", {
            message: "Impossible de rejoindre la partie",
            error: error.message
        });
    }
}

export const handleLeaveGame = (socket, io, gameId, userData) => {
    try {
        const playerInfo = connectedPlayers.get(socket.id) || {
            gameId,
            nickname: userData?.nickname,
            role: userData?.role
        };
        const roomId = playerInfo?.gameId || gameId;

        removePlayerFromGame(socket, io, roomId, playerInfo, false);
        io.emit('game-updated', updatedGameData);
    } catch (err) {
        console.error("❌ Erreur leave-game:", err);
    }
}

export const handleJoinChannel = (socket, io, gameId, channelType) => {
    try {
        const playerInfo = connectedPlayers.get(socket.id);
        if (!playerInfo) return;

        const roomData = getGameRoom(gameId);
        if (!roomData) return;

        if (channelType === "werewolves" && playerInfo.role !== "Loup-Garou") {
            socket.emit("chat-error", {
                error: "Accès refusé : réservé aux Loups-Garous"
            });
            return;
        }

        CHANNEL_TYPES.forEach(channel => {
            if (channel !== channelType && roomData.channels[channel].has(socket.id)) {
                const oldChannel = `game-${gameId}-${channel}`;
                socket.leave(oldChannel);
                roomData.channels[channel].delete(socket.id);
            }
        });

        addPlayerToChannel(socket, io, gameId, channelType);

    } catch (error) {
        console.error("❌ Erreur join-channel:", error);
    }
}

export const handleGetAvailableGames = (socket, io) => {
    try {
        const availableGames = Array.from(gameRooms.values()).map(room => ({
            id: room.id,
            name: room.name || `Partie ${room.id}`,
            type: room.type || 'classic',
            configuration: room.configuration,
            state: room.state,
            phase: room.phase,
            players: room.players ? Object.fromEntries(room.players) : {},
            createdAt: room.createdAt,
            lastActivity: room.lastActivity
        }));

        socket.emit('available-games', availableGames);
    } catch (error) {
        console.error('❌ Erreur get-available-games:', error);
        socket.emit('connection-error', { message: 'Erreur lors du chargement des parties' });
    }
}

const notifyGameUpdate = async (socket, io, gameId, roomData, userData) => {
    const mainRoom = `game-${gameId}`;
    const generalChannel = `game-${gameId}-general`;

    io.in(mainRoom).emit("game-history", getGameHistory(gameId));
    io.in(mainRoom).emit("players-update", {
        players: Array.from(roomData.players.values())
    });

    const availableChannels = {
        general: true,
        werewolves: userData.role === "Loup-Garou",
        vote: roomData.phase === "voting"
    };
    socket.emit("available-channels", availableChannels);

    const gameData = await updatedGameData(gameId);
    roomData.configuration = gameData.configuration;
    roomData.type = gameData.type;
    roomData.name = gameData.name;
    socket.emit("game-update", gameData);

    io.to(generalChannel).emit("chat-message", {
        type: ACTION_TYPES.SYSTEM,
        playerName: "Système",
        message: `${userData.nickname} a rejoint la partie`,
        createdAt: new Date().toISOString(),
        channel: "general"
    });
}