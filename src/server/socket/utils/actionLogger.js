import {getGameRoom} from "./roomManager.js";

export const addGameAction = (gameId, actionData) => {
    const roomData = getGameRoom(gameId);
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

export const getGameHistory = (gameId) => {
    const roomData = getGameRoom(gameId);
    if (!roomData) return [];
    return roomData.actionHistory;
}