'use client';

import {useEffect, useState} from 'react';
import {useAuth} from "@/app/AuthProvider";
import {Calendar, ChartColumn, Drama, Earth, Flame, Gamepad2, Skull, Tag, Trophy, Zap} from "lucide-react";

const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s || parts.length === 0) parts.push(`${s}s`);
    return parts.join(' ');
};

const StatsPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month'); // week, month, all
    const {user} = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/auth/profile/stats?timeRange=${timeRange}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                console.log('Données des stats reçues:', data);
                setStats(data);
            } catch (error) {
                console.error('Erreur lors du chargement des stats:', error);
            }
            setIsLoading(false);
        };

        fetchStats();
    }, [timeRange]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                    <p className="text-gray-600 dark:text-gray-400">Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    <ChartColumn className="inline-block w-8 h-8 text-primary mr-2"/>
                    Mes Statistiques
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Suis ta progression et deviens le maître du Loup-Garou
                </p>

                <div className="flex justify-center space-x-2 mt-4">
                    {['week', 'month', 'all'].map((range) => (
                        <button
                            key={range}
                            className={`btn btn-sm ${timeRange === range ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setTimeRange(range)}
                        >
                            {range === 'week' && 'Cette semaine'}
                            {range === 'month' && 'Ce mois'}
                            {range === 'all' && 'Tout le temps'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="card-title text-white text-3xl">{stats.gamesPlayed}</h3>
                                <p className="text-blue-100">Parties jouées</p>
                            </div>
                            <Gamepad2 className="text-4xl"/>
                        </div>
                        <div className="text-blue-200 text-sm mt-2">
                            +5 cette semaine
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="card-title text-white text-3xl">{stats.winRate}%</h3>
                                <p className="text-green-100">Taux de victoire</p>
                            </div>
                            <Trophy className="text-4xl"/>
                        </div>
                        <div className="text-green-200 text-sm mt-2">
                            {stats.gamesWon} victoires sur {stats.gamesPlayed}
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="card-title text-white text-3xl">{stats.currentStreak}</h3>
                                <p className="text-purple-100">Série actuelle</p>
                            </div>
                            <Flame className="text-4xl"/>
                        </div>
                        <div className="text-purple-200 text-sm mt-2">
                            Meilleure série: {stats.bestStreak}
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="card-title text-white text-xl">{stats.favoriteRole}</h3>
                                <p className="text-orange-100">Rôle favori</p>
                            </div>
                            <Drama className="text-4xl"/>
                        </div>
                        <div className="text-orange-200 text-sm mt-2">
                            {stats.rolesPlayed[stats.favoriteRole]} parties
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-xl">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="card-title text-white text-3xl">{formatDuration(stats.totalPlayTime)}</h3>
                                <p className="text-teal-100">Temps de jeu total</p>
                            </div>
                            <Calendar className="text-4xl"/>
                        </div>
                        <div className="text-teal-200 text-sm mt-2">
                            Depuis le début ({stats.timeRange})
                        </div>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-white dark:bg-gray-800 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-gray-900 dark:text-white mb-4">
                            <Drama className="inline-block w-6 h-6 text-primary mr-2"/>
                            Distribution des Rôles
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(stats.rolesPlayed).map(([role, count]) => {
                                const percentage = (count / stats.gamesPlayed) * 100;
                                return (
                                    <div key={role} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">{role}</span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                        {count} parties ({percentage.toFixed(1)}%)
                                                    </span>
                                        </div>
                                        <progress
                                            className="progress progress-primary w-full h-2"
                                            value={percentage}
                                            max="100"
                                        ></progress>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-gray-900 dark:text-white mb-4">
                            <Trophy className="inline-block w-6 h-6 text-primary mr-2"/>
                            Mes Classements
                        </h3>
                        <div className="space-y-4">
                            <div
                                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Earth className="text-2xl"/>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Classement Global</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Tous les joueurs</p>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-primary">#{stats.rankings.global}</div>
                            </div>

                            <div
                                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="text-2xl"/>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Ce mois-ci</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Top mensuel</p>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-secondary">#{stats.rankings.monthly}</div>
                            </div>

                            <div
                                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Zap className="text-2xl"/>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Cette semaine</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Top hebdomadaire</p>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-accent">#{stats.rankings.weekly}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-xl lg:col-span-2">
                    <div className="card-body">
                        <h3 className="card-title text-gray-900 dark:text-white mb-4">
                            <Tag className="inline-block w-6 h-6 text-primary mr-2"/>
                            Activité Récente
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Rôle</th>
                                    <th>Résultat</th>
                                    <th>Performance</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stats.recentActivity.map((game, index) => (
                                    <tr key={index}>
                                        <td className="font-medium">
                                            {new Date(game.date).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td>
                                            <span className="badge badge-outline">{game.role}</span>
                                        </td>
                                        <td>
                                                    <span
                                                        className={`badge ${game.result === 'win' ? 'badge-success' : 'badge-error'}`}>
                                                        {game.result === 'win' ? 'Victoire' : 'Défaite'}
                                                        {game.result === 'win' ? <Trophy size={14}/> :
                                                            <Skull size={14}/>}
                                                    </span>
                                        </td>
                                        <td>
                                            <div className="rating rating-sm">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <input
                                                        key={star}
                                                        type="radio"
                                                        className="mask mask-star-2 bg-orange-400"
                                                        defaultChecked={star === 4}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPage;