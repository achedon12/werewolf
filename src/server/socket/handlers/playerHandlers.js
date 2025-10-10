import {connectedPlayers, getGameRoom, removePlayerFromGame} from "../utils/roomManager.js";
import {addGameAction} from "../utils/actionLogger.js";
import {updatedGameData} from "../utils/gameManager.js";

export const handlePlayerAction = async (socket, io, data) => {
    try {
        const {gameId, action, targetPlayerId, type, playerName, playerRole, details = {}} = data;
        const playerInfo = connectedPlayers.get(socket.id);

        if (!gameId || !playerInfo) {
            throw new Error("Données manquantes");
        }

        const roomData = getGameRoom(gameId);
        if (!roomData) return;

        const {actionMessage, actionType} = getActionDetails(type, playerName, details);

        const newAction = addGameAction(gameId, {
            type: actionType,
            playerName: playerName,
            playerRole: playerRole,
            message: actionMessage,
            details: details,
            phase: roomData.phase || "game"
        });

        io.to(`game-${gameId}`).emit("new-action", newAction);

        if (type !== "chat_message") {
            const gameData = await updatedGameData(gameId);
            io.to(`game-${gameId}`).emit("game-update", gameData);
        }

    } catch (error) {
        console.error("❌ Erreur lors du traitement de l'action:", error);
        socket.emit("action-error", {
            error: "Échec de l'action",
            details: error.message
        });
    }
}

export const handleDisconnect = (socket, io, reason) => {
    const playerInfo = connectedPlayers.get(socket.id);
    if (!playerInfo) return;

    removePlayerFromGame(socket, io, playerInfo.gameId, playerInfo, true);
}

const getActionDetails = (type, playerName, details) => {
    switch (type) {
        case "vote":
            return {
                actionMessage: `🗳️ ${playerName} a voté contre un joueur`,
                actionType: "player_vote"
            };
        case "attack":
            return {
                actionMessage: `🐺 ${playerName} a attaqué un villageois`,
                actionType: "werewolf_attack"
            };
        case "reveal":
            return {
                actionMessage: `🔮 ${playerName} a utilisé son pouvoir de voyante`,
                actionType: "seer_reveal"
            };
        case "heal":
            return {
                actionMessage: `🏥 ${playerName} a soigné un joueur`,
                actionType: "doctor_heal"
            };
        case "phase_change":
            return {
                actionMessage: `🔄 La phase change: ${details.phase}`,
                actionType: "phase_change"
            };
        case "player_eliminated":
            return {
                actionMessage: `💀 ${playerName} a été éliminé`,
                actionType: "player_eliminated"
            };
        default:
            return {
                actionMessage: `⚡ ${playerName} a effectué une action`,
                actionType: "game_action"
            };
    }
}