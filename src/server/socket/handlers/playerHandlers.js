import {connectedPlayers, gameRooms, getGameRoom, removePlayerFromGame} from "../utils/roomManager.js";
import {addGameAction} from "../utils/actionLogger.js";
import {updatedGameData} from "../utils/gameManager.js";
import {ACTION_TYPES} from "../../config/constants.js";
import {defaultGameConfig, playerIsWolf} from "../../../utils/Roles.js";

export const handlePlayerAction = async (socket, io, data) => {
    try {
        const {gameId, selectedPlayers} = data;
        const playerInfo = connectedPlayers.get(socket.id);

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
            phase: roomData.phase
        });

        try {
            if (playerIsWolf(playerInfo.role)) {
                if (!roomData.config) roomData.config = defaultGameConfig;
                const targets = roomData.config.wolves.targets;

                let wolves = [];
                if (roomData.players && typeof roomData.players.get === 'function') {
                    wolves = Array.from(roomData.players.values()).filter(p => p.isAlive && playerIsWolf(p.role));
                } else if (Array.isArray(roomData.players)) {
                    wolves = roomData.players.filter(p => p.isAlive && playerIsWolf(p.role));
                }

                const needed = wolves.length;

                let votes = Object.keys(targets).filter(k => {
                    const v = targets[k];
                    return v != null && v !== '';
                }).length;

                if (votes >= needed) {
                    if (roomData && roomData.roleCallController && typeof roomData.roleCallController.next === 'function') {
                        roomData.roleCallController.next();
                    }
                }
            } else {
                if (roomData && roomData.roleCallController && typeof roomData.roleCallController.next === 'function') {
                    roomData.roleCallController.next();
                }
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
                phase: roomData.phase
            });
            break;
        case 'Cupidon':
            if (selectedPlayers.length !== 2) {
                throw new Error("Cupidon doit sélectionner exactement deux joueurs.");
            }
            const lover1 = findPlayerById(selectedPlayers[0]);
            const lover2 = findPlayerById(selectedPlayers[1]);

            if (!lover1 || !lover2) {
                throw new Error("Joueurs sélectionnés invalides.");
            }

            lover1.isLover = true;
            lover2.isLover = true;
            lover1.loverId = lover2.id;
            lover2.loverId = lover1.id;

            if (!roomData.config) roomData.config = {};
            if (!roomData.config.lovers) roomData.config.lovers = {exists: false, players: []};
            roomData.config.lovers.exists = true;
            roomData.config.lovers.players = [lover1.id, lover2.id];

            io.in(`game-${gameId}`).emit('game-update', roomData);
            io.to(lover1.socketId).emit('start-lover-animation', {
                loverName: lover2.nickname,
                loverId: lover2.id,
                message: `💘 Vous êtes maintenant lié(e) à ${lover2.nickname} !`
            });
            io.to(lover2.socketId).emit('start-lover-animation', {
                loverName: lover1.nickname,
                loverId: lover1.id,
                message: `💘 Vous êtes maintenant lié(e) à ${lover1.nickname} !`
            });

            addGameAction(gameId, {
                type: ACTION_TYPES.CUPIDON_MATCH,
                playerName: playerInfo.nickname,
                playerRole: playerInfo.role,
                message: `${playerInfo.nickname} a lié ${lover1.nickname} et ${lover2.nickname} en tant que Cupidon.`,
                details: `Amoureux: ${lover1.nickname} & ${lover2.nickname}`,
                phase: roomData.phase
            });
            break;
        case 'Loup-Garou':
        case 'Loup-Garou Blanc':
            const attackedPlayer = findPlayerById(selectedPlayers[0]);
            roomData.config.wolves.targets[playerInfo.id] = attackedPlayer.id;
            console.log(`🐺 Loup-Garou ${playerInfo.nickname} a choisi d'attaquer ${attackedPlayer.nickname}`);

            addGameAction(gameId, {
                type: ACTION_TYPES.WEREWOLF_ATTACK,
                playerName: playerInfo.nickname,
                playerRole: playerInfo.role,
                message: `${playerInfo.nickname} a choisi une cible en tant que Loup-Garou.`,
                details: `Cible: ${attackedPlayer.nickname}`,
                phase: roomData.phase
            });
            io.in(`game-${gameId}`).emit('game-update', roomData);
            break;
        default:
            break;
    }
    gameRooms.set(gameId, roomData);
}