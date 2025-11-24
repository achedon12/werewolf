import {defaultGameConfig, gameRoleCallOrder, RoleSelectionCount} from '../../../utils/Roles.js';
import {getGameRoom} from '../../socket/utils/roomManager.js';
import {addGameAction, getGameHistory} from './actionLogger.js';
import {ACTION_TYPES} from '../../config/constants.js';

const sanitizeRoleChannel = (roleName) =>
    roleName.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w-]/g, '');

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = (arr) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;

const getSelectionCountForRole = (roleName, players) => {
    const base = RoleSelectionCount.hasOwnProperty(roleName) ? RoleSelectionCount[roleName] : 1;

    if (base > 0 && players && players.length === 1) {
        return Math.min(base, players.length);
    }
    return base;
};

const simulateBotAction = (roleName, bot, io, gameId) => {
    const roomData = getGameRoom(gameId);
    const allPlayers = Array.from(roomData.players.values()).filter(p => p.isAlive !== false);
    const others = allPlayers.filter(p => p.id !== bot.id);

    let target = null;
    let type = ACTION_TYPES.GENERAL_ACTION;
    let message = '';

    switch (roleName) {
        case 'Cupidon':
            type = ACTION_TYPES.CUPIDON_MATCH;
            const candidatesPrefer = others.filter(p => !p.isBot);
            const pool = (candidatesPrefer.length >= 2) ? candidatesPrefer : others;

            if (pool.length < 2) {
                message = `${bot.nickname} (bot) n'a pas trouvé assez de joueurs à lier`;
            } else {
                const first = pickRandom(pool);
                const secondPool = pool.filter(p => p.id !== first.id);
                const second = pickRandom(secondPool.length ? secondPool : others.filter(p => p.id !== first.id));

                if (first && second) {
                    if (!roomData.config) roomData.config = {};
                    if (!roomData.config.lovers) roomData.config.lovers = {exists: false, players: []};

                    roomData.config.lovers.exists = true;
                    roomData.config.lovers.players = [first.id, second.id];

                    for (const p of roomData.players.values()) {
                        if (p.id === first.id) {
                            p.isLover = true;
                            p.loverWith = second.id;
                            if (p.socketId) {
                                io.to(p.socketId).emit('start-lover-animation', {
                                    loverName: second.nickname,
                                    loverId: second.id,
                                    message: `💘 Vous êtes maintenant lié(e) à ${second.nickname} !`
                                });
                            }
                        }
                        if (p.id === second.id) {
                            p.isLover = true;
                            p.loverWith = first.id;
                            if (p.socketId) {
                                io.to(p.socketId).emit('start-lover-animation', {
                                    loverName: first.nickname,
                                    loverId: first.id,
                                    message: `💘 Vous êtes maintenant lié(e) à ${first.nickname} !`
                                });
                            }
                        }
                    }

                    message = `💘 ${bot.nickname} (bot) a lié ${first.nickname} et ${second.nickname}`;
                    io.in(`game-${gameId}`).emit('game-update', roomData);
                }
            }
            break;
        case 'Loup-Garou':
        case 'Loup-Garou Blanc':
            type = ACTION_TYPES.WEREWOLF_ATTACK;

            target = getMostTargetPlayerByWolves(roomData);
            const players = others.filter(p => p.isAlive !== false && !/Loup-Garou/i.test(p.role));

            const allBotsOnly = players.length > 0 && players.every(p => p.isBot);
            if (allBotsOnly && !target) {
                const allAlive = Array.from(roomData.players.values()).filter(p => p.isAlive !== false);
                const possible = allAlive.filter(p => !/Loup-Garou/i.test(p.role));
                const pick = pickRandom(possible.length ? possible : allAlive);
                target = pick ? pick : null;
            }
            console.log(`🐺 Loup-Garou bot ${bot.nickname} vérification cible majoritaire => ${target ? target.nickname : 'aucune'}`);

            if (!target) {
                const noWolves = others.filter(p => !/Loup-Garou/i.test(p.role));
                target = pickRandom(noWolves.length ? noWolves : others);
                console.log(`🐺 Loup-Garou bot ${bot.nickname} cible aléatoire choisie => ${target ? target.nickname : 'aucune'}`);
            }

            roomData.config.wolves.targets[bot.id] = target.id;

            message = target ? `🐺 ${bot.nickname} (bot) attaque ${target.nickname}` : `${bot.nickname} (bot) n'a pas trouvé de cible`;
            io.in(`game-${gameId}`).emit('game-update', roomData);
            break;
        case 'Voyante':
            type = ACTION_TYPES.SEER_REVEAL;
            target = pickRandom(others);
            message = target ? `🔎 ${bot.nickname} (bot) a regardé ${target.nickname}` : `${bot.nickname} (bot) n'a pas trouvé de cible`;
            break;
        case 'Salvateur':
            type = ACTION_TYPES.DOCTOR_HEAL;
            target = pickRandom(allPlayers);
            message = target ? `🛡️ ${bot.nickname} (bot) protège ${target.nickname}` : `${bot.nickname} (bot) n'a pas trouvé de cible`;
            break;
        case 'Renard':
            type = ACTION_TYPES.FOX;
            target = pickRandom(others);
            message = target ? `🦊 ${bot.nickname} (bot) a testé ${target.nickname}` : `${bot.nickname} (bot) n'a pas trouvé de cible`;
            break;
        case 'Sorciere':
            type = ACTION_TYPES.WITCH_POTION;
            if (Math.random() < 0.4) {
                target = pickRandom(others);
                message = target ? `☠️ ${bot.nickname} (bot) empoisonne ${target.nickname}` : `${bot.nickname} (bot) n'a pas trouvé de cible`;
            } else {
                message = `${bot.nickname} (bot) n'utilise pas de potion`;
            }
            break;
        case 'Voleur':
            type = ACTION_TYPES.THIEF;
            message = `${bot.nickname} (bot) effectue une action de voleur`;
            break;
        default:
            message = `${bot.nickname} (bot) n'a pas d'action nocturne`;
            break;
    }

    addGameAction(gameId, {
        type,
        playerName: bot.nickname,
        playerRole: roleName,
        message,
        phase: roomData.phase,
        createdAt: new Date().toISOString()
    });

    io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

    console.log(`🤖 Action de bot simulée: ${message}`);

    if (target) {
        if (!roomData._simulatedActions) roomData._simulatedActions = [];
        roomData._simulatedActions.push({role: roleName, actor: bot.id, target: target.id, ts: Date.now()});
    }
};

