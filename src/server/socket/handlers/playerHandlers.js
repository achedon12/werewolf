import {
    addPlayerToChannel,
    connectedPlayers,
    gameRooms,
    getGameRoom,
    removePlayerFromGame
} from "../utils/roomManager.js";
import {addGameAction, getGameHistory} from "../utils/actionLogger.js";
import {handleHunterShoot, updatedGameData} from "../utils/gameManager.js";
import {ACTION_TYPES, GAME_PHASES} from "../../config/constants.js";
import {defaultGameConfig, playerIsWolf} from "../../../utils/Roles.js";
import {sanitizeRoom} from "../utils/sanitizeRoom.js";
import {findPlayerById} from "../utils/playerManager.js";
import {handleUpdateAvailableChannels} from "./chatHandlers.js";

export const handlePlayerAction = async (socket, io, data) => {
    try {
        const {gameId, selectedPlayers, type} = data;
        const playerInfo = connectedPlayers.get(socket.id);

        if (!gameId || !playerInfo) {
            throw new Error("Données manquantes");
        }

        const roomData = getGameRoom(gameId);
        if (!roomData) return;

        await processAction(io, socket, playerInfo, data, roomData);
        socket.emit('game-set-number-can-be-selected', 0);
        console.log(`➡️ Action reçue de ${playerInfo.nickname}(${playerInfo.role}) dans le jeu ${gameId}:`);

        const {actionMessage, actionType} = getActionDetails(playerInfo.role, type);

        addGameAction(gameId, {
            type: actionType,
            playerName: playerInfo.nickname,
            playerRole: playerInfo.role,
            message: `${playerInfo.nickname} ${actionMessage}`,
            details: 'Sélectionné(s): ' + (selectedPlayers && selectedPlayers.length > 0 ? selectedPlayers.map(p => p.nickname).join(", ") : "Aucun"),
            phase: roomData.phase
        });

        try {
            if (roomData.phase === GAME_PHASES.NIGHT && type !== ACTION_TYPES.PLAYER_VOTE) {
                io.in(`game-${gameId}`).emit('game-update', sanitizeRoom(roomData));
                io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
                if (playerIsWolf(playerInfo.role)) {
                    if (!roomData.config) roomData.config = Object.assign({}, defaultGameConfig);
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
                    if (roomData.roleCallController && roomData.phase === GAME_PHASES.HUNTER_SHOT && playerInfo.role === 'Chasseur') {
                        roomData.roleCallController.next();
                    } else if (roomData && roomData.roleCallController && typeof roomData.roleCallController.next === 'function') {
                        roomData.roleCallController.next();
                    }
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

const getActionDetails = (role, type) => {
    if (type === ACTION_TYPES.PLAYER_VOTE) {
        return {
            actionMessage: "a voté pour un joueur.", actionType: ACTION_TYPES.PLAYER_VOTE
        };
    }
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
                actionMessage: type === 'heal' ? "a utilisé la potion de vie en tant que Sorcière." :
                    type === 'poison' ? "a utilisé la potion de poison en tant que Sorcière." :
                        "n'a pas utilisé de potion en tant que Sorcière.",
                actionType: type === 'heal' ? ACTION_TYPES.WITCH_HEAL :
                    type === 'poison' ? ACTION_TYPES.WITCH_POISON :
                        ACTION_TYPES.WITCH_NO_ACTION
            };
        case "Cupidon":
            return {
                actionMessage: "a lié deux joueurs en tant que Cupidon.", actionType: ACTION_TYPES.CUPIDON_MATCH
            };
        default:
            return {
                actionMessage: "a effectué une action.", actionType: ACTION_TYPES.GENERAL_ACTION
            };
    }
}

const processAction = async (io, socket, playerInfo, data, roomData) => {
    const {gameId, selectedPlayers, type} = data;

    if (roomData.phase === GAME_PHASES.VOTING) {
        if (type === ACTION_TYPES.PLAYER_VOTE) {
            if (selectedPlayers.length !== 1) {
                socket.emit('game-set-number-can-be-selected', 1);
                socket.emit('game-notify', 'Veuillez sélectionner exactement un joueur à voter.');
                console.log("❌ Vote invalide, réinitialisation de la sélection.");
                return;
            }

            const votedPlayer = findPlayerById(roomData, selectedPlayers[0]);
            roomData.config.votes[playerInfo.id] = votedPlayer.id;
            console.log(`🗳️ ${playerInfo.nickname} a voté pour ${votedPlayer.nickname}`);

            addGameAction(gameId, {
                type: ACTION_TYPES.GAME_EVENT,
                playerName: playerInfo.nickname,
                playerRole: playerInfo.role,
                message: `🗳️ ${playerInfo.nickname} a voté pour ${votedPlayer.nickname}.`,
                details: `Vote pour: ${votedPlayer.nickname}`,
                phase: roomData.phase
            });

            io.in(`game-${gameId}`).emit('game-update', sanitizeRoom(roomData));
            io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

        }
    }

    if (roomData.phase === GAME_PHASES.HUNTER_SHOT && playerInfo.role === 'Chasseur') {
        const hunterCfg = roomData.config && roomData.config.hunter ? roomData.config.hunter : null;
        if (hunterCfg && hunterCfg.pending && String(hunterCfg.by) === String(playerInfo.id)) {
            if (!selectedPlayers || selectedPlayers.length !== 1) {
                socket.emit('game-set-number-can-be-selected', 1);
                socket.emit('game-notify', 'Veuillez sélectionner exactement un joueur à éliminer.');
                console.log("❌ Le Chasseur doit sélectionner exactement un joueur.");
                return;
            }

            const target = findPlayerById(roomData, selectedPlayers[0]);
            if (!target) {
                socket.emit('game-notify', 'Cible invalide.');
                return;
            }

            roomData.config.hunter.target = target.id;
            roomData.lastActivity = new Date();
            gameRooms.set(gameId, roomData);

            await handleHunterShoot(io, gameId, playerInfo, 0, target.id);

            socket.emit('game-set-number-can-be-selected', 0);
            return;
        }
        return;
    }

    if (roomData.phase === GAME_PHASES.NIGHT) {
        switch (playerInfo.role) {
            case 'Voyante':
                const targetPlayer = findPlayerById(roomData, selectedPlayers[0]);

                socket.emit('seer-reveal-result', {
                    message: `Le rôle de ${targetPlayer.nickname} est ${targetPlayer.role}.`,
                    id: targetPlayer.id
                });
                console.log(`🔮 Voyante ${playerInfo.nickname} a consulté le rôle de ${targetPlayer.nickname}: ${targetPlayer.role}`);

                roomData.config.seer.revealedPlayers.push({
                    seerId: playerInfo.id,
                    targetIdId: targetPlayer.id,
                    revealedRole: targetPlayer.role
                });

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
                if (roomData.config.lovers.exists) {
                    break;
                }

                if (selectedPlayers.length !== 2) {
                    throw new Error("Cupidon doit sélectionner exactement deux joueurs.");
                }

                const lover1 = findPlayerById(roomData, selectedPlayers[0]);
                const lover2 = findPlayerById(roomData, selectedPlayers[1]);

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

                io.in(`game-${gameId}`).emit('game-update', sanitizeRoom(roomData));
                if (lover1.socketId) {
                    io.to(lover1.socketId).emit('start-lover-animation', {
                        loverName: lover2.nickname,
                        loverId: lover2.id,
                        message: `💘 Vous êtes maintenant lié(e) à ${lover2.nickname} !`
                    });
                    const sock1 = io.sockets.sockets.get(lover1.socketId);
                    if (sock1) {
                        await addPlayerToChannel(sock1, io, gameId, 'lovers');
                        handleUpdateAvailableChannels(sock1, io, gameId);
                    }

                }
                if (lover2.socketId) {
                    io.to(lover2.socketId).emit('start-lover-animation', {
                        loverName: lover1.nickname,
                        loverId: lover1.id,
                        message: `💘 Vous êtes maintenant lié(e) à ${lover1.nickname} !`
                    });
                    const sock2 = io.sockets.sockets.get(lover2.socketId);
                    if (sock2) {
                        await addPlayerToChannel(sock2, io, gameId, 'lovers');
                        handleUpdateAvailableChannels(sock2, io, gameId);
                    }
                }

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
                const attackedPlayer = findPlayerById(roomData, selectedPlayers[0]);
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
                io.in(`game-${gameId}`).emit('game-update', sanitizeRoom(roomData));
                break;
            case 'Sorciere':
                const witchConfig = roomData.config.witch;

                let needReset = false
                if (type === ACTION_TYPES.WITCH_HEAL && witchConfig.lifePotionUsed) {
                    console.log("La sorcière a déjà utilisé la potion de vie.");
                    needReset = true;
                } else if (type === ACTION_TYPES.WITCH_POISON && witchConfig.poisonPotionUsed) {
                    console.log("La sorcière a déjà utilisé la potion de poison.");
                    needReset = true;
                }

                if (needReset) {
                    socket.emit('game-set-number-can-be-selected', 1);
                    socket.emit('game-notify', 'Vous avez déjà utilisé cette potion. Veuillez sélectionner une action valide.');
                    console.log("❌ Action de la sorcière invalide, réinitialisation de la sélection.");
                    return;
                }

                let message = `${playerInfo.nickname} n'a pas utilisé de potion en tant que Sorcière.`;
                let details = `Aucune action prise.`;

                if (type === ACTION_TYPES.WITCH_HEAL) {
                    const healedPlayer = findPlayerById(roomData, selectedPlayers[0]);
                    witchConfig.lifePotionUsed = true;
                    witchConfig.savedTarget = healedPlayer.id;

                    socket.emit('game-notify', `Vous avez utilisé votre potion de vie sur ${healedPlayer.nickname}.`);

                    console.log(`🧙‍♀️ Sorcière ${playerInfo.nickname} a utilisé la potion de vie sur ${healedPlayer.nickname}`);

                    message = `${playerInfo.nickname} a utilisé la potion de vie en tant que Sorcière.`;
                    details = `Cible soignée: ${healedPlayer.nickname}`;
                } else if (type === ACTION_TYPES.WITCH_POISON) {
                    const poisonedPlayer = findPlayerById(roomData, selectedPlayers[0]);
                    witchConfig.poisonPotionUsed = true;
                    witchConfig.poisonedTarget = poisonedPlayer.id;

                    socket.emit('game-notify', `Vous avez utilisé votre potion de poison sur ${poisonedPlayer.nickname}.`);

                    console.log(`🧙‍♀️ Sorcière ${playerInfo.nickname} a utilisé la potion de poison sur ${poisonedPlayer.nickname}`);

                    message = `${playerInfo.nickname} a utilisé la potion de poison en tant que Sorcière.`;
                    details = `Cible empoisonnée: ${poisonedPlayer.nickname}`;
                } else {
                    socket.emit('game-notify', `Vous n'avez utilisé aucune potion.`);
                    console.log(`🧙‍♀️ Sorcière ${playerInfo.nickname} n'a utilisé aucune potion.`);
                }

                addGameAction(gameId, {
                    type,
                    playerName: playerInfo.nickname,
                    playerRole: playerInfo.role,
                    message,
                    details,
                    phase: roomData.phase
                });
                break;
            case 'Voleur':
                if (roomData.config.thief.swapped) {
                    socket.emit('game-notify', 'Vous avez déjà effectué votre échange de rôles.');
                    console.log("❌ Action du voleur invalide, réinitialisation de la sélection.");
                    return;
                }

                if (selectedPlayers.length !== 2) {
                    socket.emit('game-set-number-can-be-selected', 2);
                    socket.emit('game-notify', 'Veuillez sélectionner exactement deux joueurs à échanger.');
                    console.log("❌ Action du voleur invalide, réinitialisation de la sélection.");
                    return;
                }

                const first = findPlayerById(roomData, selectedPlayers[0]);
                const second = findPlayerById(roomData, selectedPlayers[1]);

                if (!first || !second) {
                    socket.emit('game-set-number-can-be-selected', 2);
                    socket.emit('game-notify', 'Sélection invalide. Veuillez sélectionner deux joueurs valides.');
                    console.log("❌ Action du voleur invalide, réinitialisation de la sélection.");
                    return;
                }

                roomData.config.thief.choices = [first.id, second.id];
                roomData.config.thief.swapped = true;

                socket.emit('game-notify', `Vous avez échangé les rôles de ${first.nickname} et ${second.nickname}.`);
                console.log(`🕵️‍♂️ Voleur ${playerInfo.nickname} a choisi d'échanger les rôles de ${first.nickname} et ${second.nickname}`);

                addGameAction(gameId, {
                    type: ACTION_TYPES.THIEF,
                    playerName: playerInfo.nickname,
                    playerRole: playerInfo.role,
                    message: `${playerInfo.nickname} a choisi deux joueurs en tant que Voleur.`,
                    details: `Choix: ${first.nickname}, ${second.nickname}`,
                    phase: roomData.phase
                });

                break;
            case 'Enfant Sauvage':
                if (roomData.config.wildChild.transformed) {
                    const attackedPlayer = findPlayerById(roomData, selectedPlayers[0]);
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
                    io.in(`game-${gameId}`).emit('game-update', sanitizeRoom(roomData));
                    return;
                }
                if (roomData.config.wildChild.model) {
                    socket.emit('game-notify', "Vous avez déjà choisi un joueur.");
                    console.log("❌ Action de l'enfant sauvage invalide, réinitialisation de la sélection.");
                    return;
                }

                if (selectedPlayers.length !== 1) {
                    socket.emit('game-set-number-can-be-selected', 1);
                    socket.emit('game-notify', 'Veuillez sélectionner exactement un joueur à imiter.');
                    console.log("❌ Action de l'enfant sauvage invalide, réinitialisation de la sélection.");
                    return;
                }

                const targetChild = findPlayerById(roomData, selectedPlayers[0]);
                roomData.config.wildChild.model = targetChild.id;

                addGameAction(gameId, {
                    type: ACTION_TYPES.WILD_CHILD,
                    playerName: playerInfo.nickname,
                    playerRole: playerInfo.role,
                    message: `${playerInfo.nickname} a choisi un modèle en tant qu'Enfant Sauvage.`,
                    details: `Modèle: ${targetChild.nickname ||targetChild.botName}`,
                    phase: roomData.phase
                });

                socket.emit('game-notify', `Vous avez choisi ${targetChild.nickname} comme modèle.`);
                console.log(`🧒 Enfant Sauvage ${playerInfo.nickname} a choisi d'imiter ${targetChild.nickname}`);
            default:
                break;
        }
    }
    roomData.lastActivity = new Date();
    gameRooms.set(gameId, roomData);
}