import {addPlayerToChannel, connectedPlayers, gameRooms, getGameRoom} from "./roomManager.js";
import {addGameAction, getGameHistory} from "./actionLogger.js";
import {defaultGameConfig, getRoleById} from "../../../utils/Roles.js";
import {ACTION_TYPES, GAME_PHASES, GAME_STATES} from "../../config/constants.js";
import {handleUpdateAvailableChannels} from "../handlers/chatHandlers.js";
import {startRoleCallSequence} from "../utils/roleTurnManager.js";

const hostname = "localhost";
const port = 3000;

export const updatedGameData = async (gameId) => {
    console.log(`🔄 Récupération des données de la game avec ID ${gameId}...`);
    try {
        const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}`);
        return await res.json();
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des données de la game :", err);
        return {};
    }
}

export const updateGameData = async (gameId, updatedData) => {
    console.log(`🔄 Mise à jour des données de la game avec ID ${gameId}...`, updatedData);
    try {
        const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: updatedData.name,
                configuration: updatedData.configuration,
                type: updatedData.type,
                state: updatedData.state,
                phase: updatedData.phase,
                players: updatedData.players,
                startedAt: updatedData.startedAt,
            })
        });
        return await res.json();
    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour des données de la game :", err);
        return {};
    }
}

export const startGameLogic = async (socket, io, gameId) => {
    const roomData = getGameRoom(gameId);
    console.log(`▶️ Démarrage de la partie avec ID ${gameId}...`, roomData);

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
    if (targetPlayerIndex !== -1) {
        const voyanteIndex = roles.findIndex(r => r === 'Voleur');
        if (voyanteIndex !== -1 && voyanteIndex !== targetPlayerIndex) {
            // échanger les rôles
            const temp = roles[targetPlayerIndex];
            roles[targetPlayerIndex] = roles[voyanteIndex];
            roles[voyanteIndex] = temp;

            console.log(`🔮 Le joueur achedon12 a reçu son rôle prédéfini`);
        }
    }

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

    roomData.config = defaultGameConfig;
    gameRooms.set(gameId, roomData);

    io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
    io.to(`game-${gameId}`).emit("howl");
    io.to(`game-${gameId}`).emit("ambiant-settings", {
        themeEnabled: true,
        soundsEnabled: true
    });

    const countdownSeconds = 10;

    io.to(`game-${gameId}`).emit("starting-soon", countdownSeconds);
    io.to(`game-${gameId}`).emit("players-update", {
        players: Array.from(roomData.players.values())
    });

    await updateGameData(gameId, {
        state: GAME_STATES.IN_PROGRESS,
        phase: GAME_PHASES.NIGHT,
        players: Array.from(roomData.players.values()),
        startedAt: new Date().toISOString()
    });

    roomData.players = Array.from(roomData.players.values());
    console.log(`🔄 Mise à jour des joueurs de la partie avec ID ${gameId}...`, roomData.players);
    roomData.lastActivity = new Date();
    gameRooms.set(gameId, roomData);

    io.to(`game-${gameId}`).emit("game-update", roomData);

    setTimeout(() => {
        if (roomData.roleCallController && typeof roomData.roleCallController.stop === 'function') {
            try { roomData.roleCallController.stop(); } catch (e) {}
        }

        roomData.roleCallController = startRoleCallSequence(io, gameId, 60, {
            onFinished: async () => {
                roomData.phase = GAME_PHASES.DAY;
                roomData.lastActivity = new Date();
                addGameAction(gameId, {
                    type: ACTION_TYPES.GAME_EVENT,
                    playerName: "Système",
                    playerRole: "system",
                    message: `🌞 La nuit est terminée. Passage au Jour.`,
                    phase: "phase_change"
                });


                io.to(`game-${gameId}`).emit("game-update", roomData);
                io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
                delete roomData.roleCallController;
            }
        });
    }, countdownSeconds * 1000);
}