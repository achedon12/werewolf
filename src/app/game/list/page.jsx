"use client";
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {socket} from "@/socket";
import {formatDate} from "@/utils/Date";
import {AlertCircle, Calendar, Clock, Filter, Gamepad2, Loader2, LogIn, RefreshCw, Users} from "lucide-react";
import {GAME_STATES} from "@/server/config/constants.js";

const GameListPage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [connected, setConnected] = useState(false);
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!socket) return;

        const handleConnect = () => {
            setConnected(true);
            setLoading(false);
            socket.emit('get-available-games');
        };

        const handleDisconnect = () => {
            setConnected(false);
        };

        const handleAvailableGames = (gamesData) => {
            setGames(gamesData || []);
            setLoading(false);
        };

        const handleConnectionError = (err) => {
            setError(err?.message || 'Erreur de connexion');
            setLoading(false);
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('available-games', handleAvailableGames);
        socket.on('connection-error', handleConnectionError);

        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('available-games', handleAvailableGames);
            socket.off('connection-error', handleConnectionError);
        };
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const joinGame = (gameId) => {
        const game = games.find(g => g.id === gameId);
        if (!game) {
            setError('Partie non trouvée');
            return;
        }

        if (game.state === GAME_STATES.FINISHED) {
            setError('Cette partie est terminée');
            return;
        }

        router.push(`/game/${gameId}`);
    };

    const refreshGames = () => {
        if (socket && connected) {
            setLoading(true);
            socket.emit('get-available-games');
        }
    };

    const filteredGames = games.filter(game => {
        switch (filter) {
            case GAME_STATES.WAITING:
                return game.state === GAME_STATES.WAITING;
            case GAME_STATES.IN_PROGRESS:
                return game.state === GAME_STATES.IN_PROGRESS;
            case GAME_STATES.FINISHED:
                return game.state === GAME_STATES.FINISHED;
            default:
                return true;
        }
    });

    const getStatusConfig = (state) => {
        switch (state) {
            case GAME_STATES.WAITING:
                return {badge: 'badge-warning', color: 'warning', label: 'En attente'};
            case GAME_STATES.IN_PROGRESS:
                return {badge: 'badge-success', color: 'success', label: 'En cours'};
            case GAME_STATES.FINISHED:
                return {badge: 'badge-neutral', color: 'neutral', label: 'Terminée'};
            default:
                return {badge: 'badge-neutral', color: 'neutral', label: state};
        }
    };

    const getPlayerCount = (game) => {
        return game.players ? Object.keys(game.players).length : 0;
    };

    const getMaxPlayers = (game) => {
        if (game.configuration) {
            const config = typeof game.configuration === 'string'
                ? JSON.parse(game.configuration)
                : game.configuration;
            return Object.values(config).reduce((sum, count) => sum + count, 0);
        }
        return 8;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4"/>
                    <p className="text-lg text-gray-900 dark:text-gray-50">Connexion au serveur...</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Chargement des parties</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-3 h-3 rounded-full ${connected ? 'bg-success' : 'bg-error'}`}></div>
                                <span className={`text-sm font-medium ${connected ? 'text-success' : 'text-error'}`}>
                                        {connected ? 'Connecté' : 'Déconnecté'}
                                    </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parties de Loups
                                Garous</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {games.length} partie{games.length !== 1 ? 's' : ''} disponible{games.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <button
                                onClick={refreshGames}
                                disabled={!connected || loading}
                                className="btn btn-outline gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/>
                                Actualiser
                            </button>
                            <button
                                onClick={() => router.push('/game/create')}
                                className="btn btn-primary gap-2"
                            >
                                <Gamepad2 className="w-4 h-4"/>
                                Créer une partie
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300"/>
                        <span className="font-medium text-gray-900 dark:text-white">Filtrer par statut :</span>
                    </div>
                    <div className="join">
                        <button
                            className={`join-item btn ${filter === 'all' ? 'btn-active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            Toutes ({games.length})
                        </button>
                        <button
                            className={`join-item btn ${filter === GAME_STATES.WAITING ? 'btn-active btn-warning' : ''}`}
                            onClick={() => setFilter(GAME_STATES.WAITING)}
                        >
                            En attente ({games.filter(g => g.state === GAME_STATES.WAITING).length})
                        </button>
                        <button
                            className={`join-item btn ${filter === GAME_STATES.IN_PROGRESS ? 'btn-active btn-success' : ''}`}
                            onClick={() => setFilter(GAME_STATES.IN_PROGRESS)}
                        >
                            En cours ({games.filter(g => g.state === GAME_STATES.IN_PROGRESS).length})
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error mb-6">
                        <AlertCircle className="w-5 h-5"/>
                        <span>{error}</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => setError('')}>×</button>
                    </div>
                )}

                {!user && (
                    <div className="alert alert-warning mb-6">
                        <AlertCircle className="w-5 h-5"/>
                        <span>Connectez-vous pour rejoindre une partie</span>
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={() => router.push('/login')}
                        >
                            <LogIn className="w-4 h-4"/>
                            Se connecter
                        </button>
                    </div>
                )}

                {filteredGames.length === 0 ? (
                    <div className="card bg-gray-100 dark:bg-slate-800">
                        <div className="card-body items-center text-center py-12">
                            <div className="text-6xl mb-4">🎮</div>
                            <h2 className="card-title text-2xl mb-2 text-gray-900 dark:text-white">Aucune partie
                                disponible</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {filter !== 'all'
                                    ? `Aucune partie dans cette catégorie`
                                    : "Créez la première partie !"}
                            </p>
                            <button
                                onClick={() => router.push('/game/create')}
                                className="btn btn-primary"
                            >
                                Créer une partie
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredGames.map((game) => (
                            <GameCard
                                key={game.id}
                                game={game}
                                onJoin={joinGame}
                                playerCount={getPlayerCount(game)}
                                maxPlayers={getMaxPlayers(game)}
                                getStatusConfig={getStatusConfig}
                                connected={connected}
                                user={user}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const GameCard = ({game, onJoin, playerCount, maxPlayers, getStatusConfig, connected, user}) => {
    const [joining, setJoining] = useState(false);
    const status = getStatusConfig(game.state);
    const isUserInGame = user && game.players && Object.values(game.players).some(p => p.id === user.id);
    const canJoin = (game.state === GAME_STATES.WAITING && playerCount < maxPlayers) || isUserInGame;
    const isFull = playerCount >= maxPlayers;

    const handleJoin = async () => {
        if (!connected || !canJoin) return;

        setJoining(true);
        try {
            await onJoin(game.id);
        } finally {
            setJoining(false);
        }
    };

    return (
        <div className="card bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="card-body p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="card-title text-lg truncate mb-1 text-gray-900 dark:text-white">
                            {game.name || `Partie ${game.id.slice(0, 8)}`}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3 h-3"/>
                            <span>Créée le {formatDate(game.createdAt)}</span>
                        </div>
                    </div>
                    <div className={`badge ${status.badge} badge-lg`}>
                        {status.label}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-600 dark:text-gray-400"/>
                            <span className="font-medium text-gray-900 dark:text-white">Joueurs</span>
                        </div>
                        <div className="text-right">
                            <div className={`text-lg font-bold ${isFull ? 'text-success' : 'text-primary'}`}>
                                {playerCount}/{maxPlayers}
                            </div>
                            {game.state === GAME_STATES.WAITING && (
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {isFull ? 'Complet' : `${maxPlayers - playerCount} place${maxPlayers - playerCount > 1 ? 's' : ''} libre${maxPlayers - playerCount > 1 ? 's' : ''}`}
                                </div>
                            )}
                        </div>
                    </div>

                    {game.state === GAME_STATES.WAITING && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-900 dark:text-gray-300">
                                <span>Progression</span>
                                <span>{Math.round((playerCount / maxPlayers) * 100)}%</span>
                            </div>
                            <progress
                                className="progress progress-primary w-full"
                                value={playerCount}
                                max={maxPlayers}
                            ></progress>
                        </div>
                    )}

                    {game.phase && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400"/>
                                <span className="font-medium text-gray-900 dark:text-white">Phase</span>
                            </div>
                            <span className="badge badge-outline capitalize">{game.phase}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">Type</span>
                        <span className="badge badge-outline">
                                {game.type === 'classic' ? 'Classique' : 'Custom'}
                            </span>
                    </div>
                </div>

                <div className="card-actions mt-6">
                    <button
                        onClick={handleJoin}
                        disabled={!canJoin || joining || !connected}
                        className={`btn w-full ${joining ? 'btn-disabled' : isUserInGame ? 'btn-secondary' : canJoin ? 'btn-primary' : 'btn-disabled'}`}
                    >
                        {joining ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin"/>
                                Connexion...
                            </>
                        ) : isUserInGame ? (
                            <>
                                <Gamepad2 className="w-4 h-4"/>
                                Reprendre la partie
                            </>
                        ) : canJoin ? (
                            <>
                                <LogIn className="w-4 h-4"/>
                                Rejoindre
                            </>
                        ) : game.state === GAME_STATES.FINISHED ? (
                            'Partie terminée'
                        ) : isFull ? (
                            'Partie complète'
                        ) : (
                            'Indisponible'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameListPage;