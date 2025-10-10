import {connectedPlayers} from "../utils/roomManager.js";

export function handlePing(socket) {
    socket.emit("pong", {
        createdAt: new Date().toISOString(),
        serverTime: Date.now()
    });
}

export function handleDisconnect(socket, io, reason) {
    const playerInfo = connectedPlayers.get(socket.id);
    if (!playerInfo) return;
}