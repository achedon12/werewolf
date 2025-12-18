import {addGameAction, getGameHistory} from "./actionLogger.js";
import {ACTION_TYPES, GAME_PHASES} from "../../config/constants.js";
import {gameRooms, getGameRoom} from "./roomManager.js";
import {getMostTargetByWolvesPlayerId} from "../utils/roleTurnManager.js";
import {evaluateWinCondition, handleHunterShoot} from "../utils/gameManager.js";
import {sanitizeRoom} from "../../socket/utils/sanitizeRoom.js";
import {defaultGameConfig} from "../../../utils/Roles.js";
import {findPlayerById} from "../../socket/utils/playerManager.js";

export const processNightEliminations = async (io, gameId) => {
    try {
        const r = getGameRoom(gameId);
        console.log(`🔄 Processing night eliminations for game ${gameId}...`);
        if (!r) return;

        if (!r.config) r.config = Object.assign({}, defaultGameConfig);
        const cfg = r.config;

        const now = new Date().toISOString();
        const eliminatedThisNight = [];

        let wolfTargetId = null;
        try {
            if (typeof getMostTargetByWolvesPlayerId === 'function') {
                wolfTargetId = getMostTargetByWolvesPlayerId(r);
            }
        } catch (e) {
            console.error("Erreur récupération cible loups:", e);
        }

        if (!wolfTargetId && cfg.wolves && cfg.wolves.targets) {
            const counts = {};
            for (const k of Object.keys(cfg.wolves.targets || {})) {
                const v = cfg.wolves.targets[k];
                if (v == null) continue;
                const key = String(v);
                counts[key] = (counts[key] || 0) + 1;
            }
            let max = 0;
            for (const k of Object.keys(counts)) {
                if (counts[k] > max) {
                    max = counts[k];
                    wolfTargetId = k;
                }
            }
        }

        if (wolfTargetId) {
            const wolfTarget = findPlayerById(r, wolfTargetId);
            if (wolfTarget && wolfTarget.isAlive !== false) {
                let savedByWitch = false;
                const witchCfg = cfg.witch || {};

                if (witchCfg.savedTarget && String(witchCfg.savedTarget) === String(wolfTargetId)) {
                    savedByWitch = true;
                    addGameAction(gameId, {
                        type: ACTION_TYPES.GAME_EVENT,
                        playerName: "Système",
                        playerRole: "system",
                        message: `🧙‍♀️ La Sorcière a sauvé ${wolfTarget.nickname || wolfTarget.botName}.`,
                        phase: r.phase,
                        createdAt: now
                    });
                }

                if (!savedByWitch) {
                    wolfTarget.isAlive = false;
                    wolfTarget.eliminatedByWolf = true;
                    wolfTarget.eliminatedAt = now;
                    eliminatedThisNight.push(wolfTarget);

                    addGameAction(gameId, {
                        type: ACTION_TYPES.GAME_EVENT,
                        playerName: "Système",
                        playerRole: "system",
                        message: `☠️ ${wolfTarget.nickname || wolfTarget.botName} a été tué(e) par les Loups-Garous.`,
                        details: `Cible: ${wolfTarget.nickname || wolfTarget.botName}`,
                        phase: r.phase,
                        createdAt: now
                    });
                }
            }
        }

        if (cfg.witch && cfg.witch.poisonedTarget) {
            const poisonedId = cfg.witch.poisonedTarget;
            const poisoned = findPlayerById(r, poisonedId);
            if (poisoned && poisoned.isAlive !== false) {
                poisoned.isAlive = false;
                poisoned.eliminatedByWitch = true;
                poisoned.eliminatedAt = now;
                eliminatedThisNight.push(poisoned);

                addGameAction(gameId, {
                    type: ACTION_TYPES.GAME_EVENT,
                    playerName: "Système",
                    playerRole: "system",
                    message: `☠️ ${poisoned.nickname || poisoned.botName} a été empoisonné(e) par la Sorcière.`,
                    details: `Cible empoisonnée: ${poisoned.nickname || poisoned.botName}`,
                    phase: r.phase,
                    createdAt: now
                });
            }
        }

        try {
            const loversCfg = cfg.lovers || {};
            const partnersToKill = [];

            if (loversCfg.exists && Array.isArray(loversCfg.players)) {
                for (const killed of eliminatedThisNight.slice()) {
                    for (const entry of loversCfg.players) {
                        if (Array.isArray(entry) && entry.includes(killed.id)) {
                            const partnerId = entry.find(i => String(i) !== String(killed.id));
                            if (partnerId) partnersToKill.push(partnerId);
                        } else if (String(entry) === String(killed.id)) {
                            const others = loversCfg.players.filter(i => String(i) !== String(killed.id));
                            for (const pid of others) partnersToKill.push(pid);
                        }
                    }
                }
            }

            for (const pid of Array.from(new Set(partnersToKill))) {
                const partner = findPlayerById(r, pid);
                if (partner && partner.isAlive !== false) {
                    partner.isAlive = false;
                    partner.eliminatedAt = now;
                    eliminatedThisNight.push(partner);

                    addGameAction(gameId, {
                        type: ACTION_TYPES.GAME_EVENT,
                        playerName: "Système",
                        playerRole: "system",
                        message: `💔 À cause du lien d'amour, ${partner.nickname || partner.botName} meurt de chagrin.`,
                        phase: GAME_PHASES.DAY,
                        createdAt: now
                    });

                    if (partner.role === 'Chasseur') {
                        try {
                            await handleHunterShoot(io, gameId, partner, 20);
                        } catch (e) {
                            console.error("Erreur lors du tir du Chasseur (amoureux):", e);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Erreur gestion amoureux:", err);
        }

        for (const p of eliminatedThisNight) {
            if (p && p.role === 'Chasseur') {
                try {
                    await handleHunterShoot(io, gameId, p, 20);
                } catch (e) {
                    console.error("Erreur lors du tir du Chasseur:", e);
                }
            }
        }

        cfg.wolves = cfg.wolves || {};
        cfg.wolves.targets = {};
        if (cfg.witch) {
            cfg.witch.savedTarget = null;
            cfg.witch.poisonedTarget = null;
            cfg.witch.applyThisNight = false;
        }
        if (cfg.hunter) {
            cfg.hunter.target = null;
            cfg.hunter.pending = false;
            cfg.hunter.by = null;
        }
        if (cfg.saving) {
            cfg.saving.prevTarget = cfg.saving.target;
            cfg.saving.target = null;
        }

        r.phase = GAME_PHASES.DAY;
        r.turnsCount = (r.turnsCount || 0) + 1;
        r.lastActivity = new Date();
        gameRooms.set(gameId, r);

        addGameAction(gameId, {
            type: ACTION_TYPES.GAME_EVENT,
            playerName: "Système",
            playerRole: "system",
            message: `🌅 Le jour se lève. Morts au matin: ${eliminatedThisNight.length ? eliminatedThisNight.map(p => p.nickname || p.botName).join(", ") : "Aucune victime"}.`,
            phase: r.phase,
            createdAt: now
        });

        io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(r));
        io.to(`game-${gameId}`).emit("players-update", {players: Array.from(r.players instanceof Map ? Array.from(r.players.values()) : (Array.isArray(r.players) ? r.players : []))});
        io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

        try {
            if (evaluateWinCondition(io, gameId)) {
                return;
            }
        } catch (e) {
            console.error("Erreur evaluateWinCondition après nuit:", e);
        }

    } catch (err) {
        console.error("❌ Erreur processNightEliminations:", err);
    }
};