export const startRoleCallSequence = (io, gameId, perRoleSeconds = 30, options = {}) => {
    const roomData = getGameRoom(gameId);
    if (!roomData) {
        console.warn(`startRoleCallSequence: room ${gameId} introuvable`);
        return null;
    }

    console.log(`🔔 Démarrage des tours nocturnes pour la partie ${gameId}`);

    let index = 0;
    let timer = null;
    let remaining = perRoleSeconds;
    let stopped = false;

    const scheduledBotTimeouts = new Map();

    const getPlayersForRole = (roleName) => {
        return Array
            .from(roomData.players.values())
            .filter(p => p.role === roleName && p.isAlive !== false);
    };

    const clearBotTimeoutsForIndex = (idx) => {
        const entry = scheduledBotTimeouts.get(idx);
        if (entry && entry.timeouts && entry.timeouts.length) {
            for (const t of entry.timeouts) clearTimeout(t);
        }
        scheduledBotTimeouts.delete(idx);
    };

    const clearAllBotTimeouts = () => {
        for (const [k, entry] of scheduledBotTimeouts.entries()) {
            if (entry && entry.timeouts) {
                for (const t of entry.timeouts) clearTimeout(t);
            }
        }
        scheduledBotTimeouts.clear();
    };

    const emitStartForRole = (roleName, players, roleIdx) => {
        console.log(`🔔 Début du tour pour le rôle ${roleName} (${players.length} joueur(s)) dans la partie ${gameId}`);
        roomData.turn = roleIdx;
        io.in(`game-${gameId}`).emit('game-update', roomData);

        const payload = {
            role: roleName,
            players: players.map(p => ({id: p.id, nickname: p.nickname, isBot: !!p.isBot})),
            duration: perRoleSeconds
        };

        io.in(`game-${gameId}`).emit('role-call-start', payload);
        const channel = sanitizeRoleChannel(roleName);
        io.in(`game-${gameId}-${channel}`).emit && io.in(`game-${gameId}-${channel}`).emit('role-call-start', payload);

        const alivePlayers = Array.from(roomData.players.values()).filter(p => p.isAlive !== false);
        const selectionCount = getSelectionCountForRole(roleName, alivePlayers);
        for (const p of players) {
            if (p && p.socketId) {
                console.log(`--> Notifying player ${p.nickname} (${roleName}) they can select ${selectionCount} target(s)`);
                io.to(p.socketId).emit('game-set-number-can-be-selected', selectionCount);
            }
        }

        addGameAction(gameId, {
            type: ACTION_TYPES.GAME_EVENT,
            playerName: "Système",
            playerRole: "system",
            message: `🔔 ${roleName} peut maintenant agir`,
            phase: "role_call"
        });

        io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

        const bots = players.filter(p => p.isBot);
        const timeouts = [];
        const now = Date.now();
        const startTs = now;
        const endTs = now + perRoleSeconds * 1000;
        const maxDelay = Math.max(1, perRoleSeconds - 1);
        const meta = {timeouts, startTs, endTs, executed: 0, totalBots: bots.length};
        if (timeouts.length || bots.length) scheduledBotTimeouts.set(roleIdx, meta);

        for (const bot of bots) {
            const delaySec = randInt(1, maxDelay);
            const t = setTimeout(() => {
                const currentRole = gameRoleCallOrder[roleIdx];
                if (!stopped && currentRole === roleName) {
                    simulateBotAction(roleName, bot, io, gameId);
                    console.log(`🤖 Action simulée pour le bot ${bot.nickname} (${roleName}) après ${delaySec}s dans la partie ${gameId}`);
                }

                const entry = scheduledBotTimeouts.get(roleIdx);
                if (entry) {
                    entry.executed = (entry.executed || 0) + 1;
                    const remainingSec = Math.max(0, Math.ceil((entry.endTs - Date.now()) / 1000));
                    // émettre tick pour rafraîchir le timer côté client
                    io.in(`game-${gameId}`).emit('role-call-tick', {role: roleName, remaining: remainingSec});
                    const channel = sanitizeRoleChannel(roleName);
                    io.in(`game-${gameId}-${channel}`).emit && io.in(`game-${gameId}-${channel}`).emit('role-call-tick', {
                        role: roleName,
                        remaining: remainingSec
                    });

                    // Si tous les acteurs sont des bots et qu'ils ont tous agi -> terminer le rôle tôt
                    const playersForThisRole = getPlayersForRole(roleName);
                    const allBotsOnlyNow = playersForThisRole.length > 0 && playersForThisRole.every(p => p.isBot);
                    if (allBotsOnlyNow && entry.executed >= entry.totalBots) {
                        // annuler l'intervalle principal
                        if (timer) {
                            clearInterval(timer);
                            timer = null;
                        }
                        // envoyer tick final 0 et terminer le rôle
                        io.in(`game-${gameId}`).emit('role-call-tick', {role: roleName, remaining: 0});
                        io.in(`game-${gameId}-${channel}`).emit && io.in(`game-${gameId}-${channel}`).emit('role-call-tick', {
                            role: roleName,
                            remaining: 0
                        });
                        // appeler la fin du rôle (cela supprimera les timeouts stockés)
                        emitEndForRole(roleName, roleIdx);
                        // avancer à la suite (petit délai pour conserver le comportement précédent)
                        index += 1;
                        setTimeout(advance, 300);
                    }
                }
            }, delaySec * 1000);
            timeouts.push(t);
        }

        if (timeouts.length) scheduledBotTimeouts.set(roleIdx, meta);
    };

    const emitTick = (roleName, sec) => {
        io.in(`game-${gameId}`).emit('role-call-tick', {role: roleName, remaining: sec});
        const channel = sanitizeRoleChannel(roleName);
        io.in(`game-${gameId}-${channel}`).emit && io.in(`game-${gameId}-${channel}`).emit('role-call-tick', {
            role: roleName,
            remaining: sec
        });
    };

    const emitEndForRole = (roleName, roleIdx) => {
        clearBotTimeoutsForIndex(roleIdx);

        io.in(`game-${gameId}`).emit('role-call-end', {role: roleName});
        const channel = sanitizeRoleChannel(roleName);
        io.in(`game-${gameId}-${channel}`).emit && io.in(`game-${gameId}-${channel}`).emit('role-call-end', {role: roleName});

        io.in(`game-${gameId}`).emit('game-set-number-can-be-selected', 0);
        if (channel) {
            io.in(`game-${gameId}-${channel}`).emit && io.in(`game-${gameId}-${channel}`).emit('game-set-number-can-be-selected', 0);
        }
    };

    const advance = () => {
        if (stopped) return;

        if (index >= gameRoleCallOrder.length) {
            clearAllBotTimeouts();
            io.in(`game-${gameId}`).emit('role-call-finished');

            const allPlayers = Array.from(roomData.players.values());
            for (const p of allPlayers) {
                if (p && p.socketId) io.to(p.socketId).emit('game-set-number-can-be-selected', 0);
            }

            addGameAction(gameId, {
                type: ACTION_TYPES.GAME_EVENT,
                playerName: "Système",
                playerRole: "system",
                message: `🌅 Les tours nocturnes sont terminés`,
                phase: "role_call_finished"
            });
            if (typeof options.onFinished === 'function') {
                try {
                    options.onFinished();
                } catch (e) {
                    console.error(e);
                }
            }
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            return;
        }

        const roleIdx = index;
        const roleName = gameRoleCallOrder[roleIdx];
        const players = getPlayersForRole(roleName);

        if (!players || players.length === 0) {
            index += 1;
            setImmediate(advance);
            return;
        }

        remaining = perRoleSeconds;
        emitStartForRole(roleName, players, roleIdx);
        emitTick(roleName, remaining);

        if (timer) {
            clearInterval(timer);
            timer = null;
        }

        timer = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                clearInterval(timer);
                timer = null;
                emitEndForRole(roleName, roleIdx);
                index += 1;
                setTimeout(advance, 300);
                return;
            }
            emitTick(roleName, remaining);
        }, 1000);
    };

    const stop = () => {
        stopped = true;
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        clearAllBotTimeouts();
        io.in(`game-${gameId}`).emit('role-call-stopped');

        const allPlayers = Array.from(roomData.players.values());
        for (const p of allPlayers) {
            if (p && p.socketId) io.to(p.socketId).emit('game-set-number-can-be-selected', 0);
        }
    };

    const next = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        clearBotTimeoutsForIndex(index);
        index += 1;
        setImmediate(advance);
    };

    const getStatus = () => ({
        currentIndex: index,
        currentRole: gameRoleCallOrder[index] || null,
        remaining,
        running: !stopped && !!timer
    });

    setImmediate(advance);

    return {stop, next, getStatus};
};

const getMostTargetPlayerByWolves = (room) => {
    if (!room.config) room.config = defaultGameConfig;
    const wolvesTarget = room.config && room.config.wolves && room.config.wolves.targets;
    if (!wolvesTarget) return null;

    const targetCount = {};
    for (const wolfId in wolvesTarget) {
        const targetId = wolvesTarget[wolfId];
        if (targetId && targetId !== '') {
            if (!targetCount[targetId]) targetCount[targetId] = 0;
            targetCount[targetId] += 1;
        }
    }
    let maxCount = 0;
    let selectedPlayerId = null;
    for (const targetId in targetCount) {
        if (targetCount[targetId] > maxCount) {
            maxCount = targetCount[targetId];
            selectedPlayerId = targetId;
        }
    }
    if (selectedPlayerId) {
        return Array.from(room.players.values()).find(p => p.id === selectedPlayerId) || null;
    }
    return null;
};