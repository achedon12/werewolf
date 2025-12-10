import {addPlayerToChannel, connectedPlayers, gameRooms, getGameRoom} from "./roomManager.js";
import {addGameAction, getGameHistory} from "./actionLogger.js";
import {defaultGameConfig, getRoleById} from "../../../utils/Roles.js";
import {ACTION_TYPES, GAME_PHASES, GAME_STATES} from "../../config/constants.js";
import {giveVoteChannelAccess, handleUpdateAvailableChannels} from "../handlers/chatHandlers.js";
import {countPlayersByCamp, simulateBotVoteAction, startRoleCallSequence} from "../utils/roleTurnManager.js";
import {processNightEliminations} from "../utils/eliminationManager.js";
import {findPlayerById} from "../utils/playerManager.js";
import {sanitizeRoom} from './sanitizeRoom.js';

const hostname = "localhost";
const port = 3000;

export const updatedGameData = async (gameId) => {
    try {
        const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}`);
        return await res.json();
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des données de la game :", err);
        return {};
    }
}

export const updateGameData = async (gameId, updatedData) => {
    try {
        const body = {
            name: updatedData.name,
            configuration: updatedData.configuration,
            type: updatedData.type,
            state: updatedData.state,
            phase: updatedData.phase,
            players: updatedData.players,
            startedAt: updatedData.startedAt,
            endedAt: updatedData.endedAt
        };

        if (Array.isArray(updatedData.users)) {
            body.users = updatedData.users;
        }
        if (Array.isArray(updatedData.winners)) {
            body.winners = updatedData.winners;
        }

        const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour des données de la game :", err);
        return {};
    }
}

export const startGameLogic = async (socket, io, gameId) => {
    const roomData = getGameRoom(gameId);
    console.log(`▶️ Démarrage de la partie avec ID ${gameId}...`);
    console.log(roomData.players)

    if (!roomData) {
        throw new Error(`Partie avec ID ${gameId} non trouvée, Veuillez recharger la page.`);
    }

    const configuration = JSON.parse(roomData.configuration);
    const connectedPlayersList = Array.from(roomData.players.values()).filter(p => p.online);
    const gamePlayers = Object.values(configuration).reduce((a, b) => a + b, 0);

    if (connectedPlayersList.length !== gamePlayers) {
        throw new Error(`Nombre de joueurs insuffisant pour démarrer la partie (joueurs connectés: ${connectedPlayersList.length}, joueurs requis: ${gamePlayers})`);
    }

    if (roomData.state !== GAME_STATES.WAITING) {
        throw new Error(`La partie a déjà commencé ou est terminée.`);
    }

    roomData.state = GAME_STATES.IN_PROGRESS;
    roomData.phase = GAME_PHASES.NIGHT;
    roomData.turn = 1;
    roomData.lastActivity = new Date();
    roomData.startedAt = new Date().toISOString();

    addGameAction(gameId, {
        type: ACTION_TYPES.GAME_EVENT,
        playerName: "Système",
        playerRole: "system",
        message: `🚀 La partie a commencé ! Phase: Nuit`,
        phase: "game_start"
    });

    io.to(`game-${gameId}-general`).emit("chat-message", {
        type: ACTION_TYPES.SYSTEM,
        playerName: "Système",
        message: `🚀 La partie commence ! Bonne chance à tous.`,
        createdAt: new Date().toISOString(),
        channel: "general"
    });

    const roleCounts = configuration;
    let roles = [];
    Object.entries(roleCounts).forEach(([role, count]) => {
        const roleData = getRoleById(Number(role));
        for (let i = 0; i < count; i++) roles.push(roleData.name);
    });

    roles = roles.sort(() => Math.random() - 0.5);

    // give specific role to achedon12 if present
    const targetPlayerIndex = connectedPlayersList.findIndex(p => p.nickname === 'achedon12');
    // if (targetPlayerIndex !== -1) {
    //     const roleIndex = roles.findIndex(r => r.toLowerCase() === 'chasseur');
    //     if (roleIndex !== -1 && roleIndex !== targetPlayerIndex) {
    //         const temp = roles[targetPlayerIndex];
    //         roles[targetPlayerIndex] = roles[roleIndex];
    //         roles[roleIndex] = temp;
    //         console.log(`🔮 Le joueur achedon12 a reçu son rôle prédéfini`);
    //     }
    // }

    for (const player of connectedPlayersList) {
        const idx = connectedPlayersList.indexOf(player);
        player.role = player.role ? player.role : roles[idx];

        connectedPlayers.set(player.socketId, {
            ...player,
            role: player.role,
            isBot: player.isBot || false
        });

        const socketId = player.socketId;
        if (roomData.players.has(socketId)) {
            const p = roomData.players.get(socketId);
            p.role = player.role;
            p.isBot = player.isBot;

            if (p.role === 'Loup-Garou') {
                await addPlayerToChannel(io.sockets.sockets.get(socketId), io, gameId, 'werewolves');
            }

            if (p.role === 'Sœur') {
                await addPlayerToChannel(io.sockets.sockets.get(socketId), io, gameId, 'sisters');
            }

            if (!p.isBot) {
                handleUpdateAvailableChannels(io.sockets.sockets.get(socketId), io, gameId);
            }
        }
    }

    roomData.config = Object.assign({}, defaultGameConfig);
    gameRooms.set(gameId, roomData);

    io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
    io.to(`game-${gameId}`).emit("howl");
    io.to(`game-${gameId}`).emit("ambiant-settings", {
        themeEnabled: true,
        soundsEnabled: true
    });

    const countdownSeconds = 10;
    const perRoleSeconds = 60;
    const votingSeconds = 60;

    io.to(`game-${gameId}`).emit("starting-soon", countdownSeconds);
    io.to(`game-${gameId}`).emit("players-update", {
        players: Array.from(roomData.players.values())
    });

    await updateGameData(gameId, {
        state: GAME_STATES.IN_PROGRESS,
        phase: GAME_PHASES.NIGHT,
        players: Array.from(roomData.players.values()),
        startedAt: new Date().toISOString(),
    });

    roomData.players = Array.from(roomData.players.values());
    roomData.lastActivity = new Date();
    gameRooms.set(gameId, roomData);

    io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(roomData));

    const runNightCycle = async () => {
        const room = getGameRoom(gameId);
        if (!room || room.state !== GAME_STATES.IN_PROGRESS) return;

        if (room.roleCallController && typeof room.roleCallController.stop === 'function') {
            try {
                room.roleCallController.stop();
            } catch (e) {
                console.error(e);
            }
            delete room.roleCallController;
        }

        room.phase = GAME_PHASES.NIGHT;
        roomData.turnsCount = 1;
        room.lastActivity = new Date();
        gameRooms.set(gameId, room);
        io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(room));
        io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

        room.roleCallController = startRoleCallSequence(io, gameId, perRoleSeconds, {
            onFinished: async () => {
                const r = getGameRoom(gameId);
                if (!r) return;

                applyThiefExchange(io, gameId, r);

                await processNightEliminations(io, gameId);

                // Start voting phase
                r.phase = GAME_PHASES.VOTING;
                r.lastActivity = new Date();
                gameRooms.set(gameId, r);
                addGameAction(gameId, {
                    type: ACTION_TYPES.GAME_EVENT,
                    playerName: "Système",
                    playerRole: "system",
                    message: `🗳️ La phase de vote commence ! Veuillez voter pour éliminer un joueur.`,
                    phase: GAME_PHASES.VOTING
                });

                if (r._votingTimeout) {
                    clearTimeout(r._votingTimeout);
                    delete r._votingTimeout;
                }
                if (r._votingInterval) {
                    clearInterval(r._votingInterval);
                    delete r._votingInterval;
                }

                io.in(`game-${gameId}`).emit('voting-start', votingSeconds);
                io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(r));
                io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

                const playersArray = r.players instanceof Map
                    ? Array.from(r.players.values())
                    : Array.isArray(r.players)
                        ? r.players
                        : [];
                for (const p of playersArray) {
                    if (p && !p.isBot && p.isAlive && p.socketId) {
                        io.to(p.socketId).emit('game-set-number-can-be-selected', 1);
                    }
                }
                await giveVoteChannelAccess(io, gameId);

                // Simulate bot votes
                simulateBotVoteAction(io, gameId, votingSeconds);

                let remainingVoteSec = votingSeconds;
                io.in(`game-${gameId}`).emit('voting-tick', {remaining: remainingVoteSec});
                r._votingInterval = setInterval(() => {
                    remainingVoteSec -= 1;
                    if (remainingVoteSec <= 0) {
                        io.in(`game-${gameId}`).emit('voting-tick', {remaining: 0});
                        if (r._votingInterval) {
                            clearInterval(r._votingInterval);
                            delete r._votingInterval;
                        }
                        return;
                    }
                    io.in(`game-${gameId}`).emit('voting-tick', {remaining: remainingVoteSec});
                }, 1000);

                r._votingTimeout = setTimeout(async () => {
                    const rr = getGameRoom(gameId);
                    if (!rr) return;

                    if (rr._votingInterval) {
                        clearInterval(rr._votingInterval);
                        delete rr._votingInterval;
                    }
                    if (rr._votingTimeout) {
                        clearTimeout(rr._votingTimeout);
                        delete rr._votingTimeout;
                    }

                    try {
                        const votesMap = (rr.config && rr.config.votes) ? rr.config.votes : {};
                        const counts = {};
                        for (const voterId of Object.keys(votesMap)) {
                            const targetId = votesMap[voterId];
                            if (targetId == null) continue;
                            const key = String(targetId);
                            counts[key] = (counts[key] || 0) + 1;
                        }

                        let maxCount = 0;
                        for (const k of Object.keys(counts)) {
                            if (counts[k] > maxCount) maxCount = counts[k];
                        }

                        if (maxCount > 0) {
                            const topIds = Object.keys(counts).filter(k => counts[k] === maxCount);

                            if (topIds.length > 1) {
                                const topTwo = topIds.slice(0, 2);
                                const names = topTwo.map(id => {
                                    const p = findPlayerById(rr, id);
                                    console.log("Vote tied player:", id, p);
                                    if (!p) {
                                        return String(id);
                                    }
                                    return p.isBot ? p.nickname : p.botName || String(id);
                                }).filter(Boolean);

                                const message = `${names.join(' et ')} ont le même nombre de vote, le village n'a pas su se décider, personne n'est éliminé.`;

                                addGameAction(gameId, {
                                    type: ACTION_TYPES.GAME_EVENT,
                                    playerName: "Système",
                                    playerRole: "system",
                                    message,
                                    phase: GAME_PHASES.VOTING,
                                    createdAt: new Date().toISOString()
                                });

                                await giveVoteChannelAccess(io, gameId);
                                if (rr.config) rr.config.votes = {};
                                rr.lastActivity = new Date();
                                gameRooms.set(gameId, rr);

                                io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(rr));
                                io.to(`game-${gameId}`).emit("players-update", {players: Array.from(rr.players.values())});
                                io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

                            } else {
                                const selectedId = topIds[0];
                                const eliminated = findPlayerById(rr, selectedId);
                                if (eliminated && eliminated.isAlive !== false) {
                                    eliminated.isAlive = false;
                                    eliminated.eliminatedByVote = true;
                                    eliminated.eliminatedAt = new Date().toISOString();

                                    addGameAction(gameId, {
                                        type: ACTION_TYPES.GAME_EVENT,
                                        playerName: "Système",
                                        playerRole: "system",
                                        message: `⚰️ ${eliminated.nickname || eliminated.botName}(${eliminated.role}) a été éliminé(e) par vote (${maxCount} vote${maxCount > 1 ? 's' : ''}).`,
                                        details: `Votes: ${maxCount}`,
                                        phase: GAME_PHASES.VOTING,
                                        createdAt: new Date().toISOString()
                                    });

                                    console.log(`⚰️ Élimination par vote dans la partie ${gameId} : ${eliminated.nickname} (${maxCount} votes)`);

                                    if (eliminated.role === 'Chasseur') {
                                        console.log(`Chasseur ${eliminated.nickname || eliminated.botName} eliminated by vote, handling shoot...`);
                                        await handleHunterShoot(io, gameId, eliminated, 20);
                                    }

                                    try {
                                        const loversCfg = rr.config && rr.config.lovers ? rr.config.lovers : {};
                                        const partnersToKill = [];

                                        if (loversCfg.exists && Array.isArray(loversCfg.players)) {
                                            for (const entry of loversCfg.players) {
                                                if (Array.isArray(entry) && entry.includes(selectedId)) {
                                                    const partnerId = entry.find(i => String(i) !== String(selectedId));
                                                    if (partnerId) partnersToKill.push(partnerId);
                                                } else if (String(entry) === String(selectedId)) {
                                                    const others = loversCfg.players.filter(i => String(i) !== String(selectedId));
                                                    for (const pid of others) partnersToKill.push(pid);
                                                }
                                            }
                                        }

                                        for (const pid of Array.from(new Set(partnersToKill))) {
                                            const partner = findPlayerById(rr, pid);
                                            if (partner && partner.isAlive !== false) {
                                                partner.isAlive = false;
                                                partner.eliminatedAt = new Date().toISOString();
                                                addGameAction(gameId, {
                                                    type: ACTION_TYPES.GAME_EVENT,
                                                    playerName: "Système",
                                                    playerRole: "system",
                                                    message: `💔 À cause du lien d'amour, ${partner.nickname || partner.botName} meurt de chagrin.`,
                                                    phase: GAME_PHASES.DAY,
                                                    createdAt: new Date().toISOString()
                                                });

                                                if (partner.role === 'Chasseur') {
                                                    console.log(`Chasseur ${partner.nickname || partner.botName} eliminated due to lover link, handling shoot...`);
                                                    await handleHunterShoot(io, gameId, partner, 20);
                                                }
                                            }
                                        }
                                    } catch (err) {
                                        console.error("❌ Erreur lors de la gestion des amoureux après vote:", err);
                                    }

                                    if (rr.config) rr.config.votes = {};
                                    rr.lastActivity = new Date();
                                    gameRooms.set(gameId, rr);
                                    io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(rr));
                                    io.to(`game-${gameId}`).emit("players-update", {players: Array.from(rr.players.values())});
                                    io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

                                    if (evaluateWinCondition(io, gameId)) {
                                        return;
                                    }
                                } else {
                                    if (rr.config) rr.config.votes = {};
                                    gameRooms.set(gameId, rr);
                                }
                            }
                        } else {
                            if (rr.config) rr.config.votes = {};
                            gameRooms.set(gameId, rr);
                        }
                    } catch (e) {
                        console.error("❌ Erreur lors du décompte des votes:", e);
                    }

                    rr.lastActivity = new Date();
                    addGameAction(gameId, {
                        type: ACTION_TYPES.GAME_EVENT,
                        playerName: "Système",
                        playerRole: "system",
                        message: `🗳️ La période de vote est terminée. La nuit commence.`,
                        phase: GAME_PHASES.NIGHT
                    });

                    rr.phase = GAME_PHASES.NIGHT;
                    rr.turnsCount += 1;
                    rr.config.wolves.targets = {};
                    rr.config.witch.savedTarget = null;
                    rr.config.witch.poisonedTarget = null;
                    rr.config.hunter.target = null;
                    rr.config.saving.prevTarget = rr.config.saving.target;
                    rr.config.saving.target = null;
                    gameRooms.set(gameId, rr);
                    //await updatePlayersChannels(io, Array.from(rr.players.values()).filter(p => p.online), gameId);
                    io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(rr));
                    io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

                    delete rr.roleCallController;

                    const still = getGameRoom(gameId);
                    if (still && still.state === GAME_STATES.IN_PROGRESS) {
                        setImmediate(runNightCycle);
                    }
                }, votingSeconds * 1000);
            }
        });
    }

    setTimeout(() => {
        const roomNow = getGameRoom(gameId);
        if (!roomNow || roomNow.state !== GAME_STATES.IN_PROGRESS) return;
        runNightCycle();
    }, countdownSeconds * 1000);
}

