import {
    Circle,
    CircleAlert,
    CircleDot,
    Clock,
    Cog,
    Columns3Cog,
    Info,
    Rocket,
    Settings,
    Skull,
    UserCog,
    Users
} from "lucide-react";
import {useEffect, useState} from "react";
import {GAME_STATES} from "@/server/config/constants.js";
import {formatTimeDifference} from "@/utils/Date.js";

const GameInformation = ({
                             game, configuration, players, currentPlayer, startGame = () => {
    }, configurationGameOverview = () => {
    }, configurationGame = () => {
    }, playersConfiguration = () => {
    }
                         }) => {
    const isAdmin = game?.admin?.id === currentPlayer.id;
    const [timer, setTimer] = useState('~');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (game.state === GAME_STATES.WAITING) {
            setTimer('~');
            return;
        }
        const startedAt = new Date(game.startedAt);
        if (game.state === GAME_STATES.FINISHED) {
            const endedAt = new Date(game.endedAt);

            setTimer(formatTimeDifference(startedAt, endedAt, ' '));
            return;
        }

        let interval = setInterval(() => {
            const now = new Date();

            setTimer(formatTimeDifference(startedAt, now, ' '));
        }, 1000);

        return () => clearInterval(interval);
    }, [game]);

    return (
        <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="card-body p-2 md:p-4">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Info className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400"/>
                    </div>
                    <h3 className="card-title text-gray-900 dark:text-white text-lg md:text-xl">
                        Informations de la partie
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400"/>
                            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                                Durée de la partie
                            </span>
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {timer}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <UserCog className="h-4 w-4 text-gray-500 dark:text-gray-400"/>
                            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                                Votre rôle
                            </span>
                        </div>
                        <div className="text-lg md:text-xl font-bold text-purple-600 dark:text-purple-400 truncate">
                            {currentPlayer?.role || "Non assigné"}
                        </div>
                    </div>
                </div>

                <div className="mt-2 md:mt-4 space-y-3 md:space-y-4">
                    <div
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Statut du joueur
                        </span>
                        {game.state === "En attente" ? (
                            <span className="text-gray-500 dark:text-gray-400 font-semibold">
                                ~
                            </span>
                        ) : (
                            <span className={`flex items-center gap-2 font-semibold ${
                                currentPlayer.isAlive
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                            }`}>
                                {currentPlayer.isAlive ? (
                                    <>
                                        <CircleDot className="h-4 w-4"/>
                                        <span className="text-sm md:text-base">En vie</span>
                                    </>
                                ) : (
                                    <>
                                        <Skull className="h-4 w-4"/>
                                        <span className="text-sm md:text-base">Mort</span>
                                    </>
                                )}
                            </span>
                        )}
                    </div>

                    <div
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Connexion
                        </span>
                        <span className={`flex items-center gap-2 font-semibold ${
                            currentPlayer?.online
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                        }`}>
                            {currentPlayer.online ? (
                                <>
                                    <CircleDot className="h-4 w-4"/>
                                    <span className="text-sm md:text-base">En ligne</span>
                                </>
                            ) : (
                                <>
                                    <Circle className="h-4 w-4"/>
                                    <span className="text-sm md:text-base">Hors ligne</span>
                                </>
                            )}
                        </span>
                    </div>

                    <div
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Phase actuelle
                        </span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {game.phase}
                        </span>
                    </div>
                </div>

                {game.state === GAME_STATES.WAITING && (
                    <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400"/>
                            </div>
                            <h4 className="text-gray-900 dark:text-white font-semibold text-lg">
                                Actions de la partie
                            </h4>
                        </div>

                        <div className="space-y-2">
                            {isAdmin && (
                                <>
                                    <button
                                        className={`btn w-full ${isMobile ? 'btn-sm' : ''} bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white flex items-center justify-start`}
                                        onClick={() => startGame()}
                                        disabled={players.length < Object.values(configuration).reduce((a, b) => a + b, 0)}
                                    >
                                        <Rocket className="h-5 w-5 mr-2"/>
                                        Démarrer la partie
                                    </button>
                                    <button
                                        className={`btn w-full ${isMobile ? 'btn-sm' : ''} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 text-white flex items-center justify-start`}
                                        onClick={configurationGame}
                                    >
                                        <Cog className="h-5 w-5 mr-2"/>
                                        Configurer
                                    </button>
                                    <button
                                        className={`btn w-full ${isMobile ? 'btn-sm' : ''} bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-white ${!isMobile ? 'col-span-2' : ''} flex items-center justify-start`}
                                        onClick={playersConfiguration}
                                    >
                                        <Users className="h-5 w-5 mr-2"/>
                                        Gérer les joueurs
                                    </button>
                                </>
                            )}

                            {!isAdmin && (
                                <button
                                    className={`btn w-full ${isMobile ? 'btn-sm' : ''} bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 border-0 text-white ${!isMobile && !isAdmin ? 'col-span-2' : ''} flex items-center justify-start`}
                                    onClick={configurationGameOverview}
                                >
                                    <Columns3Cog className="h-5 w-5 mr-2"/>
                                    Voir configuration
                                </button>
                            )}
                        </div>

                        {isAdmin && players.length < Object.values(configuration).reduce((a, b) => a + b, 0) && (
                            <div
                                className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-yellow-700 dark:text-yellow-300 text-sm text-center">
                                    <CircleAlert className="inline h-4 w-4 mr-1 mb-1"/>
                                    Attendez d'avoir assez de joueurs pour démarrer
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameInformation;