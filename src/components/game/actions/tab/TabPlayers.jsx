import Image from 'next/image';
import {Circle, CircleDot, Skull, UsersRound} from 'lucide-react';

const TabPlayers = ({game, players, currentPlayer}) => {
    const lovers = game?.config?.lovers?.exists ? game.config.lovers.players : [];

    return (
        <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
            <div className="card-body">
                <h2 className="card-title text-2xl text-white mb-6">
                    <UsersRound className="inline mr-2 h-6 w-6"/>
                    Joueurs de la partie
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {players.map(player => (
                        <div
                            key={player.id || player.socketId}
                            className={`p-4 rounded-2xl border-2 backdrop-blur-sm transition-all ${
                                player.isAlive
                                    ? "bg-base-200/30 border-green-500/20"
                                    : "bg-red-500/10 border-red-500/20 opacity-60"
                            } ${
                                player.id === currentPlayer?.id ? "ring-2 ring-purple-500" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div
                                            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                            <Image
                                                src={player.isBot ? '/bot-avatar.png' : player.avatar ? process.env.NEXT_PUBLIC_APP_URL + player.avatar : "/default-avatar.png"}
                                                alt={player.nickname} width={40} height={40}
                                                className="rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            {player.nickname}
                                            {player.id === currentPlayer?.id && " (Vous)"}
                                        </h3>
                                        <div className="text-gray-400 text-sm flex flex-col md:flex-row gap-2 md:gap-4">
                                            {player.isAlive ? (
                                                <span className="flex items-center">
                                                    <CircleDot
                                                        size={16}
                                                        className="inline text-green-400 mr-1"
                                                    />
                                                    En vie
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <Skull
                                                        size={16}
                                                        className="inline text-red-400 mr-1"
                                                    />
                                                    Mort
                                                </span>
                                            )}
                                            {player.isBot ? (
                                                <span className="italic">Bot</span>
                                            ) : player.online ? (
                                                <div className="flex items-center">
                                                    <CircleDot
                                                        size={16}
                                                        className="inline text-green-400 mr-1"
                                                    />
                                                    En ligne
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <Circle
                                                        size={16}
                                                        className="inline text-gray-400 mr-1"
                                                    />
                                                    Hors ligne
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development' && (
                                    <div className="flex items-end gap-2">
                                        <div className="text-right">
                                            <div className="badge badge-outline">
                                                {player.role}
                                            </div>
                                        </div>
                                        {lovers.includes(player.id) && (
                                            <div className="text-right">
                                                <div className="badge badge-secondary">
                                                    Amoureux
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TabPlayers;