import GameBoard from "@/components/game/Board";
import {ACTION_TYPES, GAME_PHASES, GAME_STATES} from "@/server/config/constants";
import {Axe, Clock, Droplets, Heart, History, Moon, Shield, Skull, Sun, Target, Users} from "lucide-react";
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
                     hunterChoiceRemaining,
                     performAction,
                     revealedCards
                 }) => {
    const parsedConfiguration = game.configuration ? JSON.parse(game.configuration) : {};
    const currentPlayerIsWitch = currentPlayer && currentPlayer.role === "Sorciere";
    const isWitchTurn = game.turn === 7 && game.phase === "Nuit";
    const currentTimer = game.phase === GAME_PHASES.VOTING ? votingRemaining : game.phase === GAME_PHASES.HUNTER_SHOT ? hunterChoiceRemaining : roleCallRemaining;

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
        },
        [GAME_PHASES.HUNTER_SHOT]: {
            icon: Axe,
            color: "red",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            borderColor: "border-red-200 dark:border-red-800",
            textColor: "text-red-800 dark:text-red-200",
            title: "Choix du Chasseur",
            description: "Le Chasseur choisit une cible avant de mourir",
            iconBg: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        }
    };

    const currentPhase = phaseInfo[game.phase] || phaseInfo[GAME_PHASES.STARTING];
    const mostTargetByWolvesId = getMostTargetByWolvesPlayerId(game);
    const playerTargetByWolves = players.find(p => String(p.id) === mostTargetByWolvesId);

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
                    <Target className="w-4 h-4 mr-2"/>
                    Confirmer le vote
                </button>
            );
        }

        if (game.phase === GAME_PHASES.NIGHT && currentPlayerIsWitch && numberCanBeSelected > 0 && selectedPlayers.length > 0) {
            return (
                <div className="flex flex-col sm:flex-row gap-2 ml-auto">
                    <button
                        disabled={String(selectedPlayers[0]) === currentPlayer.id || game.config.witch.deathPotionUsed}
                        onClick={() => handleWitchPotion(ACTION_TYPES.WITCH_POISON)}
                        className="btn btn-error btn-sm flex-1"
                    >
                        <Droplets className="w-4 h-4 mr-2"/>
                        Tuer
                    </button>
                    <button
                        disabled={String(selectedPlayers[0]) !== mostTargetByWolvesId || game.config.witch.lifePotionUsed}
                        onClick={() => handleWitchPotion(ACTION_TYPES.WITCH_HEAL)}
                        className="btn btn-success btn-sm flex-1"
                    >
                        <Heart className="w-4 h-4 mr-2"/>
                        Sauver
                    </button>
                    <button
                        onClick={() => handleWitchPotion(ACTION_TYPES.WITCH_NO_ACTION)}
                        className="btn btn-ghost btn-sm flex-1"
                    >
                        <Shield className="w-4 h-4 mr-2"/>
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
                    <Target className="w-4 h-4 mr-2"/>
                    Confirmer
                </button>
            );
        }

        if (game.phase === GAME_PHASES.HUNTER_SHOT && numberCanBeSelected > 0 && selectedPlayers.length > 0) {
            return (
                <button
                    disabled={selectedPlayers.length === 0}
                    onClick={() => performAction(ACTION_TYPES.HUNTER_SHOT)}
                    className="btn btn-primary btn-sm md:btn-md"
                >
                    <Skull className="w-4 h-4 mr-2"/>
                    Confirmer le tir
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
                                    <currentPhase.icon className="w-8 h-8"/>
                                </div>
                                <div>
                                    <h2 className={`text-xl md:text-2xl font-bold ${currentPhase.textColor}`}>
                                        {currentPhase.title}
                                    </h2>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
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
                                                        Sélectionnez jusqu'à <span
                                                        className="font-semibold text-blue-600 dark:text-blue-400">{numberCanBeSelected}</span> joueur
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

                            <div className="flex items-center gap-4">
                                {currentTimer !== null && currentTimer !== undefined && (
                                    <div className="text-center">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                            <Clock className="w-4 h-4"/>
                                            <span className="text-sm font-medium">Temps restant</span>
                                        </div>
                                        <div
                                            className="font-mono font-bold text-2xl md:text-3xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700">
                                            {currentTimer}s
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {game.phase === GAME_PHASES.NIGHT && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-6">
                        <div className="relative pb-4">
                            <div className="flex items-center justify-center min-w-max px-4">
                                {gameRoleCallOrder.map((roleName, index) => {
                                    const role = getRoleByName(roleName);
                                    if (!role || !parsedConfiguration[role.id] || parsedConfiguration[role.id] <= 0) {
                                        return null;
                                    }

                                    const isCurrent = game.turn === index;
                                    const isCompleted = game.turn > index;
                                    const isFuture = game.turn < index;

                                    return (
                                        <div key={roleName + index} className="flex items-center">
                                            <div className="relative group">
                                                <div className={`
                                                    relative flex items-center h-12
                                                    ${isCurrent ? 'scale-105 transform transition-transform duration-200' : ''}
                                                `}>
                                                    <div className={`
                                                        flex items-center justify-between h-full
                                                        ${isCurrent
                                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg shadow-blue-500/30'
                                                                    : isCompleted
                                                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                                                        : 'bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700'
                                                                }
                                                        rounded-l-lg
                                                    `}>
                                                        <div className="flex items-center px-4 py-2">
                                                            <div className="flex items-center space-x-3">
                                                                <div className={`
                                                                    w-6 h-6 rounded-full flex items-center justify-center
                                                                    ${isCurrent
                                                                                ? 'bg-white text-blue-600'
                                                                                : isCompleted
                                                                                    ? 'bg-white text-emerald-600'
                                                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                                                            }
                                                                `}>
                                                                    {isCompleted ? (
                                                                        <svg className="w-3 h-3" fill="currentColor"
                                                                             viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd"
                                                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                  clipRule="evenodd"/>
                                                                        </svg>
                                                                    ) : (
                                                                        <span className="text-xs font-bold">
                                                                            {index + 1}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <span className={`
                                                                    font-medium text-sm whitespace-nowrap
                                                                    ${isCurrent
                                                                                ? 'text-white'
                                                                                : isCompleted
                                                                                    ? 'text-white'
                                                                                    : 'text-gray-700 dark:text-gray-300'
                                                                            }
                                                                `}>
                                                        {roleName}
                                                    </span>
                                                            </div>
                                                        </div>

                                                        <div className={`
                                                                mx-3 px-2 py-1 rounded-md text-xs font-bold
                                                                ${isCurrent
                                                            ? 'bg-white text-blue-600'
                                                            : isCompleted
                                                                ? 'bg-white text-emerald-600'
                                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                        }
                                                            `}>
                                                            {parsedConfiguration[role.id]}
                                                        </div>
                                                    </div>

                                                    <div className={`
                                                        w-0 h-0 
                                                        border-t-[24px] border-t-transparent
                                                        border-b-[24px] border-b-transparent
                                                        border-l-[16px]
                                                        ${isCurrent
                                                        ? 'border-l-blue-400'
                                                        : isCompleted
                                                            ? 'border-l-emerald-400'
                                                            : 'border-l-gray-200 dark:border-l-gray-700'
                                                    }
                                                    `}></div>
                                                </div>

                                                {isCurrent && (
                                                    <div
                                                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                                        <div className="flex items-center space-x-1 animate-pulse">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                            <span
                                                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                                    En action
                                                </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div
                                                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                                    <div
                                                        className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                        {isCurrent
                                                            ? 'Action en cours'
                                                            : isCompleted
                                                                ? 'Action terminée'
                                                                : 'En attente'
                                                        }
                                                    </div>
                                                    <div
                                                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                                                </div>
                                            </div>

                                            {index < gameRoleCallOrder.length - 1 && (
                                                <div className={`
                                        w-8 h-0.5 mx-1
                                        ${isCompleted
                                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-300'
                                                    : 'bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700'
                                                }
                                        relative
                                    `}>
                                                    <div className={`
                                            absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
                                            w-1.5 h-1.5 rounded-full
                                            ${isCompleted
                                                        ? 'bg-emerald-500'
                                                        : 'bg-gray-400 dark:bg-gray-500'
                                                    }
                                        `}></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <div className="col-span-1 space-y-6">
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
            </div>
        </div>
    );
}

export default TabGame;