import {Server} from "socket.io";
import {handleDisconnect, handlePing} from "./handlers/connectionHandlers.js";
import {handleGetAvailableGames, handleJoinChannel, handleJoinGame, handleLeaveGame} from "./handlers/gameHandlers.js";
import {handleRequestHistory, handleSendChat} from "./handlers/chatHandlers.js";
import {handlePlayerAction} from "./handlers/playerHandlers.js";
import {
    handleAddBot,
    handleExcludePlayer,
    handleGetRoomInfo,
    handleStartGame,
    handleUpdateGame
} from "./handlers/adminHandlers.js";

export const initializeSocket = (httpServer, hostname, port) => {
    const io = new Server(httpServer, {
        cors: {
            origin: `http://${hostname}:${port}`,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {

        socket.on("ping", () => handlePing(socket));

        socket.on('get-available-games', () => handleGetAvailableGames(socket, io));

        socket.on("join-game", (gameId, userData, playerRole) =>
            handleJoinGame(socket, io, gameId, userData, playerRole));
        socket.on("leave-game", (gameId, userData) =>
            handleLeaveGame(socket, io, gameId, userData));
        socket.on("join-channel", (gameId, channelType) =>
            handleJoinChannel(socket, io, gameId, channelType));

        socket.on("send-chat", (data) => handleSendChat(socket, io, data));
        socket.on("request-history", (gameId) =>
            handleRequestHistory(socket, gameId));

        socket.on("player-action", (data) => handlePlayerAction(socket, io, data));

        socket.on("start-game", (gameId) => handleStartGame(socket, io, gameId));
        socket.on("update-game", (gameId, updatedData) =>
            handleUpdateGame(socket, io, gameId, updatedData));
        socket.on("exclude-player", (gameId, targetPlayerId, reason) =>
            handleExcludePlayer(socket, io, gameId, targetPlayerId, reason));
        socket.on("add-bot", (gameId, botName, botType) =>
            handleAddBot(socket, io, gameId, botName, botType));
        socket.on("get-room-info", (gameId) =>
            handleGetRoomInfo(socket, gameId));

        socket.on("disconnect", (reason) => handleDisconnect(socket, io, reason));
    });

    return io;
}