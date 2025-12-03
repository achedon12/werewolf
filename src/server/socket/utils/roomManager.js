import {ACTION_TYPES, CHANNEL_TYPES, GAME_PHASES, GAME_STATES} from "../../config/constants.js";
import {addGameAction} from "./actionLogger.js";
import {updatedGameData} from "../../socket/utils/gameManager.js";

export const gameRooms = new Map();
export const connectedPlayers = new Map();

export const createGameRoom = async (gameId) => {

    const fetchedGame = await updatedGameData(gameId)
    let roomData = {
        id: gameId,
        configuration: fetchedGame.configuration || "{}",
        admin: fetchedGame.admin || null,
        type: fetchedGame.type || "classic",
        name: fetchedGame.name || "Partie Sans Nom",
        startedAt: fetchedGame.startedAt || null,
        endedAt: fetchedGame.endedAt || null,
        createdAt: fetchedGame.createdAt || new Date(),
        lastActivity: new Date(),
        channels: {
            general: new Set(),
            werewolves: new Set(),
            vote: new Set(),
            sisters: new Set(),
        },
        players: new Map(),
        actionHistory: [],
        state: fetchedGame.state || GAME_STATES.WAITING,
        phase: fetchedGame.phase || GAME_PHASES.NIGHT
    };

    gameRooms.set(gameId, roomData);
    return roomData;
}

export const getGameRoom = (gameId) => {
    return gameRooms.get(gameId);
}

export const addPlayerToGame = (socket, gameId, userData) => {
    const roomData = getGameRoom(gameId);
    const mainRoom = `game-${gameId}`;

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

    roomData.lastActivity = new Date();
    gameRooms.set(gameId, roomData);
}

export const addPlayerToChannel = (socket, io, gameId, channelType) => {
    const roomData = getGameRoom(gameId);
    const channelRoom = `game-${gameId}-${channelType}`;

    socket.join(channelRoom);
    roomData.channels[channelType].add(socket.id);
    roomData.lastActivity = new Date();
    gameRooms.set(gameId, roomData);
}

export const removePlayerFromGame = (socket, io, gameId, playerInfo, isDisconnect = false) => {
    const roomData = getGameRoom(gameId);
    if (!roomData) return;

    CHANNEL_TYPES.forEach(channel => {
        roomData.channels[channel].delete(socket.id);
    });

    if (roomData.state === GAME_STATES.WAITING) {
        roomData.players.delete(socket.id);
    } else {
        if (roomData.players.has(socket.id)) {
            const player = roomData.players.get(socket.id);
            player.isAlive = false;
            roomData.players.set(socket.id, player);
        }
    }

    roomData.lastActivity = new Date();

    const leaveAction = addGameAction(gameId, {
        type: ACTION_TYPES.PLAYER_LEFT,
        playerName: playerInfo.nickname,
        playerRole: playerInfo.role,
        message: `${playerInfo.nickname} a quitté la partie`,
        phase: "connection"
    });

    io.in(`game-${gameId}`).emit("players-update", {
        players: Array.from(roomData.players.values())
    });

    if (leaveAction) {
        io.in(`game-${gameId}`).emit("new-action", leaveAction);
    }

    io.in(`game-${gameId}-general`).emit("chat-message", {
        type: ACTION_TYPES.SYSTEM,
        playerName: "Système",
        message: `${playerInfo.nickname} s'est déconnecté`,
        createdAt: new Date().toISOString(),
        channel: "general"
    });

    connectedPlayers.delete(socket.id);

    if (!isDisconnect) {
        try {
            socket.leave(`game-${gameId}`);
            CHANNEL_TYPES.forEach(ch => socket.leave(`game-${gameId}-${ch}`));
        } catch (e) {
        }
    }

    gameRooms.set(gameId, roomData);
}

export const removePlayerFromAllChannels = (socket, gameId) => {
    const roomData = getGameRoom(gameId);
    if (!roomData) return;

    CHANNEL_TYPES.forEach(channel => {
        roomData.channels[channel].delete(socket.id);
    });
    roomData.lastActivity = new Date();
    gameRooms.set(gameId, roomData);
}

export const cleanupInactiveRooms = (io) => {
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