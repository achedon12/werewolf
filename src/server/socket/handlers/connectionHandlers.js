import {connectedPlayers, removePlayerFromGame} from "../utils/roomManager.js";

export const handlePing = (socket) => {
    socket.emit("pong", {
        createdAt: new Date().toISOString(),
        serverTime: Date.now()
    });
}

export const handleDisconnect = (socket, io, reason) => {
    const playerInfo = connectedPlayers.get(socket.id);
    if (!playerInfo) return;

    removePlayerFromGame(socket, io, playerInfo.gameId, playerInfo, true);
    connectedPlayers.delete(socket.id);
}