export const evaluateWinCondition = (io, gameId) => {
    const r = getGameRoom(gameId);
    if (!r) return false;

    const counts = countPlayersByCamp(gameId);
    const wolves = counts.wolves || 0;
    const villagers = counts.villagers || 0;
    const totalAlive = counts.totalAlive || 0;
    const loversCount = counts.lovers || 0;
    const playersArray = r.players instanceof Map
        ? Array.from(r.players.values())
        : Array.isArray(r.players)
            ? r.players
            : [];

    const getAlivePlayers = (roomObj) => {
        if (!roomObj) return [];
        const playersArr = roomObj.players instanceof Map
            ? Array.from(roomObj.players.values())
            : Array.isArray(roomObj.players)
                ? roomObj.players
                : [];
        return playersArr.filter(p => p && p.isAlive !== false);
    };

    const hasCrossAlignedLoversWithOthers = (roomObj) => {
        const alive = getAlivePlayers(roomObj);
        if (!alive.length) return false;

        const loverPairs = [];
        if (roomObj.config && roomObj.config.lovers && Array.isArray(roomObj.config.lovers.players)) {
            const pair = roomObj.config.lovers.players;
            if (pair.length >= 2) {
                const a = alive.find(p => p.id === pair[0]);
                const b = alive.find(p => p.id === pair[1]);
                if (a && b) loverPairs.push([a, b]);
            }
        }

        for (const p of alive) {
            if (p.isLover && p.loverWith) {
                const partner = alive.find(x => x.id === p.loverWith);
                if (partner) loverPairs.push([p, partner]);
            } else if (p.isLover && typeof p.loverId !== 'undefined') {
                const partner = alive.find(x => x.id === p.loverId);
                if (partner) loverPairs.push([p, partner]);
            }
        }

        const unique = [];
        const seen = new Set();
        for (const [a, b] of loverPairs) {
            const key = [String(a.id), String(b.id)].sort().join('|');
            if (!seen.has(key)) {
                seen.add(key);
                unique.push([a, b]);
            }
        }

        for (const [a, b] of unique) {
            const aIsWolf = /Loup-Garou/i.test(a.role);
            const bIsWolf = /Loup-Garou/i.test(b.role);
            if (aIsWolf !== bIsWolf) {
                const others = alive.filter(p => p.id !== a.id && p.id !== b.id);
                if (others.length > 0) {
                    return true;
                }
            }
        }
        return false;
    };

    if (loversCount >= 2 && totalAlive === 2) {
        r.state = GAME_STATES.FINISHED;
        r.phase = GAME_PHASES.FINISHED;
        addGameAction(gameId, {
            type: ACTION_TYPES.GAME_EVENT,
            playerName: "Système",
            playerRole: "system",
            message: `🏆 Les Amoureux ont gagné !`,
            phase: r.phase,
            createdAt: new Date().toISOString()
        });

        const winners = getAlivePlayers(r).map(p => p.id).filter(Boolean);
        persistWinners(gameId, winners).catch(e => console.error(e));

        if (r.roleCallController && typeof r.roleCallController.stop === 'function') {
            try {
                r.roleCallController.stop();
            } catch (e) {
                console.error(e);
            }
            delete r.roleCallController;
        }
        if (r._votingInterval) {
            clearInterval(r._votingInterval);
            delete r._votingInterval;
        }
        if (r._votingTimeout) {
            clearTimeout(r._votingTimeout);
            delete r._votingTimeout;
        }
        r.lastActivity = new Date();
        gameRooms.set(gameId, r);
        io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(r));
        io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
        return true;
    }

    if (wolves <= 0 && totalAlive > 0) {
        r.state = GAME_STATES.FINISHED;
        r.phase = GAME_PHASES.FINISHED;
        addGameAction(gameId, {
            type: ACTION_TYPES.GAME_EVENT,
            playerName: "Système",
            playerRole: "system",
            message: `🏆 Les Villageois ont gagné !`,
            phase: r.phase,
            createdAt: new Date().toISOString()
        });

        const winners = playersArray
            .filter(p => p && !/Loup-Garou/i.test(p.role))
            .map(p => p.id)
            .filter(Boolean);
        persistWinners(gameId, winners).catch(e => console.error(e));

        if (r.roleCallController && typeof r.roleCallController.stop === 'function') {
            try {
                r.roleCallController.stop();
            } catch (e) {
                console.error(e);
            }
            delete r.roleCallController;
        }
        if (r._votingInterval) {
            clearInterval(r._votingInterval);
            delete r._votingInterval;
        }
        if (r._votingTimeout) {
            clearTimeout(r._votingTimeout);
            delete r._votingTimeout;
        }
        r.lastActivity = new Date();
        gameRooms.set(gameId, r);
        io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(r));
        io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
        return true;
    }

    if (wolves > 0 && villagers === 0) {
        if (hasCrossAlignedLoversWithOthers(r)) {
            return false;
        }

        r.state = GAME_STATES.FINISHED;
        r.phase = GAME_PHASES.FINISHED;
        addGameAction(gameId, {
            type: ACTION_TYPES.GAME_EVENT,
            playerName: "Système",
            playerRole: "system",
            message: `🏆 Les Loups-Garous ont gagné !`,
            phase: r.phase,
            createdAt: new Date().toISOString()
        });

        const winners = playersArray
            .filter(p => p && /Loup-Garou/i.test(p.role))
            .map(p => p.id)
            .filter(Boolean);
        persistWinners(gameId, winners).catch(e => console.error(e));

        if (r.roleCallController && typeof r.roleCallController.stop === 'function') {
            try {
                r.roleCallController.stop();
            } catch (e) {
                console.error(e);
            }
            delete r.roleCallController;
        }
        if (r._votingInterval) {
            clearInterval(r._votingInterval);
            delete r._votingInterval;
        }
        if (r._votingTimeout) {
            clearTimeout(r._votingTimeout);
            delete r._votingTimeout;
        }
        r.lastActivity = new Date();
        gameRooms.set(gameId, r);
        io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(r));
        io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
        return true;
    }

    return false;
};

