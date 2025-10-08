import {Circle, CircleDot, Skull} from "lucide-react";

const Information = ({game, currentPlayer}) => {
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
            </div>
        </div>
    );
}

export default Information;