'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Crown,
    Eye,
    Gamepad2,
    RefreshCw,
    ScrollText,
    Shield,
    Skull,
    Trophy,
    User,
    Users,
    Zap
} from 'lucide-react';

const GameDetailPage = () => {
    const params = useParams();
    const id = params?.id;

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

    const getStatusConfig = (state) => {
        const config = {
            'finished': {color: 'bg-gradient-to-r from-green-500 to-emerald-600', icon: Trophy, text: 'Terminée'},
            'in_progress': {color: 'bg-gradient-to-r from-orange-500 to-red-500', icon: Zap, text: 'En cours'},
            'waiting': {color: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: Clock, text: 'En attente'},
            'cancelled': {color: 'bg-gradient-to-r from-gray-500 to-gray-700', icon: Skull, text: 'Annulée'},
        };
        return config[state] || {
            color: 'bg-gradient-to-r from-purple-500 to-pink-500',
            icon: Gamepad2,
            text: state || 'Inconnu'
        };
    };

    const calculateGameDuration = () => {
        if (!game?.startedAt) return null;
        const start = new Date(game.startedAt);
        const end = game.endedAt ? new Date(game.endedAt) : new Date();
        const duration = Math.floor((end - start) / 60000);
        return `${Math.floor(duration / 60)}h ${duration % 60}m`;
    };

    if (!id) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Identifiant manquant</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">L'identifiant de la partie est introuvable.</p>
                    <Link href="/auth/profile/game/list">
                        <button className="btn btn-primary gap-2">
                            <ArrowLeft className="h-4 w-4"/>
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
                className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
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
                className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-error text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Erreur</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <div className="space-x-2">
                        <button className="btn btn-primary" onClick={fetchGame}>
                            <RefreshCw className="h-4 w-4"/>
                            Réessayer
                        </button>
                        <Link href="/auth/profile/game/list">
                            <button className="btn btn-ghost">
                                <ArrowLeft className="h-4 w-4"/>
                                Retour
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(game?.state);
    const IconComponent = statusConfig.icon;

    return (
        <div
            className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/auth/profile/game/list">
                            <button className="btn btn-ghost btn-circle">
                                <ArrowLeft className="h-5 w-5"/>
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                {game?.name || 'Partie sans nom'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Code: <span
                                className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{id}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div
                            className={`px-4 py-2 rounded-full text-white font-semibold flex items-center gap-2 ${statusConfig.color}`}>
                            <IconComponent className="h-4 w-4"/>
                            {statusConfig.text}
                        </div>
                        <button
                            className="btn btn-outline gap-2"
                            onClick={fetchGame}
                        >
                            <RefreshCw className="h-4 w-4"/>
                            Actualiser
                        </button>
                    </div>
                </div>

                <div className="tabs tabs-boxed bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1">
                    <button
                        className={`tab tab-lg ${activeTab === 'overview' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <Eye className="h-4 w-4"/>
                        Aperçu
                    </button>
                    <button
                        className={`tab tab-lg ${activeTab === 'players' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('players')}
                    >
                        <Users className="h-4 w-4"/>
                        Joueurs ({game?.players?.length || 0})
                    </button>
                    <button
                        className={`tab tab-lg ${activeTab === 'timeline' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('timeline')}
                    >
                        <ScrollText className="h-4 w-4"/>
                        Journal
                    </button>
                </div>

                {game && (
                    <div className="space-y-6">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div
                                        className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                                        <div className="card-body">
                                            <h2 className="card-title text-2xl flex items-center gap-2">
                                                <Gamepad2 className="h-6 w-6 text-primary"/>
                                                Informations de la partie
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="label label-text font-semibold">Type de
                                                            partie</label>
                                                        <p className="text-lg">{game.type || 'Classique'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="label label-text font-semibold">Durée</label>
                                                        <p className="text-lg flex items-center gap-2">
                                                            <Clock className="h-4 w-4"/>
                                                            {calculateGameDuration() || 'Non commencée'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="label label-text font-semibold">Créée
                                                            le</label>
                                                        <p className="text-lg flex items-center gap-2">
                                                            <Calendar className="h-4 w-4"/>
                                                            {game.createdAt ? new Date(game.createdAt).toLocaleDateString('fr-FR') : '—'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="label label-text font-semibold">Phase</label>
                                                        <p className="text-lg">{game.phase || '—'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {game.winners && game.winners.length > 0 && (
                                        <div
                                            className="card bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-2xl">
                                            <div className="card-body">
                                                <h2 className="card-title text-2xl flex items-center gap-2">
                                                    <Trophy className="h-6 w-6"/>
                                                    Vainqueurs
                                                </h2>
                                                <div className="flex flex-wrap gap-3">
                                                    {game.winners.map(winner => (
                                                        <div key={winner.id}
                                                             className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
                                                            <Crown className="h-5 w-5 text-yellow-300"/>
                                                            <div>
                                                                <div
                                                                    className="font-bold">{winner.name || winner.nickname}</div>
                                                                <div
                                                                    className="text-white/80 text-sm">{winner.role || 'Joueur'}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                                        <div className="card-body">
                                            <h2 className="card-title text-xl flex items-center gap-2">
                                                <Shield className="h-5 w-5 text-blue-500"/>
                                                Administrateur
                                            </h2>
                                            {game.admin ? (
                                                <div
                                                    className="flex items-center gap-4 p-4 bg-base-200 dark:bg-gray-700 rounded-2xl">
                                                    <img
                                                        src={game.admin.avatar || '/default-avatar.png'}
                                                        alt="Admin"
                                                        className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-600"
                                                    />
                                                    <div>
                                                        <div
                                                            className="font-bold text-lg">{game.admin.name || game.admin.nickname}</div>
                                                        <div
                                                            className="text-gray-600 dark:text-gray-400">{game.admin.email}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">Aucun administrateur assigné</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div
                                        className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                                        <div className="card-body">
                                            <h3 className="card-title">Statistiques</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Joueurs</span>
                                                    <span
                                                        className="font-bold text-lg">{game.players?.length || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">En vie</span>
                                                    <span className="font-bold text-lg text-success">
                                                        {game.players?.filter(p => p.isAlive !== false).length || 0}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Éliminés</span>
                                                    <span className="font-bold text-lg text-error">
                                                        {game.players?.filter(p => p.isAlive === false).length || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                                        <div className="card-body">
                                            <h3 className="card-title">Timeline</h3>
                                            <div className="space-y-3">
                                                {game.createdAt && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <div>
                                                            <div className="font-medium">Partie créée</div>
                                                            <div className="text-xs text-gray-500">
                                                                {new Date(game.createdAt).toLocaleString('fr-FR')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {game.startedAt && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                        <div>
                                                            <div className="font-medium">Partie commencée</div>
                                                            <div className="text-xs text-gray-500">
                                                                {new Date(game.startedAt).toLocaleString('fr-FR')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {game.endedAt && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                                        <div>
                                                            <div className="font-medium">Partie terminée</div>
                                                            <div className="text-xs text-gray-500">
                                                                {new Date(game.endedAt).toLocaleString('fr-FR')}
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
                                className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                                <div className="card-body">
                                    <h2 className="card-title text-2xl flex items-center gap-2">
                                        <Users className="h-6 w-6 text-primary"/>
                                        Liste des Joueurs
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {game.players?.map(player => (
                                            <div
                                                key={player.id}
                                                className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                                                    player.isAlive === false
                                                        ? 'border-error bg-error/10'
                                                        : 'border-success bg-success/10'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={player.user?.avatar || '/default-avatar.png'}
                                                        alt="Avatar"
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold truncate">
                                                            {player.user?.name || player.user?.nickname || 'Joueur'}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="badge gap-1 badge-ghost">
                                                                <User className="h-3 w-3"/>
                                                                {player.role || 'Inconnu'}
                                                            </div>
                                                            {player.isAdmin && (
                                                                <div className="badge badge-primary badge-sm">
                                                                    <Shield className="h-3 w-3"/>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {player.isAlive === false && (
                                                        <Skull className="h-5 w-5 text-error"/>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div
                                className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                                <div className="card-body">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="card-title text-2xl flex items-center gap-2">
                                            <ScrollText className="h-6 w-6 text-primary"/>
                                            Journal des événements
                                        </h2>
                                        <button
                                            className="btn btn-outline btn-sm gap-2"
                                            onClick={fetchLogs}
                                            disabled={isLogsLoading}
                                        >
                                            <RefreshCw className={`h-4 w-4 ${isLogsLoading ? 'animate-spin' : ''}`}/>
                                            {isLogsLoading ? 'Chargement...' : 'Actualiser'}
                                        </button>
                                    </div>

                                    {isLogsLoading && (
                                        <div className="text-center py-8">
                                            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                                            <p className="text-gray-600 dark:text-gray-400">Chargement du journal...</p>
                                        </div>
                                    )}

                                    {!isLogsLoading && logs === null && (
                                        <div className="text-center py-12">
                                            <ScrollText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                Journal non disponible
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Les logs de cette partie ne sont pas accessibles.
                                            </p>
                                        </div>
                                    )}

                                    {!isLogsLoading && Array.isArray(logs) && logs.length === 0 && (
                                        <div className="text-center py-12">
                                            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                Aucun événement
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Aucun événement n'a été enregistré pour cette partie.
                                            </p>
                                        </div>
                                    )}

                                    {!isLogsLoading && Array.isArray(logs) && logs.length > 0 && (
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {logs.map((log, index) => (
                                                <div
                                                    key={log.id}
                                                    className="flex gap-4 p-4 bg-base-100 dark:bg-gray-700 rounded-2xl border-l-4 border-primary hover:shadow-md transition-all"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                                                        {index < logs.length - 1 && (
                                                            <div
                                                                className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-1"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Clock className="h-4 w-4 text-gray-500"/>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(log.createdAt).toLocaleString('fr-FR')}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-900 dark:text-white">{log.message}</p>
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
}

export default GameDetailPage;