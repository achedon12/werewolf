"use client";
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Head from 'next/head';
import {io} from 'socket.io-client';
import {formatDate} from "@/utils/Date";
import {Calendar, Clock8, Cog, Target, UserRound} from "lucide-react";

const GameListPage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const newSocket = io({
            path: '/socket.io',
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            setConnected(true);
            setLoading(false);

            newSocket.emit('get-available-games');
        });

        newSocket.on('disconnect', () => {
            setConnected(false);
        });

        newSocket.on('available-games', (gamesData) => {
            setGames(gamesData || []);
            setLoading(false);
        });

        newSocket.on('connection-error', (error) => {
            setError(error.message);
            setLoading(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);


    const joinGame = (gameId) => {
        if (!socket) return;

        const game = games.find(g => g.id === gameId);
        if (!game) {
            setError('Partie non trouvée');
            return;
        }

        if (game.state === 'terminée') {
            setError('Cette partie est terminée');
            return;
        }

        router.push(`/game/${gameId}`);
    };

    const refreshGames = () => {
        if (socket && connected) {
            socket.emit('get-available-games');
        }
    };

    const filteredGames = games.filter(game => {
        switch (filter) {
            case 'En attente':
                return game.state === 'En attente';
            case 'En cours':
                return game.state === 'En cours';
            case 'Terminée':
                return game.state === 'terminée';
            default:
                return true;
        }
    });

    const getStatusBadge = (state) => {
        const statusConfig = {
            'En attente': {label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200'},
            'En cours': {label: 'En cours', color: 'bg-green-100 text-green-800 border-green-200'},
            'terminée': {label: 'Terminée', color: 'bg-gray-100 text-gray-800 border-gray-200'}
        };

        const config = statusConfig[state] || {label: state, color: 'bg-gray-100 text-gray-800 border-gray-200'};

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
            >
                {config.label}
            </span>
        );
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Connexion au serveur de jeu...</p>
                    <p className="text-gray-500 text-sm mt-2">Chargement des parties disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Liste des Parties - Loups Garous</title>
                <meta name="description" content="Rejoignez ou créez une partie de Loups Garous en temps réel"/>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center mb-4">
                            <div
                                className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                            <span className={`text-sm font-medium ${connected ? 'text-green-300' : 'text-red-300'}`}>
                                {connected ? 'Connecté au serveur' : 'Déconnecté'}
                              </span>
                        </div>

                        <h1 className="text-4xl font-extrabold text-white mb-2">
                            Parties de Loups Garous
                        </h1>
                        <p className="text-lg text-gray-300">
                            Rejoignez une partie existante ou créez-en une nouvelle en temps réel
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            {games.length} partie(s) disponible(s)
                        </p>
                    </div>

                    <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                Toutes ({games.length})
                            </button>
                            <button
                                onClick={() => setFilter('En attente')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    filter === 'En attente'
                                        ? 'bg-yellow-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                En attente ({games.filter(g => g.state === 'En attente').length})
                            </button>
                            <button
                                onClick={() => setFilter('En cours')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    filter === 'En cours'
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                En cours ({games.filter(g => g.state === 'En cours').length})
                            </button>
                            <button
                                onClick={() => setFilter('Terminée')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    filter === 'Terminée'
                                        ? 'bg-gray-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                Terminées ({games.filter(g => g.state === 'terminée').length})
                            </button>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={refreshGames}
                                disabled={!connected}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                <span>Actualiser</span>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span className="text-red-800">{error}</span>
                                </div>
                                <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {filteredGames.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Aucune partie disponible
                            </h3>
                            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                                {filter !== 'all'
                                    ? `Aucune partie dans la catégorie "${filter}" pour le moment.`
                                    : "Il n'y a aucune partie active. Soyez le premier à créer une partie !"}
                            </p>
                            {filter !== 'all' && (
                                <button
                                    onClick={() => setFilter('all')}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-lg"
                                >
                                    Voir toutes les parties
                                </button>
                            )}
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
                                    getStatusBadge={getStatusBadge}
                                    connected={connected}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const GameCard = ({game, onJoin, playerCount, maxPlayers, getStatusBadge, connected}) => {
    const [joining, setJoining] = useState(false);

    const handleJoin = async () => {
        if (!connected) return;

        setJoining(true);
        try {
            await onJoin(game.id);
        } finally {
            setJoining(false);
        }
    };

    const canJoin = game.state === 'En attente' && playerCount < maxPlayers;
    const isFull = game.state === 'En attente' && playerCount >= maxPlayers;
    const isInProgress = game.state === 'En cours';
    const isFinished = game.state === 'terminée';

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 truncate pr-2 flex-1">
                        {game.name || `Partie ${game.id.slice(0, 8)}...`}
                    </h3>
                    {getStatusBadge(game.state)}
                </div>

                <div className="mb-4">
                    <div className="text-gray-600 mb-2 text-sm">
                        {game.type === 'classic' ? <Target className="inline w-4 h-4 mr-1 text-gray-400"/> :
                            <Cog className="inline w-4 h-4 mr-1 text-gray-400"/>}
                        {game.type === 'classic' ? 'Partie Classique' : 'Partie Custom'}
                    </div>
                    {game.createdAt && (
                        <div className="text-sm text-gray-500">
                            <Calendar className="inline w-4 h-4 mr-1 text-gray-400"/>
                            Créée le {formatDate(game.createdAt)}
                        </div>
                    )}
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-2 text-gray-700">
                            <UserRound className="w-4 h-4"/>
                            <span>Joueurs connectés</span>
                        </div>
                        <span
                            className={`font-semibold ${playerCount === maxPlayers ? 'text-green-600' : 'text-blue-600'}`}>
                          {playerCount}/{maxPlayers}
                        </span>
                    </div>

                    {game.phase && (
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-2 text-gray-700">
                                <Clock8 className="w-4 h-4 text-gray-400"/>
                                <span>Phase actuelle</span>
                            </div>
                            <span className="font-medium text-gray-900 capitalize">{game.phase}</span>
                        </div>
                    )}
                </div>

                {game.state === 'En attente' && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Remplissage de la partie</span>
                            <span>{Math.round((playerCount / maxPlayers) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    playerCount === maxPlayers ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{width: `${(playerCount / maxPlayers) * 100}%`}}
                            ></div>
                        </div>
                    </div>
                )}

                <div className="flex space-x-2">
                    <button
                        onClick={handleJoin}
                        disabled={!connected || joining || isFinished || (isFull && !isInProgress)}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                            canJoin
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                : isInProgress
                                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        } ${joining ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {joining ? (
                            <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Connexion...
                          </span>
                        ) : isInProgress ? (
                            '👁️ Spectateur'
                        ) : isFull ? (
                            '🚫 Complète'
                        ) : isFinished ? (
                            '🏁 Terminée'
                        ) : (
                            '🎮 Rejoindre'
                        )}
                    </button>
                </div>

                {isFull && (
                    <p className="text-xs text-orange-600 mt-2 text-center">
                        Partie complète - En attente du lancement
                    </p>
                )}
                {isFinished && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Cette partie est terminée
                    </p>
                )}
            </div>
        </div>
    );
}

export default GameListPage;