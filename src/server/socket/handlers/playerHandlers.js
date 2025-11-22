import {connectedPlayers, getGameRoom, removePlayerFromGame} from "../utils/roomManager.js";
import {addGameAction} from "../utils/actionLogger.js";
import {updatedGameData} from "../utils/gameManager.js";
import {ACTION_TYPES} from "../../config/constants.js";

export const handlePlayerAction = async (socket, io, data) => {
    try {
        const {gameId, selectedPlayers} = data;
        const playerInfo = connectedPlayers.get(socket.id);
        console.log("🔔 handlePlayerAction called with data:", data, "from playerInfo:", playerInfo);

        if (!gameId || !playerInfo) {
            throw new Error("Données manquantes");
        }

        const roomData = getGameRoom(gameId);
        if (!roomData) return;

        await processAction(io, socket, playerInfo, data, roomData);
        socket.emit('game-set-number-can-be-selected', 0);
        console.log(`➡️ Action reçue de ${playerInfo.nickname}(${playerInfo.role}) dans le jeu ${gameId}:`, data);

        const {actionMessage, actionType} = getActionDetails(playerInfo.role);

        addGameAction(gameId, {
            type: actionType,
            playerName: playerInfo.nickname,
            playerRole: playerInfo.role,
            message: `${playerInfo.nickname} ${actionMessage}`,
            details: 'Sélectionné(s): ' + (selectedPlayers && selectedPlayers.length > 0 ? selectedPlayers.map(p => p.nickname).join(", ") : "Aucun"),
            phase: roomData.phase || "game"
        });

        try {
            if (roomData && roomData.roleCallController && typeof roomData.roleCallController.next === 'function') {
                roomData.roleCallController.next();
            }
        } catch (err) {
            console.error("❌ Erreur en avançant au rôle suivant:", err);
        }

    } catch (error) {
        console.error("❌ Erreur lors du traitement de l'action:", error);
        socket.emit("action-error", {
            error: "Échec de l'action", details: error.message
        });
    }
}

export const handleDisconnect = (socket, io, reason) => {
    const playerInfo = connectedPlayers.get(socket.id);
    if (!playerInfo) return;

    removePlayerFromGame(socket, io, playerInfo.gameId, playerInfo, true);
    io.emit('game-updated', updatedGameData);
}

const getActionDetails = (role) => {
    switch (role) {
        case "Loup-Garou":
            return {
                actionMessage: "a effectué son choix de Loup-Garou.", actionType: ACTION_TYPES.WEREWOLF_ATTACK
            };
        case "Voyante":
            return {
                actionMessage: "a consulté une carte en tant que Voyante.", actionType: ACTION_TYPES.SEER_REVEAL
            };
        case "Chasseur":
            return {
                actionMessage: "a pris une décision en tant que Chasseur.", actionType: ACTION_TYPES.HUNTER_SHOT
            };
        case "Sorciere":
            return {
                actionMessage: "a utilisé une potion en tant que Sorcière.", actionType: ACTION_TYPES.WITCH_POTION
            };
        default:
            return {
                actionMessage: "a effectué une action.", actionType: ACTION_TYPES.GENERAL_ACTION
            };
    }
}

const processAction = async (io, socket, playerInfo, data, roomData) => {
    const {gameId, selectedPlayers} = data;

    const findPlayerById = (id) => {
        if (!id) return null;
        if (roomData.players && typeof roomData.players.get === 'function') {
            const p = roomData.players.get(id);
            if (p) return p;
            return Array.from(roomData.players.values()).find(pl => String(pl.id) === id) || null;
        } else if (Array.isArray(roomData.players)) {
            return roomData.players.find(pl => String(pl.id) === id) || null;
        }
        return null;
    };

    switch (playerInfo.role) {
        case 'Voyante':
            const targetPlayer = findPlayerById(selectedPlayers[0]);

            const message = `Le rôle de ${targetPlayer.nickname} est ${targetPlayer.role}.`;

            socket.emit('seer-reveal-result', {message, id: targetPlayer.id});
            console.log(`🔮 Voyante ${playerInfo.nickname} a consulté le rôle de ${targetPlayer.nickname}: ${targetPlayer.role}`);

            addGameAction(gameId, {
                type: ACTION_TYPES.SEER_REVEAL,
                playerName: playerInfo.nickname,
                playerRole: playerInfo.role,
                message: `${playerInfo.nickname} a consulté le rôle de ${targetPlayer.nickname} en tant que Voyante.`,
                details: `Rôle révélé: ${targetPlayer.role}`,
                phase: roomData.phase || "game"
            });
            break;
        default:
            break;
    }
}