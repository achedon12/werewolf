import {addGameAction, getGameHistory} from "./actionLogger.js";
import {ACTION_TYPES, GAME_PHASES} from "../../config/constants.js";
import {gameRooms, getGameRoom} from "./roomManager.js";
import {getMostTargetByWolvesPlayerId} from "../utils/roleTurnManager.js";

export const processNightEliminations = async (io, gameId) => {
    const room = getGameRoom(gameId);
    if (!room || !Array.isArray(room.players)) return;

    const config = room.config || {};
    const players = room.players;
    const byId = (p) => p.socketId || p.id;

    const toEliminateMap = new Map();

    // wolves target
    const wolves = config.wolves || {};
    if (wolves.targets) {
        const targetId = getMostTargetByWolvesPlayerId(room);
        if (targetId) {
            const targetPlayer = players.find(p => byId(p) === targetId);
            if (targetPlayer) {
                toEliminateMap.set(targetId, targetPlayer);
                addGameAction(gameId, {
                    type: ACTION_TYPES.GAME_EVENT,
                    playerName: "Système",
                    playerRole: "system",
                    message: `🐺 Les Loups-Garous ont tué ${targetPlayer.nickname}.({$targetPlayer.role}})`,
                    phase: GAME_PHASES.DAY
                });
            }
        }
    }

    if (wolves.whiteTarget) {
        const whiteTargetId = wolves.whiteTarget;
        const whiteTargetPlayer = players.find(p => byId(p) === whiteTargetId);
        if (whiteTargetPlayer) {
            toEliminateMap.set(whiteTargetId, whiteTargetPlayer);
            addGameAction(gameId, {
                type: ACTION_TYPES.GAME_EVENT,
                playerName: "Système",
                playerRole: "system",
                message: `🐺 Le Loup Blanc a tué ${whiteTargetPlayer.nickname}.({$targetPlayer.role}})`,
                phase: GAME_PHASES.DAY
            });
        }
    }

    // Witch poison
    const witch = config.witch || {};
    if (witch.poisonedTarget) {
        const poisonedId = witch.poisonedTarget;
        const poisonedPlayer = players.find(pp => byId(pp) === poisonedId);
        if (poisonedPlayer) {
            toEliminateMap.set(poisonedId, poisonedPlayer);
            addGameAction(gameId, {
                type: ACTION_TYPES.GAME_EVENT,
                playerName: "Système",
                playerRole: "system",
                message: `🧪 La Sorcière a empoisonné ${poisonedPlayer.nickname}.`,
                phase: GAME_PHASES.DAY
            });
        }
    }

    if (toEliminateMap.size === 0) {
        return;
    }

    const lovers = config.lovers || {};
    const markAdditional = [];
    if (lovers.exists && Array.isArray(lovers.players)) {
        for (const [deadId, deadPlayer] of toEliminateMap) {
            for (const entry of lovers.players) {
                if (Array.isArray(entry) && entry.includes(deadId)) {
                    const partnerId = entry.find(i => i !== deadId);
                    if (partnerId && !toEliminateMap.has(partnerId)) {
                        const partner = players.find(pp => byId(pp) === partnerId);
                        if (partner) markAdditional.push(partner);
                    }
                } else if (entry === deadId) {
                    const others = lovers.players.filter(i => i !== deadId);
                    for (const partnerId of others) {
                        if (!toEliminateMap.has(partnerId)) {
                            const partner = players.find(pp => byId(pp) === partnerId);
                            if (partner) markAdditional.push(partner);
                        }
                    }
                }
            }
        }
    }

    const hunterConfig = config.hunter || {};
    if (hunterConfig.targetOnDeath) {
    }

    for (const p of markAdditional) {
        toEliminateMap.set(byId(p), p);
        addGameAction(gameId, {
            type: ACTION_TYPES.GAME_EVENT,
            playerName: "Système",
            playerRole: "system",
            message: `💔 À cause du lien d'amour, ${p.nickname} meurt de chagrin.`,
            phase: GAME_PHASES.DAY
        });
    }


    // Apply eliminations
    for(const player of room.players) {
        if (toEliminateMap.has(byId(player))) {
            player.isAlive = false;
            player.eliminatedAt = new Date();
        }
    }
    room.lastActivity = new Date();
    gameRooms.set(gameId, room);
    io.to(`game-${gameId}`).emit("players-update", {players: room.players});
    io.to(`game-${gameId}`).emit("game-update", room);
    io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

};