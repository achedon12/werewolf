import Image from 'next/image';
import {Circle, CircleDot, Skull, UsersRound, Bot} from 'lucide-react';

const TabPlayers = ({game, players, currentPlayer}) => {
    const lovers = game?.config?.lovers?.exists ? game.config.lovers.players : [];

    return (
        <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <UsersRound className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="card-title text-2xl text-gray-900 dark:text-white">
                        Joueurs de la partie
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {players.map(player => (
                        <div
                            key={player.id || player.socketId}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                player.isAlive
                                    ? player.id === currentPlayer?.id
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 ring-2 ring-blue-500 dark:ring-blue-400"
                                        : "bg-gray-50 dark:bg-gray-700/50 border-green-200 dark:border-green-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 opacity-70"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${
                                            player.id === currentPlayer?.id
                                                ? "ring-2 ring-blue-500 dark:ring-blue-400"
                                                : "ring-1 ring-gray-300 dark:ring-gray-600"
                                        }`}>
                                            <Image
                                                src={player.isBot ? '/bot-avatar.png' : player.avatar ? player.avatar : "/default-avatar.png"}
                                                alt={player.nickname}
                                                width={48}
                                                height={48}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        {!player.isBot && (
                                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                                                player.online
                                                    ? "bg-green-500"
                                                    : "bg-gray-400"
                                            }`} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${
                                            player.id === currentPlayer?.id
                                                ? "text-blue-800 dark:text-blue-200"
                                                : player.isAlive
                                                    ? "text-gray-900 dark:text-white"
                                                    : "text-gray-700 dark:text-gray-300"
                                        }`}>
                                            {player.nickname}
                                        </h3>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-2">
                                                {player.isAlive ? (
                                                    <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                                                        <CircleDot size={14} className="mr-1" />
                                                        En vie
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-sm text-red-600 dark:text-red-400">
                                                        <Skull size={14} className="mr-1" />
                                                        Mort
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {player.isBot ? (
                                                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <Bot size={14} className="mr-1" />
                                                        Bot
                                                    </span>
                                                ) : player.online ? (
                                                    <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                                                        <CircleDot size={14} className="mr-1" />
                                                        En ligne
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                                                        <Circle size={14} className="mr-1" />
                                                        Hors ligne
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    {!player.isAlive && (
                                        <div className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                                            {player.role}
                                        </div>
                                    )}

                                    {!player.isAlive && lovers.includes(player.id) && (
                                        <div className="badge bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800">
                                            💘 Amoureux
                                        </div>
                                    )}
                                </div>

                                {process.env.NODE_ENV === 'development' && player.isAlive && (
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                                            {player.role}
                                        </div>
                                        {lovers.includes(player.id) && (
                                            <div className="badge bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800">
                                                💘 Amoureux
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>En ligne</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span>Hors ligne</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Vous</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TabPlayers;