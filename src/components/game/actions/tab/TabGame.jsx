import GameBoard from "@/components/game/Board";
import {ACTION_TYPES, GAME_PHASES, GAME_STATES} from "@/server/config/constants";
import {AlertTriangle, Clock, History, Moon, Sun, Users} from "lucide-react";
import {formatDuration} from "@/utils/Date";
import {gameRoleCallOrder, getRoleByName, RoleActionDescriptions} from "@/utils/Roles";
import {getMostTargetByWolvesPlayerId} from "@/server/socket/utils/roleTurnManager.js";

const TabGame = ({
                     game,
                     players,
                     currentPlayer,
                     numberCanBeSelected,
                     selectedPlayers,
                     setSelectedPlayers,
                     roleCallRemaining,
                     votingRemaining,
                     performAction,
                     revealedCards
                 }) => {
    const alivePlayers = players.filter(p => p.isAlive);
    const deadPlayers = players.filter(p => !p.isAlive);
    const parsedConfiguration = game.configuration ? JSON.parse(game.configuration) : {};
    const currentPlayerIsWitch = currentPlayer && currentPlayer.role === "Sorciere";
    const isWitchTurn = game.turn === 7 && game.phase === "Nuit";
    const currentTimer = (game?.phase === GAME_PHASES.VOTING) ? votingRemaining : roleCallRemaining;

    const phaseInfo = {
        [GAME_PHASES.NIGHT]: {
            icon: Moon,
            color: "indigo",
            title: "Phase Nocturne",
            description: "Actions secrètes des rôles"
        },
        [GAME_PHASES.DAY]: {
            icon: Sun,
            color: "amber",
            title: "Phase Diurne",
            description: "Délibérations et votes publics"
        },
        [GAME_PHASES.VOTING]: {
            icon: Users,
            color: "purple",
            title: "Vote",
            description: "Vote pour éliminer un joueur"
        },
        [GAME_PHASES.STARTING]: {
            icon: Clock,
            color: "blue",
            title: "Démarrage de la partie",
            description: "Préparation et attribution des rôles"
        },
        [GAME_PHASES.FINISHED]: {
            icon: History,
            color: "gray",
            title: "Partie Terminée",
            description: "Consultez les résultats et l'historique"
        }
    };
    const currentPhase = phaseInfo[game.phase];
    const mostTargetByWolvesId = getMostTargetByWolvesPlayerId(game);
    const playerTargetByWolves = players.find(p => String(p.id) === mostTargetByWolvesId);

    const roleColor = (roleName) => {
        const role = getRoleByName(roleName);
        const team = role?.team || "";
        if (team.includes("Loup")) return "red";
        if (team.includes("Village")) return "green";
        return "purple";
    };

    const handleWitchPotion = (type) => {
        performAction(type)
    }

    return (
        <div className="space-y-6">
            {(game.state === GAME_STATES.IN_PROGRESS || game.state === GAME_STATES.FINISHED) && (
                <div
                    className={`card glass shadow-2xl backdrop-blur-sm border border-${currentPhase.color}-500/30 bg-gradient-to-r from-${currentPhase.color}-500/10 to-${currentPhase.color}-600/10`}>
                    <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-3 rounded-xl bg-${currentPhase.color}-500/20 border border-${currentPhase.color}-500/30`}>
                                    <currentPhase.icon className={`text-${currentPhase.color}-400`} size={32}/>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {currentPhase.title}
                                    </h2>
                                    <p className="text-gray-300">{currentPhase.description}</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center gap-2 text-gray-300 mb-2">
                                    <Clock size={20}/>
                                    <span className="font-semibold">Temps restant</span>
                                </div>
                                <div
                                    className="text-3xl font-mono font-bold text-white bg-black/30 px-4 py-2 rounded-lg border border-white/10">
                                    {currentTimer !== null && currentTimer !== undefined ? `${currentTimer}s` : (game?.phase === GAME_PHASES.VOTING ? '—' : '—')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div
                    className={game.state === GAME_STATES.WAITING ? "xl:col-span-3 span-y-3" : "xl:col-span-2 space-y-6"}>
                    {(game.state === GAME_STATES.IN_PROGRESS || game.state === GAME_STATES.FINISHED) && (
                        <div className={`alert ${
                            currentPhase.color === 'blue'
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                : currentPhase.color === 'red'
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                    : currentPhase.color === 'purple'
                                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                                        : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
                        }`}>
                            <div className="flex items-center gap-3">
                                <AlertTriangle className={
                                    currentPhase.color === 'blue'
                                        ? 'text-blue-500 dark:text-blue-400'
                                        : currentPhase.color === 'red'
                                            ? 'text-red-500 dark:text-red-400'
                                            : currentPhase.color === 'purple'
                                                ? 'text-purple-500 dark:text-purple-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                }/>
                                <div className="flex flex-col gap-1">
                                    <h3 className={`font-semibold ${
                                        currentPhase.color === 'blue'
                                            ? 'text-blue-900 dark:text-blue-100'
                                            : currentPhase.color === 'red'
                                                ? 'text-red-900 dark:text-red-100'
                                                : currentPhase.color === 'purple'
                                                    ? 'text-purple-900 dark:text-purple-100'
                                                    : 'text-gray-900 dark:text-gray-100'
                                    }`}>
                                        {game.phase === GAME_PHASES.NIGHT ? "🌙 Phase Nocturne" : "☀️ Phase Diurne"}
                                    </h3>
                                    {game.phase === GAME_PHASES.NIGHT && currentPlayer && (
                                        <p className={
                                            currentPhase.color === 'blue'
                                                ? 'text-blue-700 dark:text-blue-300'
                                                : currentPhase.color === 'red'
                                                    ? 'text-red-700 dark:text-red-300'
                                                    : currentPhase.color === 'purple'
                                                        ? 'text-purple-700 dark:text-purple-300'
                                                        : 'text-gray-700 dark:text-gray-300'
                                        }>
                                            {RoleActionDescriptions.hasOwnProperty(currentPlayer.role) ? RoleActionDescriptions[currentPlayer.role] : "Observez et tentez de déduire les rôles des autres joueurs."}
                                        </p>
                                    )}
                                    {numberCanBeSelected > 0 && (
                                        <p className={
                                            currentPhase.color === 'blue'
                                                ? 'text-blue-700 dark:text-blue-300'
                                                : currentPhase.color === 'red'
                                                    ? 'text-red-700 dark:text-red-300'
                                                    : currentPhase.color === 'purple'
                                                        ? 'text-purple-700 dark:text-purple-300'
                                                        : 'text-gray-700 dark:text-gray-300'
                                        }>
                                            Vous pouvez sélectionner jusqu'à <span className="font-semibold text-blue-600 dark:text-blue-400">{numberCanBeSelected}</span> joueur
                                            {numberCanBeSelected > 1 ? "s" : ""}.
                                        </p>
                                    )}
                                    {game.phase === GAME_PHASES.NIGHT && isWitchTurn && currentPlayerIsWitch && (
                                        <p className={
                                            currentPhase.color === 'blue'
                                                ? 'text-blue-700 dark:text-blue-300'
                                                : currentPhase.color === 'red'
                                                    ? 'text-red-700 dark:text-red-300'
                                                    : currentPhase.color === 'purple'
                                                        ? 'text-purple-700 dark:text-purple-300'
                                                        : 'text-gray-700 dark:text-gray-300'
                                        }>
                                            Les Loups-Garous ont ciblé <span className="font-semibold text-red-600 dark:text-red-400">{playerTargetByWolves ? playerTargetByWolves.nickname : "un joueur inconnu"}</span>.
                                        </p>
                                    )}
                                    {game.phase === GAME_PHASES.DAY && (
                                        <p className={
                                            currentPhase.color === 'blue'
                                                ? 'text-blue-700 dark:text-blue-300'
                                                : currentPhase.color === 'red'
                                                    ? 'text-red-700 dark:text-red-300'
                                                    : currentPhase.color === 'purple'
                                                        ? 'text-purple-700 dark:text-purple-300'
                                                        : 'text-gray-700 dark:text-gray-300'
                                        }>
                                            Délibérez ensemble et votez pour éliminer un suspect.
                                        </p>
                                    )}
                                </div>
                                {
                                    game.phase === GAME_PHASES.NIGHT && currentPlayerIsWitch && numberCanBeSelected > 0 && selectedPlayers.length > 0 && (
                                        <div className="flex gap-2 ml-auto">
                                            <button
                                                disabled={String(selectedPlayers[0]) === currentPlayer.id}
                                                onClick={() => handleWitchPotion(ACTION_TYPES.WITCH_POISON)}
                                                className="ml-auto btn btn-sm btn-danger">
                                                Tuer le joueur
                                            </button>
                                            <button
                                                disabled={String(selectedPlayers[0]) !== mostTargetByWolvesId}
                                                onClick={() => handleWitchPotion(ACTION_TYPES.WITCH_HEAL)}
                                                className="ml-auto btn btn-sm btn-success">
                                                Sauver le joueur
                                            </button>
                                            <button
                                                onClick={() => handleWitchPotion(ACTION_TYPES.WITCH_NO_ACTION)}
                                                className="ml-auto btn btn-sm btn-primary">
                                                Ne rien faire
                                            </button>
                                        </div>
                                    )
                                }
                                {
                                    game.phase === GAME_PHASES.VOTING && numberCanBeSelected > 0 && selectedPlayers.length > 0 && (
                                        <button
                                            disabled={selectedPlayers.length === 0}
                                            onClick={() => performAction(ACTION_TYPES.PLAYER_VOTE)}
                                            className="ml-auto btn btn-sm btn-primary">
                                            Confirmer le vote
                                        </button>
                                    )
                                }
                                {
                                    game.phase === GAME_PHASES.NIGHT && !currentPlayerIsWitch && numberCanBeSelected > 0 && selectedPlayers.length > 0 && (
                                        <button
                                            disabled={selectedPlayers.length === 0}
                                            onClick={() => performAction(null)}
                                            className="ml-auto btn btn-sm btn-primary">
                                            Confirmer la sélection
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    )}

                    <GameBoard
                        players={players}
                        currentPlayer={currentPlayer}
                        game={game}
                        numberCanBeSelected={numberCanBeSelected}
                        selectedPlayers={selectedPlayers}
                        setSelectedPlayers={setSelectedPlayers}
                        revealedCards={revealedCards}
                    />
                </div>

                {game.state === GAME_STATES.IN_PROGRESS && (
                    <div className="space-y-6">
                        <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                            <div className="card-body p-4">
                                <h3 className="card-title text-white text-lg mb-4">
                                    <Users className="inline mr-2" size={20}/>
                                    Effectifs
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                                        <div className="text-2xl font-bold text-green-400">{alivePlayers.length}</div>
                                        <div className="text-xs text-gray-400">En Vie</div>
                                    </div>
                                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                        <div className="text-2xl font-bold text-red-400">{deadPlayers.length}</div>
                                        <div className="text-xs text-gray-400">Morts</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                            <div className="card-body p-4">
                                <h3 className="card-title text-white text-lg mb-4">
                                    <History className="inline mr-2" size={20}/>
                                    Ordre des Tours
                                </h3>
                                <div className="space-y-3">
                                    <div className={`flex items-center gap-3 p-3 rounded-lg ${
                                        game.phase === GAME_PHASES.NIGHT ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-base-200/30'
                                    }`}>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                        <span className="text-white font-medium">Phase Nocturne</span>
                                    </div>

                                    <div className="space-y-2 ml-4">
                                        {gameRoleCallOrder.map((roleName, idx) => {
                                            const color = roleColor(roleName);
                                            const role = getRoleByName(roleName);
                                            if (!role || !parsedConfiguration[role.id] || parsedConfiguration[role.id] <= 0) {
                                                return null;
                                            }
                                            const isActive = game.phase === GAME_PHASES.NIGHT && gameRoleCallOrder[game.turn] === roleName;
                                            return (
                                                <div key={roleName + idx}
                                                     className={`flex items-center gap-2 p-2 rounded ${isActive ? `bg-${color}-500/20 border border-${color}-500/30` : 'bg-base-200/20'}`}>
                                                    <div className={`w-1.5 h-1.5 bg-${color}-400 rounded-full`}></div>
                                                    <span
                                                        className="text-sm text-gray-300">{roleName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className={`flex items-center gap-3 p-3 rounded-lg ${
                                        game.phase === GAME_PHASES.DAY ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-base-200/30'
                                    }`}>
                                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                        <span className="text-white font-medium">Phase Diurne</span>
                                    </div>

                                    <div className="space-y-2 ml-4">
                                        <div className={`flex items-center gap-2 p-2 rounded ${
                                            game.phase === GAME_PHASES.DAY
                                                ? 'bg-blue-500/20 border border-blue-500/30'
                                                : 'bg-base-200/20'
                                        }`}>
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                            <span className="text-sm text-gray-300">Tous - Délibération</span>
                                        </div>
                                        <div className={`flex items-center gap-2 p-2 rounded ${
                                            game.phase === GAME_PHASES.DAY
                                                ? 'bg-purple-500/20 border border-purple-500/30'
                                                : 'bg-base-200/20'
                                        }`}>
                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                            <span className="text-sm text-gray-300">Tous - Vote</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TabGame;