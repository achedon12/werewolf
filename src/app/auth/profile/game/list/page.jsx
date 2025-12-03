'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useAuth} from "@/app/AuthProvider.jsx";
import {
    Calendar,
    Clock,
    Crown,
    Eye,
    Filter,
    Gamepad2,
    Loader2,
    Medal,
    RefreshCw,
    Search,
    Swords,
    TrendingUp,
    Trophy,
    Users,
    X
} from 'lucide-react';

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
    const [gameTypeFilter, setGameTypeFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

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

    const getGameTypes = () => {
        const types = new Set();
        games.forEach(game => {
            if (game.type) types.add(game.type);
        });
        return Array.from(types);
    };

    const getWinnerBadge = (game, user) => {
        if (!game.winners || game.winners.length === 0) return null;

        const isWinner = game.winners.some(winner =>
            winner.id === user?.id || winner.nickname === user?.nickname
        );

        if (isWinner) {
            return (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm"></div>
                        <div
                            className="relative bg-gradient-to-br from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Crown className="h-3 w-3"/>
                            Gagnant
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const getGameDuration = (game) => {
        const start = game.startedAt || game.createdAt;
        const end = game.endedAt;
        if (!start || !end) return null;

        const duration = new Date(end) - new Date(start);
        const minutes = Math.floor(duration / (1000 * 60));
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}min`;
        }
        return `${minutes} min`;
    };

    const filteredGames = games
        .filter(game => {
            const matchesSearch = !searchTerm ||
                game.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.type?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = gameTypeFilter === 'all' || game.type === gameTypeFilter;

            return matchesSearch && matchesType;
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
                case 'duration':
                    const durA = game.startedAt && game.endedAt ? new Date(game.endedAt) - new Date(game.startedAt) : 0;
                    const durB = game.startedAt && game.endedAt ? new Date(game.endedAt) - new Date(game.startedAt) : 0;
                    return durB - durA;
                default:
                    return dateB - dateA;
            }
        });

    const GameCard = ({game}) => {
        const date = game.startedAt ;
        const playersCount = game.playersCount;
        const winners = game.winners?.map(w => w.nickname || w.botName).join(', ') || 'Aucun';
        const duration = getGameDuration(game);

        return (
            <div className="group relative">
                <div
                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div
                    className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    {getWinnerBadge(game, user)}

                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 pr-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate mb-1">
                                    {game.name || 'Partie sans nom'}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                        <Gamepad2 className="h-3 w-3"/>
                                        {game.type || 'Classique'}
                                    </span>
                                    <span
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                        <Trophy className="h-3 w-3"/>
                                        Terminée
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                                    <Calendar className="h-4 w-4"/>
                                    {date ? new Date(date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'short'
                                    }) : '-'}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {date ? new Date(date).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : ''}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400"/>
                                    <span
                                        className="text-lg font-bold text-gray-900 dark:text-white">{playersCount}</span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Joueurs</span>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400"/>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {duration || '-'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Durée</span>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Medal className="h-4 w-4 text-amber-500"/>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {game.winners?.length || 0}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Gagnants</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Gagnant(s) :</div>
                            <div className="flex flex-wrap gap-1">
                                {game.winners?.slice(0, 3).map((winner, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300"
                                    >
                                        <Crown className="h-3 w-3"/>
                                        {winner.nickname || winner.botName || 'Anonyme'}
                                    </span>
                                ))}
                                {game.winners?.length > 3 && (
                                    <span
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                        +{game.winners.length - 3} autres
                                    </span>
                                )}
                                {(!game.winners || game.winners.length === 0) && (
                                    <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                                        Aucun gagnant désigné (peut contenir des bots)
                                    </span>
                                )}
                            </div>
                        </div>

                        <Link href={`/auth/profile/game/${game.id}`}>
                            <button
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform"/>
                                <span>Voir les détails</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const totalGames = games.length;
    const wins = games.filter(g => g.winners?.some(w => w.id === user?.id)).length;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center">
                    <div
                        className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                        <Gamepad2 className="w-10 h-10 text-white"/>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Historique des Parties
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Retrouvez toutes vos parties de Loup-Garou, analysez vos performances et progressez
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                                <Gamepad2 className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <div
                                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{totalGames}</div>
                                <div className="text-gray-600 dark:text-gray-400">Parties jouées</div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600">
                                <Trophy className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <div
                                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{wins}</div>
                                <div className="text-gray-600 dark:text-gray-400">Victoires</div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                                <TrendingUp className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <div
                                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{winRate}%
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">Taux de victoire</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                placeholder="Rechercher une partie par nom ou type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
                            <span className="text-gray-700 dark:text-gray-300">Filtres</span>
                            {showFilters ? (
                                <X className="h-4 w-4"/>
                            ) : (
                                <span className="badge badge-sm">{getGameTypes().length}</span>
                            )}
                        </button>

                        <select
                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="recent">Plus récentes</option>
                            <option value="oldest">Plus anciennes</option>
                            <option value="players">Plus de joueurs</option>
                            <option value="duration">Durée</option>
                        </select>
                    </div>

                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="h-4 w-4 text-gray-500"/>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Filtrer par type
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setGameTypeFilter('all')}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                        gameTypeFilter === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Tous les types
                                </button>
                                {getGameTypes().map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setGameTypeFilter(type)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                            gameTypeFilter === type
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div
                        className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                                    <X className="w-5 h-5 text-red-600 dark:text-red-400"/>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-red-800 dark:text-red-300">Erreur</h3>
                                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => fetchGames(1)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4"/>
                                Réessayer
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredGames.map((game) => (
                        <GameCard key={game.id} game={game}/>
                    ))}
                </div>

                {filteredGames.length === 0 && !isLoading && (
                    <div className="text-center py-16">
                        <div
                            className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                            <Gamepad2 className="w-12 h-12 text-gray-400 dark:text-gray-500"/>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                            Aucune partie trouvée
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            {games.length === 0
                                ? "Commencez votre aventure en rejoignant votre première partie de Loup-Garou !"
                                : "Aucune partie ne correspond à vos critères de recherche"
                            }
                        </p>
                        <Link href="/game/list">
                            <button
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto">
                                <Swords className="h-5 w-5"/>
                                Rejoindre une partie
                            </button>
                        </Link>
                    </div>
                )}

                <div className="flex flex-col items-center space-y-6">
                    {isLoading && (
                        <div
                            className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400"/>
                            <span className="text-gray-700 dark:text-gray-300">
                                Chargement des parties...
                            </span>
                        </div>
                    )}

                    {!isLoading && hasMore && filteredGames.length > 0 && (
                        <button
                            onClick={() => fetchGames(page + 1)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                        >
                            <RefreshCw className="h-5 w-5"/>
                            Charger plus de parties
                        </button>
                    )}

                    {!hasMore && filteredGames.length > 0 && (
                        <div
                            className="px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                <Trophy className="h-5 w-5"/>
                                <span className="font-medium">Toutes vos parties sont chargées !</span>
                            </div>
                            <p className="text-green-600 dark:text-green-500 text-sm mt-1">
                                {filteredGames.length} parties au total
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamesPage;