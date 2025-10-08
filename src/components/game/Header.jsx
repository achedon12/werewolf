import Image from 'next/image';

const GameHeader = ({game, players, configuration, creator}) => {

    const alivePlayers = players.filter(player => player.isAlive);

    return (
        <div className="bg-base-200/20 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">{game.name}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <span className={`badge ${
                                game.state === "En attente" ? "badge-warning" :
                                    game.state === "En cours" ? "badge-success" : "badge-error"
                            }`}>
                                {game.state}
                            </span>
                            <span className="badge badge-info">{game.phase}</span>
                            <span className="text-gray-400">
                                {alivePlayers.length} / {configuration ? Object.values(configuration).reduce((a, b) => a + b, 0) : 0} joueurs vivants
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">Créé par</p>
                            <p className="text-white font-medium">@{creator?.nickname}</p>
                        </div>
                        <div className="avatar">
                            <div
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Image
                                    src={creator?.avatar || "/default-avatar.png"}
                                    alt={creator?.nickname || "créateur"}
                                    width={40} height={40}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameHeader;