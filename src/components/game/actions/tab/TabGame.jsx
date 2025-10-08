import Board from "@/components/game/Board";


const TabGame = ({game, players, currentPlayer, performAction}) => {
    const alivePlayers = players.filter(p => p.isAlive);

    return (
        <div className="space-y-6">
            <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                <div className="card-body">
                    <h2 className="card-title text-2xl text-white mb-4">
                        Actions (Phase {game.phase === "Nuit" ? "🌙" : "☀️"} {game.phase})
                    </h2>

                    {game.phase === "Nuit" && currentPlayer && (
                        <div className="alert alert-info bg-blue-500/10 border-blue-500/20">
                            <span>
                                C'est la nuit ! Les pouvoirs spéciaux peuvent être utilisés.
                                {currentPlayer.role === "Loup-Garou" && " Choisissez une victime."}
                                {currentPlayer.role === "Voyante" && " Découvrez l'identité d'un joueur."}
                                {currentPlayer.role === "Docteur" && " Soignez un joueur."}
                            </span>
                        </div>
                    )}

                    {game.phase === "Jour" && (
                        <div className="alert alert-warning bg-yellow-500/10 border-yellow-500/20">
                            <span>
                                C'est le jour ! Discutez et votez pour éliminer un suspect.
                            </span>
                        </div>
                    )}

                    {currentPlayer && currentPlayer.isAlive && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Vos actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {game.phase === "Nuit" && currentPlayer.role === "Loup-Garou" && (
                                    <select
                                        className="select select-bordered w-full bg-base-200/50"
                                        onChange={(e) => performAction("attack", e.target.value)}
                                    >
                                        <option value="">Choisir une victime</option>
                                        {alivePlayers
                                            .filter(p => p.role !== "Loup-Garou")
                                            .map(player => (
                                                <option key={player.id} value={player.id}>
                                                    {player.nickname}
                                                </option>
                                            ))
                                        }
                                    </select>
                                )}

                                {game.phase === "Nuit" && currentPlayer.role === "Voyante" && (
                                    <select
                                        className="select select-bordered w-full bg-base-200/50"
                                        onChange={(e) => performAction("reveal", e.target.value)}
                                    >
                                        <option value="">Découvrir un joueur</option>
                                        {alivePlayers
                                            .filter(p => p.id !== currentPlayer?.id)
                                            .map(player => (
                                                <option key={player.id} value={player.id}>
                                                    {player.nickname}
                                                </option>
                                            ))
                                        }
                                    </select>
                                )}

                                {game.phase === "Jour" && (
                                    <select
                                        className="select select-bordered w-full bg-base-200/50"
                                        onChange={(e) => performAction("vote", e.target.value)}
                                    >
                                        <option value="">Voter pour éliminer</option>
                                        {alivePlayers
                                            .filter(p => p.id !== currentPlayer?.id)
                                            .map(player => (
                                                <option key={player.id} value={player.id}>
                                                    {player.nickname}
                                                </option>
                                            ))
                                        }
                                    </select>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Temps restant:</span>
                            <span className="text-white font-mono">04:32</span>
                        </div>
                        <progress
                            className="progress progress-primary w-full"
                            value="70"
                            max="100"
                        ></progress>
                    </div>
                </div>
            </div>

            <Board players={players} currentPlayer={currentPlayer}/>
        </div>
    );
}

export default TabGame;