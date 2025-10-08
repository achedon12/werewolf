import Image from "next/image";

const GameBoard = ({players, currentPlayer}) => {

    if (!players || players.length === 0) {
        return (
            <div className="flex justify-center items-center my-12">
                <div
                    className="text-center text-gray-400 bg-base-200/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <div
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-300/50 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                    </div>
                    <p className="text-lg font-semibold">Aucun joueur dans la partie</p>
                    <p className="text-sm mt-2">En attente de joueurs...</p>
                </div>
            </div>
        );
    }

    const alivePlayers = players.filter(p => p.isAlive);
    const deadPlayers = players.filter(p => !p.isAlive);

    return (
        <div className="relative my-8">
            <div className="flex justify-center gap-6 mb-8">
                <div
                    className="stat place-items-center bg-base-200/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-green-500/20">
                    <div className="stat-title text-green-400">En vie</div>
                    <div className="stat-value text-green-400 text-3xl">{alivePlayers.length}</div>
                    <div className="stat-desc text-gray-400">Joueurs</div>
                </div>

                <div
                    className="stat place-items-center bg-base-200/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-red-500/20">
                    <div className="stat-title text-red-400">Morts</div>
                    <div className="stat-value text-red-400 text-3xl">{deadPlayers.length}</div>
                    <div className="stat-desc text-gray-400">Joueurs</div>
                </div>
            </div>

            <div className="relative mx-auto w-80 h-80 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-pulse">
                    <div className="absolute inset-4 rounded-full border border-white/10"></div>
                </div>

                <div className="absolute inset-0 rounded-full">
                    {players.map((_, idx) => {
                        const angle = (360 / players.length) * idx;
                        return (
                            <div
                                key={`line-${idx}`}
                                className="absolute top-1/2 left-1/2 w-px h-1/2 bg-white/5 transform origin-top"
                                style={{transform: `rotate(${angle}deg) translateY(-50%)`}}
                            />
                        );
                    })}
                </div>

                {players.map((player, idx) => {
                    const totalPlayers = players.length;
                    const angle = (2 * Math.PI * idx) / totalPlayers;
                    const radius = 140;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);

                    const isCurrentUser = player.id === currentPlayer?.id;

                    return (
                        <div
                            key={player.id || player.socketId || idx}
                            className="absolute top-1/2 left-1/2 transition-all duration-300 transform"
                            style={{
                                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                            }}
                        >
                            {player.role && (
                                <Image
                                    className="absolute bottom-6 -right-10 z-10"
                                    src={"/cards/card.jpeg"}
                                    alt={"Card Back"}
                                    width={60}
                                    height={90}
                                />
                            )}

                            <div className={`relative group cursor-pointer ${
                                !player.isAlive ? 'grayscale' : ''
                            }`}>
                                <div
                                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 transition-all duration-300 ${
                                        player.isAlive
                                            ? 'border-green-600'
                                            : 'border-red-600'
                                    } p-1`}>
                                    <Image
                                        src={player.avatar || "/default-avatar.png"}
                                        alt={player.nickname}
                                        width={80}
                                        height={80}
                                        className="rounded-full w-full h-full object-cover"
                                    />
                                </div>

                                <div
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                                    <div
                                        className="bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap border border-white/10 shadow-2xl">
                                        <div className="font-semibold">{player.nickname}</div>
                                        <div className={`text-xs mt-1 ${
                                            player.isAlive ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {player.isAlive ? '🟢 En vie' : '🔴 Mort'}
                                        </div>
                                    </div>
                                    <div
                                        className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
                                </div>
                            </div>

                            <div className="text-center mt-2 transition-all duration-300">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
                                    player.isAlive
                                        ? 'text-white bg-black/30'
                                        : 'text-gray-400 bg-red-900/30'
                                } ${isCurrentUser ? 'text-purple-300 bg-purple-900/50' : ''}`}>
                                    {isCurrentUser ? '(Vous)' : player.nickname}
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl">
                        <div className="text-center">
                            <div className="text-white font-bold text-sm">LOUP-GAROU</div>
                            <div className="text-gray-400 text-xs mt-1">{players.length} joueurs</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameBoard;