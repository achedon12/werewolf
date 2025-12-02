import {connectedPlayers, gameRooms, getGameRoom} from "../utils/roomManager.js";
import {addGameAction} from "../utils/actionLogger.js";
import {startGameLogic, updatedGameData, updateGameData} from "../utils/gameManager.js";
import {ACTION_TYPES, CHANNEL_TYPES} from "../../config/constants.js";
import {BOT_TYPES} from "../../../utils/Bot.js";

export const handleStartGame = async (socket, io, gameId) => {
    try {
        await startGameLogic(socket, io, gameId);
    } catch (error) {
        console.error("❌ Erreur start-game:", error);
        socket.emit("game-error", error.message);
    }
}

export const handleUpdateGame = async (socket, io, gameId, updatedData) => {
    const roomData = getGameRoom(gameId);
    if (!roomData) return;

    await updateGameData(gameId, updatedData);
    io.to(`game-${gameId}`).emit("game-update", await updatedGameData(gameId));
    roomData.lastActivity = new Date();
    socket.emit("game-notify", `Les données de la partie ont été mises à jour`);
}

export const handleExcludePlayer = async (socket, io, gameId, targetPlayerId, reason) => {
    const roomData = getGameRoom(gameId);
    if (!roomData) return;

    let targetSocketId = null;
    let targetPlayer = null;

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
        type: ACTION_TYPES.PLAYER_EXCLUDED,
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
        type: ACTION_TYPES.SYSTEM,
        playerName: "Système",
        message: `❌ ${targetPlayer.nickname} a été exclu de la partie (${reason})`,
        createdAt: new Date().toISOString(),
        channel: "general"
    });

    socket.emit("game-notify", `Le joueur ${targetPlayer.nickname} a bien été exclu (${reason})`);
    io.emit('game-updated', await updatedGameData(gameId));

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
}

export const handleAddBot = async (socket, io, gameId, botName, botType) => {
    const roomData = getGameRoom(gameId);

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
        botType: botType || BOT_TYPES.BASIC,
        joinedAt: new Date()
    };

    roomData.players.set(botId, botData);
    roomData.lastActivity = new Date();
    gameRooms.set(gameId, roomData);

    addGameAction(gameId, {
        type: ACTION_TYPES.BOT_ADDED,
        playerName: botData.nickname,
        playerRole: "",
        message: `🤖 ${botData.nickname} a rejoint la partie`,
        phase: "game"
    });

    io.in(`game-${gameId}`).emit("players-update", {
        players: Array.from(roomData.players.values())
    });

    io.in(`game-${gameId}-general`).emit("chat-message", {
        type: ACTION_TYPES.SYSTEM,
        playerName: "Système",
        message: `🤖 ${botData.nickname} a rejoint la partie`,
        createdAt: new Date().toISOString(),
        channel: "general"
    });

    // socket.emit("game-notify", `Le bot ${botData.nickname} a bien été ajouté à la partie`);
    // io.emit('game-updated', await updatedGameData(gameId));
}

export const handleGetRoomInfo = (socket, gameId) => {
    const roomData = getGameRoom(gameId);
    if (roomData) {
        socket.emit("room-info", {
            playersCount: roomData.players.size,
            channels: {
                general: roomData.channels.general.size,
                werewolves: roomData.channels.werewolves.size,
                vote: roomData.channels.vote.size,
                sisters: roomData.channels.sisters.size
            },
            historyCount: roomData.actionHistory.length,
            lastActivity: roomData.lastActivity
        });
    }
}