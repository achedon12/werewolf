import TabGame from "@/components/game/actions/tab/TabGame";
import TabPlayers from "@/components/game/actions/tab/TabPlayers";
import TabRules from "@/components/game/actions/tab/TabRules";

const GameActions = ({ players, currentPlayer, game, performAction, activeTab, setActiveTab }) => {

    return (
        <div className="lg:col-span-3 space-y-6">
            <div
                className="tabs tabs-boxed bg-base-200/20 backdrop-blur-sm flex gap-4 justify-center border border-white/10">
                <button
                    className={`tab ${activeTab === "game" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("game")}
                >
                    🎮 Jeu
                </button>
                <button
                    className={`tab ${activeTab === "players" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("players")}
                >
                    👥 Joueurs
                </button>
                <button
                    className={`tab ${activeTab === "rules" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("rules")}
                >
                    📖 Règles
                </button>
            </div>

            {activeTab === "game" && <TabGame game={game} players={players} currentPlayer={currentPlayer} performAction={performAction} />}

            {activeTab === "players" && <TabPlayers players={players} currentPlayer={currentPlayer} />}

            {activeTab === "rules" && <TabRules />}
        </div>
    );
}

export default GameActions