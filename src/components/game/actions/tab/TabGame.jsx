import GameBoard from "@/components/game/Board";
import {GAME_PHASES, GAME_STATES} from "@/server/config/constants";
import { Clock, Users, Target, History, AlertTriangle, Moon, Sun } from "lucide-react";
import {formatDuration} from "@/utils/Date";

const TabGame = ({ game, players, currentPlayer, performAction, numberCanBeSelected, selectedPlayers, setSelectedPlayers, roleCallRemaining }) => {
    const alivePlayers = players.filter(p => p.isAlive);
    const deadPlayers = players.filter(p => !p.isAlive);
    const displayTimer = roleCallRemaining !== null ? formatDuration(roleCallRemaining) : '~';

    const phaseInfo = {
        [GAME_PHASES.NIGHT]: {
            icon: Moon,
            color: "indigo",
            title: "Phase Nocturne",
            description: "Les rôles spéciaux s'activent dans l'ombre"
        },
        [GAME_PHASES.DAY]: {
            icon: Sun,
            color: "amber",
            title: "Phase Diurne",
            description: "Délibérations et votes publics"
        }
    };

    const currentPhase = phaseInfo[game.phase];

    console.log('Rendering TabGame with game:', game);

    return (
        <div className="space-y-6">
            {game.state === GAME_STATES.IN_PROGRESS && (
                <div className={`card glass shadow-2xl backdrop-blur-sm border border-${currentPhase.color}-500/30 bg-gradient-to-r from-${currentPhase.color}-500/10 to-${currentPhase.color}-600/10`}>
                    <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-${currentPhase.color}-500/20 border border-${currentPhase.color}-500/30`}>
                                    <currentPhase.icon className={`text-${currentPhase.color}-400`} size={32} />
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
                                    <Clock size={20} />
                                    <span className="font-semibold">Temps restant</span>
                                </div>
                                <div className="text-3xl font-mono font-bold text-white bg-black/30 px-4 py-2 rounded-lg border border-white/10">
                                    {displayTimer}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    {game.state === GAME_STATES.IN_PROGRESS && (
                        <div className={`alert bg-${currentPhase.color}-500/10 border-${currentPhase.color}-500/20`}>
                            <div className="flex items-center gap-3">
                                <AlertTriangle className={`text-${currentPhase.color}-400`} />
                                <div>
                                    <h3 className="font-semibold text-white">
                                        {game.phase === GAME_PHASES.NIGHT ? "Phase Nocturne" : "Phase Diurne"}
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        {game.phase === GAME_PHASES.NIGHT && currentPlayer && (
                                            <>
                                                {currentPlayer.role === "Loup-Garou" && "Choisissez discrètement une victime à éliminer."}
                                                {currentPlayer.role === "Voyante" && "Découvrez secrètement l'identité d'un joueur."}
                                                {currentPlayer.role === "Docteur" && "Protégez un joueur de l'attaque des loups."}
                                                {!["Loup-Garou", "Voyante", "Docteur"].includes(currentPlayer.role) &&
                                                    "Observez et tentez de déduire les rôles des autres joueurs."}
                                            </>
                                        )}
                                        {game.phase === GAME_PHASES.DAY && (
                                            "Délibérez ensemble et votez pour éliminer un suspect."
                                        )}
                                    </p>
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
                    />
                </div>

                {game.state === GAME_STATES.IN_PROGRESS && (
                    <div className="space-y-6">
                        <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                            <div className="card-body p-4">
                                <h3 className="card-title text-white text-lg mb-4">
                                    <Users className="inline mr-2" size={20} />
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
                                    <History className="inline mr-2" size={20} />
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
                                        <div className={`flex items-center gap-2 p-2 rounded ${
                                            game.phase === GAME_PHASES.NIGHT && currentPlayer?.role === "Voyante"
                                                ? 'bg-yellow-500/20 border border-yellow-500/30'
                                                : 'bg-base-200/20'
                                        }`}>
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                            <span className="text-sm text-gray-300">Voyante - Investigation</span>
                                        </div>
                                        <div className={`flex items-center gap-2 p-2 rounded ${
                                            game.phase === GAME_PHASES.NIGHT && currentPlayer?.role === "Docteur"
                                                ? 'bg-green-500/20 border border-green-500/30'
                                                : 'bg-base-200/20'
                                        }`}>
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                            <span className="text-sm text-gray-300">Docteur - Protection</span>
                                        </div>
                                        <div className={`flex items-center gap-2 p-2 rounded ${
                                            game.phase === GAME_PHASES.NIGHT && currentPlayer?.role === "Loup-Garou"
                                                ? 'bg-red-500/20 border border-red-500/30'
                                                : 'bg-base-200/20'
                                        }`}>
                                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                            <span className="text-sm text-gray-300">Loups-Garous - Attaque</span>
                                        </div>
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