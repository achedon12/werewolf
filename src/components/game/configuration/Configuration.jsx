import {CircleAlert, Cog, Columns3Cog, Info, Rocket, Users} from "lucide-react";
import {useEffect, useState} from "react";
import {GAME_STATES} from "@/server/config/constants.js";
import {formatTimeDifference} from "@/utils/Date.js";
import ConfigurationOverviewModal from "@/components/game/configuration/modal/ConfigurationOverview.jsx";
import PlayersConfigurationModal from "@/components/game/configuration/modal/Players.jsx";
import AdminConfigurationModal from "@/components/game/configuration/modal/Configuration.jsx";

const GameConfiguration = ({
                               game, configuration, players, currentPlayer, startGame = () => {
    }, handleExcludePlayer, handleAddBot,
                               handleUpdateGame
                           }) => {
    const isAdmin = game?.admin?.id === currentPlayer.id;
    const [isMobile, setIsMobile] = useState(false);
    const [showConfigurationOverviewModal, setShowConfigurationOverviewModal] = useState(false);
    const [showConfigurationModal, setShowConfigurationModal] = useState(false);
    const [showPlayersConfigurationModal, setShowPlayersConfigurationModal] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (game.state !== GAME_STATES.WAITING) {
        return null;
    }

    return (
        <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="card-body p-2 md:p-4">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Info className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400"/>
                    </div>
                    <h3 className="card-title text-gray-900 dark:text-white text-lg md:text-xl">
                        Configuration de la partie
                    </h3>
                </div>

                {/*<div className="grid grid-cols-1 gap-3 md:gap-4">*/}
                {/*    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 md:p-4">*/}
                {/*        <div className="flex items-center gap-2 mb-1">*/}
                {/*            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400"/>*/}
                {/*            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">*/}
                {/*                Durée de la partie*/}
                {/*            </span>*/}
                {/*        </div>*/}
                {/*        <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">*/}
                {/*            {timer}*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 md:p-4">*/}
                {/*        <div className="flex items-center gap-2 mb-1">*/}
                {/*            <UserCog className="h-4 w-4 text-gray-500 dark:text-gray-400"/>*/}
                {/*            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">*/}
                {/*                Votre rôle*/}
                {/*            </span>*/}
                {/*        </div>*/}
                {/*        <div className="text-lg md:text-xl font-bold text-purple-600 dark:text-purple-400 truncate">*/}
                {/*            {currentPlayer?.role || "Non assigné"}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

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
                                onClick={() => setShowConfigurationModal(true)}
                            >
                                <Cog className="h-5 w-5 mr-2"/>
                                Configurer
                            </button>
                            <button
                                className={`btn w-full ${isMobile ? 'btn-sm' : ''} bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-white ${!isMobile ? 'col-span-2' : ''} flex items-center justify-start`}
                                onClick={() => setShowPlayersConfigurationModal(true)}
                            >
                                <Users className="h-5 w-5 mr-2"/>
                                Gérer les joueurs
                            </button>
                        </>
                    )}

                    {!isAdmin && (
                        <button
                            className={`btn w-full ${isMobile ? 'btn-sm' : ''} bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 border-0 text-white ${!isMobile && !isAdmin ? 'col-span-2' : ''} flex items-center justify-start`}
                            onClick={() => setShowConfigurationOverviewModal(true)}
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

            <ConfigurationOverviewModal
                game={game}
                show={showConfigurationOverviewModal}
                close={() => setShowConfigurationOverviewModal(false)}
            />

            <PlayersConfigurationModal
                currentPlayer={currentPlayer}
                excludePlayer={handleExcludePlayer}
                addBot={handleAddBot}
                game={game}
                players={players}
                show={showPlayersConfigurationModal}
                close={() => setShowPlayersConfigurationModal(false)}
            />

            <AdminConfigurationModal
                game={game}
                show={showConfigurationModal}
                close={() => setShowConfigurationModal(false)}
                save={handleUpdateGame}
            />
        </div>
    );
}

export default GameConfiguration;