'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Crown,
    Eye,
    Gamepad2,
    Ghost,
    LogOut,
    RefreshCw,
    ScrollText,
    Shield,
    Skull,
    Swords,
    Timer,
    Trophy,
    User,
    Users
} from 'lucide-react';
import Image from 'next/image';

const GameDetailPage = ({params}) => {
    const {id} = params;

    const [game, setGame] = useState(null);
    const [logs, setLogs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogsLoading, setIsLogsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const fetchGame = async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/game/${id}`, {
                headers: token ? {Authorization: `Bearer ${token}`} : {}
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            setGame(data);

            if (data?.gameLog && Array.isArray(data.gameLog)) {
                const sorted = [...data.gameLog].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                setLogs(sorted);
            } else {
                fetchLogs();
            }
        } catch (e) {
            console.error(e);
            setError("Impossible de charger les détails de la partie.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLogs = async () => {
        if (!id) return;
        setIsLogsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/game/${id}/log`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            if (!res.ok) {
                setIsLogsLoading(false);
                return;
            }
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.logs || []);
            const sorted = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setLogs(sorted);
        } catch (e) {
            console.error('Erreur logs:', e);
        } finally {
            setIsLogsLoading(false);
        }
    };

    useEffect(() => {
        fetchGame();
    }, [id]);

    const calculateGameDuration = () => {
        if (!game?.startedAt) return null;
        const start = new Date(game.startedAt);
        const end = game.endedAt ? new Date(game.endedAt) : new Date();
        const duration = Math.floor((end - start) / 60000);
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes} min`;
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!id) {
        return (
            <div
                className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                    <div
                        className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800">
                        <Gamepad2 className="w-10 h-10 text-white"/>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Identifiant manquant</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        L'identifiant de la partie est introuvable dans l'URL.
                    </p>
                    <Link href="/auth/profile/game/list">
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto">
                            <ArrowLeft className="h-5 w-5"/>
                            Retour aux parties
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative inline-block mb-6">
                        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        <div
                            className="w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Chargement de la
                        partie</h2>
                    <p className="text-gray-600 dark:text-gray-400">Récupération des détails...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div
                        className="rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 text-center">
                        <div
                            className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <Skull className="w-8 h-8 text-red-500 dark:text-red-400"/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Erreur</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={fetchGame}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="h-5 w-5"/>
                                Réessayer
                            </button>
                            <Link href="/auth/profile/game/list">
                                <button
                                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <ArrowLeft className="h-5 w-5"/>
                                    Retour
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const duration = calculateGameDuration();
    const totalPlayers = game?.players?.length || 0;

    return (
        <div
            className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/auth/profile/game/list">
                            <button
                                className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                                <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300"/>
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                {game?.name || 'Partie sans nom'}
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="text-gray-600 dark:text-gray-400">
                                    ID: <span
                                    className="font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">{id}</span>
                                </div>
                                <div
                                    className={`px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 flex items-center gap-2`}>
                                    <Gamepad2 className="h-4 w-4"/>
                                    <span className="text-sm font-medium">{game.state}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                    {[
                        {id: 'overview', label: 'Aperçu', icon: Eye},
                        {id: 'players', label: `Joueurs (${totalPlayers})`, icon: Users},
                        {id: 'timeline', label: 'Journal', icon: ScrollText},
                    ].map(({id, label, icon: Icon}) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                                activeTab === id
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <Icon className="h-5 w-5"/>
                            {label}
                        </button>
                    ))}
                </div>

                {game && (
                    <div className="space-y-8">
                        {activeTab === 'overview' && (
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                                                <div
                                                    className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                                                    <Gamepad2 className="h-5 w-5 text-white"/>
                                                </div>
                                                Informations de la partie
                                            </h2>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div>
                                                        <div
                                                            className="text-sm text-gray-500 dark:text-gray-400 mb-1">Type
                                                            de partie
                                                        </div>
                                                        <div
                                                            className="text-lg font-medium text-gray-900 dark:text-white">
                                                            {game.type || 'Classique'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="text-sm text-gray-500 dark:text-gray-400 mb-1">Durée
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Timer className="h-5 w-5 text-gray-500"/>
                                                            <span
                                                                className="text-lg font-medium text-gray-900 dark:text-white">
                                                                    {duration || 'Non commencée'}
                                                                </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <div
                                                            className="text-sm text-gray-500 dark:text-gray-400 mb-1">Créée
                                                            le
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-5 w-5 text-gray-500"/>
                                                            <span
                                                                className="text-lg font-medium text-gray-900 dark:text-white">
                                                                    {formatDateTime(game.createdAt)}
                                                                </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phase
                                                        </div>
                                                        <div
                                                            className="text-lg font-medium text-gray-900 dark:text-white">
                                                            {game.phase || '—'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {game.winners && game.winners.length > 0 && (
                                        <div
                                            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl overflow-hidden">
                                            <div className="p-6">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                                                        <Trophy className="h-6 w-6 text-white"/>
                                                    </div>
                                                    <div>
                                                        <h2 className="text-xl font-semibold text-white">Vainqueurs</h2>
                                                        <p className="text-white/80 text-sm">Félicitations aux gagnants
                                                            !</p>
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {game.winners.map(winner => (
                                                        <div
                                                            key={winner.id}
                                                            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4"
                                                        >
                                                            <div className="relative">
                                                                <div
                                                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                                                    <Crown className="h-6 w-6 text-white"/>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-bold text-white">
                                                                    {winner.nickname}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                                                <div
                                                    className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                                                    <Shield className="h-5 w-5 text-white"/>
                                                </div>
                                                Administrateur de la partie
                                            </h2>
                                        </div>
                                        <div className="p-6">
                                            {game.admin ? (
                                                <div
                                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
                                                    <div
                                                        className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                                                        {game.admin.nickname?.charAt(0) || 'A'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div
                                                            className="font-bold text-lg text-gray-900 dark:text-white">
                                                            {game.admin.nickname}
                                                        </div>
                                                        <div className="text-gray-600 dark:text-gray-400">
                                                            Créateur de la partie
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                                                        Admin
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <User className="h-12 w-12 text-gray-400 mx-auto mb-3"/>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        Aucun administrateur assigné à cette partie
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Statistiques
                                            </h2>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div
                                                    className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                                                    <Users
                                                        className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2"/>
                                                    <div
                                                        className="text-2xl font-bold text-gray-900 dark:text-white">{totalPlayers}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">Joueurs
                                                    </div>
                                                </div>
                                                <div
                                                    className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
                                                    <Swords
                                                        className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2"/>
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {game.winners?.length || 0}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">Gagnants
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                                                <div
                                                    className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                                                    <Clock className="h-5 w-5 text-white"/>
                                                </div>
                                                Chronologie
                                            </h2>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-6">
                                                {game.createdAt && (
                                                    <div className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                            <div
                                                                className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div
                                                                className="font-medium text-gray-900 dark:text-white">Partie
                                                                créée
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {formatDateTime(game.createdAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {game.startedAt && (
                                                    <div className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                            <div
                                                                className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div
                                                                className="font-medium text-gray-900 dark:text-white">Partie
                                                                commencée
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {formatDateTime(game.startedAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {game.endedAt && (
                                                    <div className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div
                                                                className="font-medium text-gray-900 dark:text-white">Partie
                                                                terminée
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {formatDateTime(game.endedAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'players' && (
                            <div
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                                            <div
                                                className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                                                <Users className="h-5 w-5 text-white"/>
                                            </div>
                                            Liste des Joueurs
                                        </h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {game.players?.map(player => (
                                            <div
                                                key={player.id}
                                                className={`p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                                                    player.isAlive === false
                                                        ? 'border-red-300 dark:border-red-700 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/10 dark:to-red-800/10'
                                                        : 'border-green-300 dark:border-green-700 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-800/10'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div
                                                            className={`w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                                            <Image
                                                                src={player.isBot ? '/bot-avatar.png' : (player.user.avatar || '/default-avatar.png')}
                                                                alt={`${player.isBot ? player.botName : player.user.name} — avatar`}
                                                                width={56}
                                                                height={56}
                                                                className="rounded-full border-2 border-transparent hover:border-blue-500 transition-colors"
                                                            />
                                                        </div>
                                                        {player.isAlive === false && (
                                                            <div className="absolute -top-1 -right-1">
                                                                <Ghost className="h-5 w-5 text-red-500"/>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                                                {player.isBot ? player.botName : player.user?.nickname || 'Joueur'}
                                                            </h3>
                                                            {player.isAdmin && (
                                                                <div
                                                                    className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                                                                    Admin
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div
                                                                className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                                                                <User className="h-3 w-3"/>
                                                                {player.role || 'Inconnu'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                                            <div
                                                className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500">
                                                <ScrollText className="h-5 w-5 text-white"/>
                                            </div>
                                            Journal des événements
                                        </h2>
                                        <button
                                            onClick={fetchLogs}
                                            disabled={isLogsLoading}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
                                        >
                                            <RefreshCw className={`h-4 w-4 ${isLogsLoading ? 'animate-spin' : ''}`}/>
                                            {isLogsLoading ? 'Chargement...' : 'Actualiser'}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {isLogsLoading ? (
                                        <div className="text-center py-12">
                                            <div className="relative inline-block mb-4">
                                                <div
                                                    className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                                                <div
                                                    className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400">Chargement du journal...</p>
                                        </div>
                                    ) : logs === null ? (
                                        <div className="text-center py-12">
                                            <LogOut className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                Journal non disponible
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                Les logs de cette partie ne sont pas accessibles.
                                            </p>
                                        </div>
                                    ) : logs.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                Aucun événement
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Aucun événement n'a été enregistré pour cette partie.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
                                            {logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((log, index) => (
                                                <div
                                                    key={log.id}
                                                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <div className="flex flex-col items-center flex-shrink-0">
                                                        <div className={`w-3 h-3 rounded-full ${
                                                            index === 0 ? 'bg-green-500' :
                                                                index === logs.length - 1 ? 'bg-red-500' :
                                                                    'bg-blue-500'
                                                        }`}></div>
                                                        {index < logs.length - 1 && (
                                                            <div
                                                                className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Clock className="h-4 w-4 text-gray-500"/>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {formatDateTime(log.createdAt)}
                                                                </span>
                                                        </div>
                                                        <p className="text-gray-900 dark:text-white leading-relaxed">
                                                            {log.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameDetailPage;