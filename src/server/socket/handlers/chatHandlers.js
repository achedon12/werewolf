import {addPlayerToChannel, connectedPlayers, getGameRoom} from "../utils/roomManager.js";
import {addGameAction, getGameHistory} from "../utils/actionLogger.js";
import {ACTION_TYPES, GAME_PHASES, GAME_STATES} from "../../config/constants.js";

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

export const handleUpdateAvailableChannels = (socket, io, gameId) => {
    try {
        const roomData = getGameRoom(gameId);
        if (!roomData) return;

        const playerInfo = connectedPlayers.get(socket.id);
        if (!playerInfo) return;

        const isWerewolf = playerInfo.role === "Loup-Garou" || playerInfo.role === "Loup-Garou Blanc";
        const isVotePhase = roomData.phase === GAME_PHASES.VOTING;
        const isSister = playerInfo.role === "Sœur";
        const isGeneral = roomData.state === GAME_STATES.WAITING;
        const lovers = roomData?.config?.lovers?.exists ? roomData.config.lovers.players : [];
        const isLover = lovers.includes(playerInfo.id);

        const availableChannels = {
            general: isGeneral,
            werewolves: isWerewolf,
            vote: isVotePhase,
            sisters: isSister,
            lovers: isLover
        };

        socket.emit("available-channels", availableChannels);
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour des canaux disponibles:", error);
    }
}

export const giveVoteChannelAccess = async (io, gameId) => {
    const r = getGameRoom(gameId);
    if (!r) return;

    try {
        const playersArray = r.players instanceof Map
            ? Array.from(r.players.values())
            : Array.isArray(r.players)
                ? r.players
                : [];

        for (const p of playersArray) {
            if (!p && !p.online && p.isBot && !p.isAlive) continue;
            if (!p.socketId) continue;
            const sock = io.sockets.sockets.get(p.socketId);
            if (!sock) continue;
            try {
                await addPlayerToChannel(sock, io, gameId, 'vote');
                handleUpdateAvailableChannels(sock, io, gameId);
            } catch (err) {
                console.error(`Erreur handleUpdateAvailableChannels pour ${p.socketId}:`, err);
            }
        }
    } catch (err) {
        console.error("Erreur lors de l'ajout des joueurs au channel vote :", err);
    }
}
