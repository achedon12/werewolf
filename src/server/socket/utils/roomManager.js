import {ACTION_TYPES, CHANNEL_TYPES, GAME_PHASES, GAME_STATES} from "../../config/constants.js";
import {addGameAction} from "./actionLogger.js";
import {updatedGameData} from "../../socket/utils/gameManager.js";
import {normalizePlayers} from "../../socket/utils/sanitizeRoom.js";

export const gameRooms = new Map();
export const connectedPlayers = new Map();

export const createGameRoom = async (gameId) => {

    const fetchedGame = await updatedGameData(gameId)

    const playersMap = normalizePlayers(fetchedGame?.players);

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
        players: playersMap,
        actionHistory: [],
        state: fetchedGame.state || GAME_STATES.WAITING,
        phase: fetchedGame.phase || GAME_PHASES.NIGHT
    };

    gameRooms.set(gameId, roomData);
    return roomData;
}

export const getGameRoom = (gameId) => {
    const room = gameRooms.get(gameId);
    if (!room) return undefined;
    if (!(room.players instanceof Map)) {
        room.players = normalizePlayers(room.players);
        gameRooms.set(gameId, room);
    }
    return room;
}

export const addPlayerToGame = (socket, gameId, userData) => {
    const roomData = getGameRoom(gameId);
    if (!roomData) return;
    const mainRoom = `game-${gameId}`;

    socket.join(mainRoom);

    let preserved = {};
    let oldKey = null;
    try {
        for (const [key, p] of roomData.players.entries()) {
            if (!p) continue;
            if ((p.id && String(p.id) === String(userData.id)) ||
                (p.socketId && String(p.socketId) === String(userData.id)) ||
                (p.socketId && String(p.socketId) === String(socket.id))) {
                oldKey = key;
                preserved.role = p.role;
                preserved.isBot = p.isBot;
                preserved.isAdmin = p.isAdmin;
                preserved.isAlive = (typeof p.isAlive !== 'undefined') ? p.isAlive : true;
                preserved.online = (typeof p.online !== 'undefined') ? p.online : false;
                preserved.victories = p.victories;
                break;
            }
        }
    } catch (e) {
        console.error("Erreur lors de la recherche d'une ancienne entrée joueur :", e);
    }

    if (oldKey && oldKey !== socket.id) {
        try {
            roomData.players.delete(oldKey);
        } catch (e) {
            // ignore
        }
    }

    const mergedUser = {
        socketId: socket.id,
        ...userData,
        role: preserved.role ?? userData.role ?? null,
        isBot: preserved.isBot ?? userData.isBot ?? false,
        isAdmin: preserved.isAdmin ?? userData.isAdmin ?? false,
        isAlive: preserved.isAlive ?? (typeof userData.isAlive !== 'undefined' ? userData.isAlive : true),
        victories: preserved.victories ?? userData.victories ?? 0,
        online: preserved.online ?? userData.online ?? true,
    };

    // update connectedPlayers and roomData
    connectedPlayers.set(socket.id, {
        ...mergedUser,
        gameId,
        socketId: socket.id
    });

    roomData.players.set(socket.id, mergedUser);

    roomData.lastActivity = new Date();
    gameRooms.set(gameId, roomData);
};

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

    let message = `${playerInfo.nickname} a quitté la partie`;
    if (roomData.state === GAME_STATES.WAITING) {
        roomData.players.delete(socket.id);
    } else {
        //TODO: fix this
        const playerData = roomData.players.get(socket.id);
        if (playerData) {
            playerData.online = false;
            roomData.players.set(socket.id, playerData);
            message = `${playerInfo.nickname} s'est déconnecté`;
        }
    }

    roomData.lastActivity = new Date();

    addGameAction(gameId, {
        type: ACTION_TYPES.PLAYER_LEFT,
        playerName: playerInfo.nickname,
        playerRole: playerInfo.role,
        message,
        phase: "connection"
    });

    io.in(`game-${gameId}`).emit("players-update", {
        players: Array.from(roomData.players.values())
    });

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