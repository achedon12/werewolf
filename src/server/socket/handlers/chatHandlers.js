import {connectedPlayers, getGameRoom} from "../utils/roomManager.js";
import {addGameAction, getGameHistory} from "../utils/actionLogger.js";
import {ACTION_TYPES} from "../../config/constants.js";

export const handleSendChat = (socket, io, data)=> {
    try {
        const {gameId, message, channel = "general"} = data;
        const playerInfo = connectedPlayers.get(socket.id);

        if (!gameId || !message || !playerInfo) {
            return;
        }

        const roomData = getGameRoom(gameId);
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

        if (channel === "general") {
            addGameAction(gameId, {
                type: ACTION_TYPES.CHAT_MESSAGE,
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
}

export const handleRequestHistory = (socket, gameId)=> {
    try {
        const history = getGameHistory(gameId);
        socket.emit("game-history", history);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'historique:", error);
        socket.emit("history-error", {error: "Impossible de charger l'historique"});
    }
}