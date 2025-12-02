import {addPlayerToChannel, connectedPlayers, gameRooms, getGameRoom} from "../utils/roomManager.js";
import {handleUpdateAvailableChannels} from "../handlers/chatHandlers.js";
import {roles} from "../../../utils/Roles.js";
import {GAME_PHASES, GAME_STATES} from "../../config/constants.js";

export const updatePlayersChannels = async (io, connectedPlayersList, gameId) => {
    const roomData = getGameRoom(gameId)

    const isVotePhase = roomData.phase === GAME_PHASES.VOTING;
    const isNightPhase = roomData.phase === GAME_PHASES.NIGHT;
    const isGeneralPhase = roomData.state = GAME_STATES.WAITING || roomData.state === GAME_STATES.FINISHED;

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

            if (isGeneralPhase) {
                await addPlayerToChannel(io.sockets.sockets.get(socketId), io, gameId, 'general');
            } else if (isNightPhase) {
                if (p.role === 'Loup-Garou') {
                    await addPlayerToChannel(io.sockets.sockets.get(socketId), io, gameId, 'werewolves');
                }

                if (p.role === 'Sœur') {
                    await addPlayerToChannel(io.sockets.sockets.get(socketId), io, gameId, 'sisters');
                }

                if (!p.isBot) {
                    handleUpdateAvailableChannels(io.sockets.sockets.get(socketId), io, gameId);
                }
            } else if (isVotePhase) {
                await addPlayerToChannel(io.sockets.sockets.get(socketId), io, gameId, 'vote');
            }

        }
    }
    gameRooms.set(gameId, roomData);
}