'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {formatDate} from "@/utils/Date";
import {useAuth} from "@/app/AuthProvider";

const OverviewPage = () => {
    const [user, setUser] = useState(null);
    const [rank, setRank] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {logout} = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch('/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setUser(data);

                const rankRes = await fetch('/api/leaderboard/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const rankData = await rankRes.json();
                setRank(rankData.rank);
            } catch (error) {
                console.error('Erreur lors du chargement du profil:', error);
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    if (isLoading && !user) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="card bg-white dark:bg-slate-800 shadow-xl sticky top-8">
                    <div className="card-body items-center text-center">
                        <div className="avatar mb-4">
                            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                                <Image
                                    src={user?.avatar || '/default-avatar.png'}
                                    alt="Avatar"
                                    width={128}
                                    height={128}
                                    className="rounded-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="card-title text-2xl dark:text-white">{user?.name}</h2>
                            {user?.verified && (
                                <div className="tooltip" data-tip="Compte vérifié">
                                    <div className="badge badge-success gap-1">
                                        <span>✓</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300">@{user?.nickname}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {user?.bio || 'Aucune bio disponible.'}
                        </p>

                        <div className="stats shadow mt-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 w-full">
                            <div className="stat place-items-center">
                                <div className="stat-title">Victoires</div>
                                <div className="stat-value text-primary text-2xl">{user?.victories || 0}</div>
                                <div className="stat-desc">Parties gagnées</div>
                            </div>
                        </div>

                        <div className="w-full mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Membre depuis</span>
                                <span className="text-gray-700 dark:text-gray-300">
                                    {user ? formatDate(user.createdAt) : '...'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Classement</span>
                                <span className="text-primary font-semibold">
                                    {rank ? `#${rank}` : '...'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-center mb-4 px-4 w-full">
                        <button
                            className="btn btn-outline btn-error w-full"
                            onClick={logout}
                        >
                            🚪 Se déconnecter
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="card bg-white dark:bg-slate-800 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-2xl mb-6 dark:text-white">📈 Mes Statistiques</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col items-center justify-center bg-base-100 dark:bg-slate-700 rounded-lg p-4 text-center">
                                <div className="text-primary mb-2">
                                    <span className="text-2xl">🎮</span>
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Parties jouées</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{user?.games?.length || 0}</div>
                            </div>

                            <div className="flex flex-col items-center justify-center bg-base-100 dark:bg-slate-700 rounded-lg p-4 text-center">
                                <div className="text-secondary mb-2">
                                    <span className="text-2xl">🏆</span>
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Victoires</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{user?.victories || 0}</div>
                            </div>

                            <div className="flex flex-col items-center justify-center bg-base-100 dark:bg-slate-700 rounded-lg p-4 text-center">
                                <div className="text-accent mb-2">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Taux de victoire</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                    {user && user.games && user.games.length > 0
                                        ? Math.round((user.victories / user.games.length) * 100)
                                        : 0
                                    }%
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center bg-base-100 dark:bg-slate-700 rounded-lg p-4 text-center">
                                <div className="text-info mb-2">
                                    <span className="text-2xl">⭐</span>
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Classement</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{rank ? `#${rank}` : 'N/A'}</div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold mb-4 dark:text-white">Progression mensuelle</h4>
                            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg h-32 flex items-center justify-center">
                                <p className="text-gray-500 dark:text-gray-300">Graphique de progression à implémenter</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-white dark:bg-slate-800 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-2xl mb-6 dark:text-white">🕐 Activités récentes</h3>
                        <div className="space-y-4">
                            {[
                                {action: "Victoire en tant que Loup-Garou", date: "2024-10-05 21:30", type: "victory"},
                                {action: "Partie rejointe", date: "2024-10-05 20:15", type: "join"},
                                {action: "Nouveau record personnel", date: "2024-10-04 19:45", type: "record"}
                            ].map((activity, index) => (
                                <div key={index}
                                     className="flex items-center gap-4 p-3 bg-base-100 dark:bg-slate-700 rounded-lg hover:bg-base-200 dark:hover:bg-slate-600 transition-colors">
                                    <div className={`w-3 h-3 rounded-full ${
                                        activity.type === 'victory' ? 'bg-success' :
                                            activity.type === 'join' ? 'bg-info' : 'bg-warning'
                                    }`}></div>
                                    <div className="flex-1">
                                        <p className="font-medium dark:text-white">{activity.action}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-300">{activity.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewPage;