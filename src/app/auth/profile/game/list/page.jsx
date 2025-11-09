'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useAuth} from "@/app/AuthProvider.jsx";
import {Crown, Eye, Gamepad2, RefreshCw, Search, Swords, TrendingUp, Trophy, Users} from 'lucide-react';

const GamesPage = () => {
    const {user} = useAuth();
    const [games, setGames] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    const fetchGames = async (p = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/auth/game/list?page=${p}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            const newGames = Array.isArray(data) ? data : (data.games || []);

            if (p === 1) setGames(newGames);
            else setGames(prev => [...prev, ...newGames]);

            if (newGames.length < limit) setHasMore(false);
            else setHasMore(true);
            setPage(p);
        } catch (e) {
            console.error(e);
            setError('Erreur lors du chargement des parties');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGames(1);
    }, []);

    const getWinnerBadge = (game, user) => {
        if (!game.winners || game.winners.length === 0) return null;

        const isWinner = game.winners.some(winner =>
            winner.id === user?.id || winner.nickname === user?.nickname
        );

        if (isWinner) {
            return (
                <div className="badge badge-warning gap-1">
                    <Crown className="h-3 w-3"/>
                    Victoire
                </div>
            );
        }
        return null;
    };

    const filteredGames = games
        .filter(game => {
            return !searchTerm ||
                game.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.type?.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            const dateA = new Date(a.startedAt || a.createdAt || a.endedAt);
            const dateB = new Date(b.startedAt || b.createdAt || b.endedAt);

            switch (sortBy) {
                case 'recent':
                    return dateB - dateA;
                case 'oldest':
                    return dateA - dateB;
                case 'players':
                    return (b.players?.length || 0) - (a.players?.length || 0);
                default:
                    return dateB - dateA;
            }
        });

    const GameCard = ({game}) => {
        const date = game.startedAt || game.createdAt || game.endedAt;
        const playersCount = game.players?.length || game.users?.length || 0;
        const winners = game.winners?.map(w => w.nickname || w.name || w.id).join(', ') || 'Aucun';

        return (
            <div
                className="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="card-body p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate max-w-[200px]">
                                    {game.name || 'Partie sans nom'}
                                </h3>
                                {getWinnerBadge(game, user)}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="badge gap-1 badge-success">
                                    <Trophy className="h-3 w-3"/>
                                    Terminée
                                </div>
                                <div className="badge badge-outline gap-1">
                                    <Users className="h-3 w-3"/>
                                    {playersCount} joueurs
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {date ? new Date(date).toLocaleDateString('fr-FR') : '-'}
                            </div>
                            <div className="text-xs text-gray-400">
                                {date ? new Date(date).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : ''}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                            <span className="text-gray-500 dark:text-gray-400">Type:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {game.type || 'Classique'}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500 dark:text-gray-400">Gagnant(s):</span>
                            <p className="font-medium text-gray-900 dark:text-white truncate" title={winners}>
                                {winners}
                            </p>
                        </div>
                    </div>

                    <div className="card-actions justify-end">
                        <Link href={`/auth/profile/game/${game.id}`}>
                            <button className="btn btn-primary btn-sm gap-2">
                                <Eye className="h-4 w-4"/>
                                Voir les détails
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 space-y-8">
                <div className="text-center">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                            <Gamepad2 className="h-8 w-8 text-white"/>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            Mes Parties
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Retrouvez l'historique complet de vos parties de Loup-Garou
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        className="stat bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                        <div className="stat-figure text-primary">
                            <Gamepad2 className="h-8 w-8"/>
                        </div>
                        <div className="stat-title text-gray-600 dark:text-gray-300">Parties totales</div>
                        <div className="stat-value text-primary text-2xl">{games.length}</div>
                    </div>

                    <div
                        className="stat bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                        <div className="stat-figure text-success">
                            <Trophy className="h-8 w-8"/>
                        </div>
                        <div className="stat-title text-gray-600 dark:text-gray-300">Victoires</div>
                        <div className="stat-value text-success text-2xl">
                            {games.filter(g => g.winners?.some(w => w.id === user?.id)).length}
                        </div>
                    </div>

                    <div
                        className="stat bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                        <div className="stat-figure text-warning">
                            <TrendingUp className="h-8 w-8"/>
                        </div>
                        <div className="stat-title text-gray-600 dark:text-gray-300">Taux de victoire</div>
                        <div className="stat-value text-warning text-2xl">
                            {games.length > 0
                                ? Math.round((games.filter(g => g.winners?.some(w => w.id === user?.id)).length / games.length) * 100)
                                : 0
                            }%
                        </div>
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="input input-bordered flex items-center gap-2">
                                    <Search className="h-4 w-4"/>
                                    <input
                                        type="text"
                                        className="grow"
                                        placeholder="Rechercher une partie..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </label>
                            </div>

                            <select
                                className="select select-bordered"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="recent">Plus récentes</option>
                                <option value="oldest">Plus anciennes</option>
                                <option value="players">Plus de joueurs</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error shadow-lg">
                        <span>{error}</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => fetchGames(1)}>
                            <RefreshCw className="h-4 w-4"/>
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredGames.map((game) => (
                        <GameCard key={game.id} game={game}/>
                    ))}
                </div>

                {filteredGames.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <Gamepad2 className="h-24 w-24 text-gray-400 mx-auto mb-4"/>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Aucune partie trouvée
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {games.length === 0
                                ? "Vous n'avez pas encore joué de parties"
                                : "Aucune partie ne correspond à vos critères"
                            }
                        </p>
                        <Link href="/game/list">
                            <button className="btn btn-primary gap-2">
                                <Swords className="h-4 w-4"/>
                                Rejoindre une partie
                            </button>
                        </Link>
                    </div>
                )}

                <div className="flex flex-col items-center space-y-4">
                    {isLoading && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <RefreshCw className="h-5 w-5 animate-spin"/>
                            Chargement des parties...
                        </div>
                    )}

                    {!isLoading && hasMore && filteredGames.length > 0 && (
                        <button
                            className="btn btn-outline gap-2"
                            onClick={() => fetchGames(page + 1)}
                        >
                            <RefreshCw className="h-4 w-4"/>
                            Charger plus de parties
                        </button>
                    )}

                    {!hasMore && filteredGames.length > 0 && (
                        <div className="text-center">
                            <div className="badge badge-success gap-2 p-4">
                                <Trophy className="h-4 w-4"/>
                                Toutes vos parties sont chargées !
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamesPage;