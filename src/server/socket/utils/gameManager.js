import {getGameRoom} from "./roomManager.js";
import {addGameAction} from "./actionLogger.js";
import {defaultGameConfig, getRoleById} from "../../../utils/Roles.js";

const hostname = "localhost";
const port = 3000;

export async function updatedGameData(gameId) {
    try {
        const res = await fetch(`http://${hostname}:${port}/api/game/${gameId}`);
        return await res.json();
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des données de la game :", err);
        return {};
    }
}

export async function updateGameData(gameId, updatedData) {
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
                players: updatedData.players
            })
        });
        return await res.json();
    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour des données de la game :", err);
        return {};
    }
}

export async function startGameLogic(socket, io, gameId) {
    const roomData = getGameRoom(gameId);

    if (!roomData) {
        throw new Error(`Partie avec ID ${gameId} non trouvée, Veuillez recharger la page.`);
    }

    const configuration = JSON.parse(roomData.configuration);
    const connectedPlayers = Array.from(roomData.players.values()).filter(p => p.online);
    const gamePlayers = Object.values(configuration).reduce((a, b) => a + b, 0);

    if (connectedPlayers.length !== gamePlayers) {
        throw new Error(`Nombre de joueurs insuffisant pour démarrer la partie (joueurs connectés: ${connectedPlayers.length}, joueurs requis: ${gamePlayers})`);
    }

    // TODO: reset for prod
    // if (roomData.state !== 'En attente') {
    //     throw new Error(`La partie a déjà commencé ou est terminée.`);
    // }

    roomData.state = 'En cours';
    roomData.phase = 'nuit';
    roomData.lastActivity = new Date();

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

    connectedPlayers.forEach((player, idx) => {
        player.role = roles[idx];
        const socketId = player.socketId;
        if (roomData.players.has(socketId)) {
            roomData.players.get(socketId).role = player.role;
        }
    });

    roomData.config = defaultGameConfig;

    io.to(`game-${gameId}`).emit("game-history", getGameHistory(gameId));
    io.to(`game-${gameId}`).emit("howl");
    io.to(`game-${gameId}`).emit("ambiant-settings", {
        themeEnabled: true,
        soundsEnabled: true
    });
    io.to(`game-${gameId}`).emit("starting-soon", 10);
    io.to(`game-${gameId}`).emit("players-update", {
        players: Array.from(roomData.players.values())
    });

    await updateGameData(gameId, {
        state: "En cours",
        phase: "Nuit",
        players: Array.from(roomData.players.values())
    });

    const gameData = await updatedGameData(gameId);
    io.to(`game-${gameId}`).emit("game-update", gameData);
}