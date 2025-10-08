import {Circle, CircleDot, Settings, Skull} from "lucide-react";

const GameInformation = ({game, currentPlayer, startGame = () => {}}) => {

    const isAdmin = game.admin.id === currentPlayer.id;

    return (
        <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
            <div className="card-body">
                <h3 className="card-title text-white mb-4">ℹ️ Informations</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Votre rôle:</span>
                        <span className="text-white font-semibold">
                            {currentPlayer?.role || "Non assigné"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Statut:</span>
                        <span className={currentPlayer?.isAlive ? "text-green-400" : "text-red-400"}>
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

                {isAdmin && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <h4 className="text-white font-semibold mb-2">
                            <Settings size={16} className="inline mr-2"/>
                            Contrôles Admin
                        </h4>
                        <div className="space-y-2">
                            <button
                                className="btn btn-sm btn-primary w-full"
                                onClick={() => startGame()}
                            >
                                Démarrer la partie
                            </button>
                            <button className="btn btn-sm btn-secondary w-full">Configurer la partie</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameInformation;