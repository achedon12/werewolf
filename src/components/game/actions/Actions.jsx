import TabGame from "@/components/game/actions/tab/TabGame";
import TabPlayers from "@/components/game/actions/tab/TabPlayers";
import TabRules from "@/components/game/actions/tab/TabRules";
import {Gamepad2, NotebookText, UsersRound} from "lucide-react";
import {GAME_PHASES, GAME_STATES} from "@/server/config/constants.js";

const GameActions = ({
                         players,
                         currentPlayer,
                         game,
                         activeTab,
                         setActiveTab,
                         numberCanBeSelected,
                         selectedPlayers,
                         setSelectedPlayers,
                         roleCallRemaining,
                         votingRemaining,
                         hunterChoiceRemaining,
                         performAction,
                         revealedCards
                     }) => {

    return (
        <div className="lg:col-span-3 space-y-6">
            {(game.state === GAME_STATES.IN_PROGRESS || game.state === GAME_STATES.FINISHED) && (
                <div
                    className="tabs tabs-boxed bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm flex gap-4 justify-center border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                    <button
                        className={`tab flex items-center gap-2 transition-all duration-200 ${
                            activeTab === "game"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                        } rounded-md px-4 py-2 font-medium`}
                        onClick={() => setActiveTab("game")}
                    >
                        <Gamepad2 className="h-4 w-4"/>
                        Jeu
                    </button>
                    <button
                        className={`tab flex items-center gap-2 transition-all duration-200 ${
                            activeTab === "players"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                        } rounded-md px-4 py-2 font-medium`}
                        onClick={() => setActiveTab("players")}
                    >
                        <UsersRound className="h-4 w-4"/>
                        Joueurs
                    </button>
                    <button
                        className={`tab flex items-center gap-2 transition-all duration-200 ${
                            activeTab === "rules"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                        } rounded-md px-4 py-2 font-medium`}
                        onClick={() => setActiveTab("rules")}
                    >
                        <NotebookText className="h-4 w-4"/>
                        Règles
                    </button>
                </div>
            )}

            {activeTab === "game" && (
                <TabGame
                    game={game}
                    players={players}
                    currentPlayer={currentPlayer}
                    numberCanBeSelected={numberCanBeSelected}
                    selectedPlayers={selectedPlayers}
                    setSelectedPlayers={setSelectedPlayers}
                    roleCallRemaining={roleCallRemaining}
                    votingRemaining={votingRemaining}
                    hunterChoiceRemaining={hunterChoiceRemaining}
                    performAction={performAction}
                    revealedCards={revealedCards}
                />
            )}

            {activeTab === "players" && (
                <TabPlayers
                    game={game}
                    players={players}
                    currentPlayer={currentPlayer}
                />
            )}

            {activeTab === "rules" && <TabRules/>}
        </div>
    );
}

export default GameActions