const persistWinners = async (gameId, winnerIds = []) => {
    try {
        const uniqueUserIds = Array.from(new Set((winnerIds || []).filter(Boolean)));
        if (uniqueUserIds.length === 0) return;

        const r = getGameRoom(gameId);
        if (!r) return;

        const playersArray = r.players instanceof Map
            ? Array.from(r.players.values())
            : Array.isArray(r.players)
                ? r.players
                : [];

        for (const p of playersArray) {
            if (p && p.id && uniqueUserIds.includes(p.id)) {
                p.victories = (p.victories || 0) + 1;
            }
        }

        r.players = playersArray instanceof Array ? playersArray : Array.from(playersArray);
        r.endedAt = new Date().toISOString();
        r.lastActivity = new Date();
        gameRooms.set(gameId, r);

        await updateGameData(gameId, {
            state: GAME_STATES.FINISHED,
            phase: GAME_PHASES.FINISHED,
            winners: uniqueUserIds,
            endedAt: new Date().toISOString(),
        });
        console.log(`✅ Gagnants persistés pour la partie ${gameId}:`, uniqueUserIds);

        await persistGameLogs(gameId)

    } catch (err) {
        console.error('❌ Erreur persistWinnersViaUpdate:', err);
    }
};

const persistGameLogs = async (gameId) => {
    console.log(`💾 Persistance des logs de la partie ${gameId}...`);
    const history = getGameHistory(gameId);
    try {
        await fetch(`http://${hostname}:${port}/api/game/${gameId}/log`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({logs: history})
        });
    } catch (err) {
        console.error("❌ Erreur lors de la persistance des logs de la game :", err);
    }
}

const applyThiefExchange = (io, gameId, room) => {
    if (!room || !room.config || !room.config.thief) return;
    const thiefCfg = room.config.thief;

    if (thiefCfg.applied) return;
    const choices = Array.isArray(thiefCfg.choices) ? thiefCfg.choices : [];

    if (choices.length !== 2) return;

    const [idA, idB] = choices;
    const pA = findPlayerById(room, idA);
    const pB = findPlayerById(room, idB);

    if (!pA || !pB) return;

    const oldRoleA = pA.role;
    pA.role = pB.role;
    pB.role = oldRoleA;

    const updateConnectedPlayerRole = (player) => {
        if (!player) return;
        if (player.socketId && connectedPlayers.has(player.socketId)) {
            const cp = connectedPlayers.get(player.socketId);
            connectedPlayers.set(player.socketId, {
                ...cp,
                role: player.role
            });
            return;
        }
        for (const [sid, cp] of connectedPlayers.entries()) {
            if (cp && cp.id !== undefined && String(cp.id) === String(player.id)) {
                connectedPlayers.set(sid, {
                    ...cp,
                    role: player.role
                });
                break;
            }
        }
    };

    updateConnectedPlayerRole(pA);
    updateConnectedPlayerRole(pB);

    thiefCfg.applied = true;
    thiefCfg.swapped = true;

    addGameAction(gameId, {
        type: ACTION_TYPES.GAME_EVENT,
        playerName: "Système",
        playerRole: "system",
        message: `🃏 Le Voleur a échangé les cartes de 2 joueurs, faites attention à vos nouvelles identités !`,
        phase: GAME_PHASES.DAY,
        createdAt: new Date().toISOString()
    });

    if (pA.socketId) {
        io.to(pA.socketId).emit('game-notify', `Votre carte a été changée au lever du jour. Vous êtes maintenant ${pA.role}.`);
    }
    if (pB.socketId) {
        io.to(pB.socketId).emit('game-notify', `Votre carte a été changée au lever du jour. Vous êtes maintenant ${pB.role}.`);
    }

    room.lastActivity = new Date();
    gameRooms.set(gameId, room);
    io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(room));
    io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
};

export const handleHunterShoot = async (io, gameId, hunter, seconds = 20, forcedTargetId = null) => {
    try {
        const r = getGameRoom(gameId);
        if (!r || !hunter) return;

        let resolved = false;
        let resolveCompletion;
        const completionPromise = new Promise((res) => {
            resolveCompletion = () => {
                if (!resolved) {
                    resolved = true;
                    res();
                }
            };
        });

        const clearHunterTimers = (room) => {
            if (!room) return;
            if (room._hunterTimeout) {
                clearTimeout(room._hunterTimeout);
                delete room._hunterTimeout;
            }
            if (room._hunterInterval) {
                clearInterval(room._hunterInterval);
                delete room._hunterInterval;
            }
            if (room._hunterRemainingSeconds !== undefined) {
                delete room._hunterRemainingSeconds;
            }
        };

        const finalizeAndResolve = async (room) => {
            if (!room) return;
            clearHunterTimers(room);
            if (room.config && room.config.hunter) {
                room.config.hunter.pending = false;
                room.config.hunter.target = null;
                room.config.hunter.by = null;
            }
            room.lastActivity = new Date();
            gameRooms.set(gameId, room);
            io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(room));
            io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

            if (room.roleCallController && typeof room.roleCallController.next === 'function') {
                try {
                    room.roleCallController.next();
                } catch (e) {
                    console.error("❌ Erreur lors de l'appel à roleCallController.next():", e);
                }
            }

            resolveCompletion();
        };

        if (forcedTargetId) {
            const target = findPlayerById(r, forcedTargetId);
            if (!target || target.isAlive === false) {
                resolveCompletion();
                return completionPromise;
            }

            target.isAlive = false;
            target.eliminatedByHunter = true;
            target.eliminatedAt = new Date().toISOString();

            addGameAction(gameId, {
                type: ACTION_TYPES.GAME_EVENT,
                playerName: hunter.nickname || hunter.botName,
                playerRole: hunter.role || "Chasseur",
                message: `🔫 ${hunter.nickname || hunter.botName} a tiré sur ${target.nickname || target.botName} (${target.role}).`,
                details: `Tir du chasseur`,
                phase: r.phase,
                createdAt: new Date().toISOString()
            });

            await finalizeAndResolve(r);
            try {
                evaluateWinCondition(io, gameId);
            } catch (e) {
                console.error(e);
            }
            return completionPromise;
        }

        if (hunter.isBot) {
            const playersArray = r.players instanceof Map ? Array.from(r.players.values()) : (Array.isArray(r.players) ? r.players : []);
            const targets = playersArray.filter(p => p && p.isAlive !== false && String(p.id) !== String(hunter.id));
            if (targets.length === 0) {
                resolveCompletion();
                return completionPromise;
            }

            const chosen = targets[Math.floor(Math.random() * targets.length)];
            chosen.isAlive = false;
            chosen.eliminatedByHunter = true;
            chosen.eliminatedAt = new Date().toISOString();

            addGameAction(gameId, {
                type: ACTION_TYPES.HUNTER_SHOT,
                playerName: hunter.botName,
                playerRole: hunter.role,
                message: `🔫 ${hunter.botName} (bot) a tiré sur ${chosen.nickname || chosen.botName} (${chosen.role}).`,
                details: `Tir automatique du bot`,
                phase: r.phase,
                createdAt: new Date().toISOString()
            });

            await finalizeAndResolve(r);
            try {
                evaluateWinCondition(io, gameId);
            } catch (e) {
                console.error(e);
            }
            return completionPromise;
        }

        r.phase = GAME_PHASES.HUNTER_SHOT;
        if (!r.config) r.config = Object.assign({}, defaultGameConfig);
        if (!r.config.hunter) r.config.hunter = {};
        r.config.hunter.pending = true;
        r.config.hunter.by = hunter.id;
        r.config.hunter.target = null;
        r._hunterRemainingSeconds = seconds;

        addGameAction(gameId, {
            type: ACTION_TYPES.GAME_EVENT,
            playerName: "Système",
            playerRole: "system",
            message: `🔫 ${hunter.nickname || hunter.botName} (Chasseur) peut choisir une cible à abattre.`,
            phase: r.phase,
            createdAt: new Date().toISOString()
        });

        if (hunter.socketId) {
            io.to(hunter.socketId).emit('game-notify', `Vous avez ${seconds} secondes pour tirer en tant que Chasseur.`);
            io.to(hunter.socketId).emit('game-set-number-can-be-selected', 1);
            io.to(hunter.socketId).emit('hunter-choice-start', {duration: seconds});
        }

        r.lastActivity = new Date();
        gameRooms.set(gameId, r);
        io.to(`game-${gameId}`).emit("game-update", sanitizeRoom(r));
        io.in(`game-${gameId}`).emit("game-history", getGameHistory(gameId));

        if (r._hunterTimeout) {
            clearTimeout(r._hunterTimeout);
            delete r._hunterTimeout;
        }
        if (r._hunterInterval) {
            clearInterval(r._hunterInterval);
            delete r._hunterInterval;
        }

        r._hunterInterval = setInterval(() => {
            const rr = getGameRoom(gameId);
            if (!rr) {
                if (r._hunterInterval) {
                    clearInterval(r._hunterInterval);
                    delete r._hunterInterval;
                }
                return;
            }
            rr._hunterRemainingSeconds = (typeof rr._hunterRemainingSeconds === 'number') ? rr._hunterRemainingSeconds - 1 : null;
            if (rr._hunterRemainingSeconds < 0) rr._hunterRemainingSeconds = 0;

            io.to(`game-${gameId}`).emit('hunter-choice-tick', {remaining: rr._hunterRemainingSeconds});

            if (rr._hunterRemainingSeconds === 0) {
                if (rr._hunterInterval) {
                    clearInterval(rr._hunterInterval);
                    delete rr._hunterInterval;
                }
            }
        }, 1000);

        r._hunterTimeout = setTimeout(async () => {
            const rr = getGameRoom(gameId);
            if (!rr) {
                resolveCompletion();
                return;
            }

            if (rr.config && rr.config.hunter && rr.config.hunter.target) {
                const tid = rr.config.hunter.target;
                try {
                    await handleHunterShoot(io, gameId, hunter, 0, tid);
                } catch (e) {
                    console.error(e);
                }
                return;
            }

            if (rr.config && rr.config.hunter) {
                rr.config.hunter.pending = false;
                rr.config.hunter.by = null;
                rr.config.hunter.target = null;
            }

            addGameAction(gameId, {
                type: ACTION_TYPES.GAME_EVENT,
                playerName: "Système",
                playerRole: "system",
                message: `⌛ Le Chasseur (${hunter.nickname || hunter.botName}) n'a pas tiré à temps.`,
                phase: rr.phase,
                createdAt: new Date().toISOString()
            });

            await finalizeAndResolve(rr);
            try {
                evaluateWinCondition(io, gameId);
            } catch (e) {
                console.error(e);
            }
        }, seconds * 1000);

        return completionPromise;

    } catch (err) {
        console.error("❌ Erreur handleHunterShoot:", err);
    }
};