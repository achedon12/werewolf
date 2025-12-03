import GameBoard from "@/components/game/Board";
import {ACTION_TYPES, GAME_PHASES, GAME_STATES} from "@/server/config/constants";
import {AlertTriangle, Clock, History, Moon, Sun, Users, Skull, Heart, Droplets, Shield, Target} from "lucide-react";
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
            bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
            borderColor: "border-indigo-200 dark:border-indigo-800",
            textColor: "text-indigo-800 dark:text-indigo-200",
            title: "Phase Nocturne",
            description: "Actions secrètes des rôles",
            iconBg: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
        },
        [GAME_PHASES.DAY]: {
            icon: Sun,
            color: "amber",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            borderColor: "border-amber-200 dark:border-amber-800",
            textColor: "text-amber-800 dark:text-amber-200",
            title: "Phase Diurne",
            description: "Délibérations et votes publics",
            iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        },
        [GAME_PHASES.VOTING]: {
            icon: Users,
            color: "purple",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            borderColor: "border-purple-200 dark:border-purple-800",
            textColor: "text-purple-800 dark:text-purple-200",
            title: "Phase de Vote",
            description: "Vote pour éliminer un joueur",
            iconBg: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        },
        [GAME_PHASES.STARTING]: {
            icon: Clock,
            color: "blue",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            borderColor: "border-blue-200 dark:border-blue-800",
            textColor: "text-blue-800 dark:text-blue-200",
            title: "Démarrage de la partie",
            description: "Préparation et attribution des rôles",
            iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        },
        [GAME_PHASES.FINISHED]: {
            icon: History,
            color: "gray",
            bgColor: "bg-gray-50 dark:bg-gray-900/20",
            borderColor: "border-gray-200 dark:border-gray-700",
            textColor: "text-gray-800 dark:text-gray-200",
            title: "Partie Terminée",
            description: "Consultez les résultats et l'historique",
            iconBg: "bg-gray-100 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400"
        }
    };

    const currentPhase = phaseInfo[game.phase] || phaseInfo[GAME_PHASES.STARTING];
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

    const getActionButtons = () => {
        if (game.phase === GAME_PHASES.VOTING && numberCanBeSelected > 0 && selectedPlayers.length > 0) {
            return (
                <button
                    disabled={selectedPlayers.length === 0}
                    onClick={() => performAction(ACTION_TYPES.PLAYER_VOTE)}
                    className="btn btn-primary btn-sm md:btn-md"
                >
                    <Target className="w-4 h-4 mr-2" />
                    Confirmer le vote
                </button>
            );
        }

        if (game.phase === GAME_PHASES.NIGHT && currentPlayerIsWitch && numberCanBeSelected > 0 && selectedPlayers.length > 0) {
            return (
                <div className="flex flex-col sm:flex-row gap-2 ml-auto">
                    <button
                        disabled={String(selectedPlayers[0]) === currentPlayer.id}
                        onClick={() => handleWitchPotion(ACTION_TYPES.WITCH_POISON)}
                        className="btn btn-error btn-sm flex-1"
                    >
                        <Droplets className="w-4 h-4 mr-2" />
                        Tuer
                    </button>
                    <button
                        disabled={String(selectedPlayers[0]) !== mostTargetByWolvesId}
                        onClick={() => handleWitchPotion(ACTION_TYPES.WITCH_HEAL)}
                        className="btn btn-success btn-sm flex-1"
                    >
                        <Heart className="w-4 h-4 mr-2" />
                        Sauver
                    </button>
                    <button
                        onClick={() => handleWitchPotion(ACTION_TYPES.WITCH_NO_ACTION)}
                        className="btn btn-ghost btn-sm flex-1"
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        Passer
                    </button>
                </div>
            );
        }

        if (game.phase === GAME_PHASES.NIGHT && !currentPlayerIsWitch && numberCanBeSelected > 0 && selectedPlayers.length > 0) {
            return (
                <button
                    disabled={selectedPlayers.length === 0}
                    onClick={() => performAction(null)}
                    className="btn btn-primary btn-sm md:btn-md"
                >
                    <Target className="w-4 h-4 mr-2" />
                    Confirmer
                </button>
            );
        }

        return null;
    };

    return (
        <div className="space-y-6">
            {(game.state === GAME_STATES.IN_PROGRESS || game.state === GAME_STATES.FINISHED) && (
                <div className={`card ${currentPhase.bgColor} ${currentPhase.borderColor} shadow-lg`}>
                    <div className="card-body p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${currentPhase.iconBg}`}>
                                    <currentPhase.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className={`text-xl md:text-2xl font-bold ${currentPhase.textColor}`}>
                                        {currentPhase.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {currentPhase.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {currentTimer !== null && currentTimer !== undefined && (
                                    <div className="text-center">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-medium">Temps restant</span>
                                        </div>
                                        <div className="font-mono font-bold text-2xl md:text-3xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700">
                                            {currentTimer}s
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className={game.state === GAME_STATES.WAITING ? "xl:col-span-3 space-y-6" : "xl:col-span-2 space-y-6"}>
                    {(game.state === GAME_STATES.IN_PROGRESS || game.state === GAME_STATES.FINISHED) && (
                        <div className={`alert ${currentPhase.bgColor} ${currentPhase.borderColor}`}>
                            <AlertTriangle className={currentPhase.textColor} />
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${currentPhase.textColor} mb-2`}>
                                            {game.phase === GAME_PHASES.NIGHT ? "🌙 Phase Nocturne" : "☀️ Phase Diurne"}
                                        </h3>
                                        <div className="space-y-2">
                                            {game.phase === GAME_PHASES.NIGHT && currentPlayer && (
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {RoleActionDescriptions.hasOwnProperty(currentPlayer.role)
                                                        ? RoleActionDescriptions[currentPlayer.role]
                                                        : "Observez et tentez de déduire les rôles des autres joueurs."}
                                                </p>
                                            )}

                                            {numberCanBeSelected > 0 && (
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    Sélectionnez jusqu'à <span className="font-semibold text-blue-600 dark:text-blue-400">{numberCanBeSelected}</span> joueur
                                                    {numberCanBeSelected > 1 ? "s" : ""}.
                                                </p>
                                            )}

                                            {game.phase === GAME_PHASES.NIGHT && isWitchTurn && currentPlayerIsWitch && (
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    Les Loups-Garous ont ciblé{" "}
                                                    <span className="font-semibold text-red-600 dark:text-red-400">
                                                        {playerTargetByWolves ? playerTargetByWolves.nickname : "un joueur inconnu"}
                                                    </span>
                                                    .
                                                </p>
                                            )}

                                            {game.phase === GAME_PHASES.DAY && (
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    Délibérez ensemble et votez pour éliminer un suspect.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {getActionButtons()}
                                </div>
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
                        <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                            <div className="card-body p-4 md:p-6">
                                <h3 className="card-title text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                                    <History className="w-5 h-5" />
                                    Ordre des Tours
                                </h3>
                                <div className="space-y-4">
                                    <div className={`p-3 rounded-lg border ${game.phase === GAME_PHASES.NIGHT
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700'
                                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-2 h-2 rounded-full ${game.phase === GAME_PHASES.NIGHT ? 'bg-indigo-500' : 'bg-gray-400'}`} />
                                            <span className="font-semibold text-gray-900 dark:text-white">Phase Nocturne</span>
                                        </div>
                                        <div className="space-y-1.5 ml-4">
                                            {gameRoleCallOrder.map((roleName, idx) => {
                                                const role = getRoleByName(roleName);
                                                if (!role || !parsedConfiguration[role.id] || parsedConfiguration[role.id] <= 0) {
                                                    return null;
                                                }
                                                const isActive = game.phase === GAME_PHASES.NIGHT && gameRoleCallOrder[game.turn] === roleName;
                                                const color = roleColor(roleName);
                                                const colorMap = {
                                                    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700',
                                                    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700',
                                                    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700'
                                                };

                                                return (
                                                    <div
                                                        key={roleName + idx}
                                                        className={`flex items-center gap-2 p-2 rounded text-sm ${isActive ? colorMap[color] : 'bg-transparent'}`}
                                                    >
                                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                                            color === 'red' ? 'bg-red-500' :
                                                                color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                                                        }`} />
                                                        <span className="text-gray-700 dark:text-gray-300">{roleName}</span>
                                                        {isActive && (
                                                            <span className="ml-auto text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                                                En cours
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className={`p-3 rounded-lg border ${game.phase === GAME_PHASES.DAY
                                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
                                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-2 h-2 rounded-full ${game.phase === GAME_PHASES.DAY ? 'bg-amber-500' : 'bg-gray-400'}`} />
                                            <span className="font-semibold text-gray-900 dark:text-white">Phase Diurne</span>
                                        </div>
                                        <div className="space-y-1.5 ml-4">
                                            <div className={`flex items-center gap-2 p-2 rounded text-sm ${game.phase === GAME_PHASES.DAY && game.turn !== undefined
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                                                : ''}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span className="text-gray-700 dark:text-gray-300">Délibération</span>
                                            </div>
                                            <div className={`flex items-center gap-2 p-2 rounded text-sm ${game.phase === GAME_PHASES.VOTING
                                                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700'
                                                : ''}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                <span className="text-gray-700 dark:text-gray-300">Vote Public</span>
                                                {game.phase === GAME_PHASES.VOTING && (
                                                    <span className="ml-auto text-xs px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                                        En cours
                                                    </span>
                                                )}
                                            </div>
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