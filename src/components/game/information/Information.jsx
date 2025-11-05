import {Circle, CircleDot, Info, Settings, Skull} from "lucide-react";
import {useEffect, useState} from "react";

const GameInformation = ({game, configuration, players, currentPlayer, startGame = () => {}, configurationGameOverview = () => {}, configurationGame = () => {}, playersConfiguration = () => {} }) => {

    const isAdmin = game?.admin?.id === currentPlayer.id;
    const [timer, setTimer] = useState('~');


    useEffect(() => {
        if (game.state === "En attente") {
            setTimer('~');
            return;
        }

        let interval = setInterval(() => {
            const startedAt = new Date(game.startedAt);
            const now = new Date();
            const diff = now.getTime() - startedAt.getTime();

            if (diff < 0) {
                setTimer('00:00:00');
                return;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const formatted = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0'),
            ].join(':');

            setTimer(formatted);
        }, 1000);

        return () => clearInterval(interval);
    }, [game]);

    return (
        <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
            <div className="card-body">
                <h3 className="card-title text-white mb-4">
                    <Info className="inline mr-2"/>
                    Informations
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Durée de la partie:</span>
                        <span className="text-white font-semibold">{timer}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Votre rôle:</span>
                        <span className="text-white font-semibold">
                            {currentPlayer?.role || "Non assigné"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Statut:</span>
                        <span className={game.state === "En attente" ? "text-gray-400" : currentPlayer.isAlive ? "text-green-400" : "text-red-400"}>
                            {game.state === "En attente" ? (
                                "~"
                            ) : (
                                <>
                                    {currentPlayer.isAlive ? (
                                        <span className="flex items-center">
                                        <CircleDot size={16} className="inline text-green-400 mr-1"/>
                                        En vie
                                      </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <Skull size={16} className="inline text-red-400 mr-1"/>
                                            Mort
                                            </span>
                                    )}
                                </>
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Connecté:</span>
                        <span className={currentPlayer?.online ? "text-green-400" : "text-gray-400"}>
                            {currentPlayer.online ? (
                                <div className="flex items-center">
                                    <CircleDot size={16} className="inline text-green-400 mr-1"/>
                                    En ligne
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Circle size={16} className="inline text-gray-400 mr-1"/>
                                    Hors ligne
                                </div>
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Phase:</span>
                        <span className="text-white">{game.phase}</span>
                    </div>
                </div>

                {game.state === "En attente" && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <h4 className="text-white font-semibold mb-2">
                            <Settings size={16} className="inline mr-2"/>
                            Informations partie
                        </h4>
                        <div className="space-y-2">
                            {isAdmin && (
                                <>
                                    <button
                                        className="btn btn-sm btn-primary w-full"
                                        onClick={() => startGame()}
                                        disabled={players.length < Object.values(configuration).reduce((a, b) => a + b, 0)}
                                    >
                                        Démarrer la partie
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary w-full"
                                        onClick={configurationGame}
                                    >
                                        Configurer la partie
                                    </button>
                                    <button
                                        className="btn btn-sm bg-blue-500 border-blue-500 hover:bg-blue-600 w-full"
                                        onClick={playersConfiguration}
                                    >
                                        Gérer les joueurs
                                    </button>
                                </>
                            )}
                            <button
                                className="btn btn-sm bg-yellow-500 border-yellow-500 hover:bg-yellow-600 w-full"
                                onClick={configurationGameOverview}
                            >
                                Configuration de la partie
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameInformation;