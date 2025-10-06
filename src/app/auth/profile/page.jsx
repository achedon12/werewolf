'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {formatDate} from "@/utils/Date";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [rank, setRank] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        email: '',
        bio: '',
        avatar: ''
    });

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
                setFormData({
                    name: data.name,
                    nickname: data.nickname,
                    email: data.email,
                    bio: data.bio,
                    avatar: data.avatar
                });

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {

            setTimeout(() => {
                setUser({...user, ...formData});
                setIsEditing(false);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
                            <div
                                className="w-32 h-32 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                                <Image
                                    src={formData.avatar || '/default-avatar.png'}
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
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{user?.bio}</p>

                        <div
                            className="stats shadow mt-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
                            <div className="stat place-items-center">
                                <div className="stat-title">Victoires</div>
                                <div className="stat-value text-primary">{user?.victories}</div>
                                <div className="stat-desc">Parties gagnées</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="card bg-white dark:bg-slate-800 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="card-title text-2xl dark:text-white">
                                {isEditing ? 'Modifier le profil' : 'Informations personnelles'}
                            </h3>
                            <button
                                className={`btn ${isEditing ? 'btn-ghost' : 'btn-primary'}`}
                                onClick={() => setIsEditing(!isEditing)}
                                disabled={isLoading}
                            >
                                {isEditing ? 'Annuler' : '✏️ Modifier'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Nom complet</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input input-bordered"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Pseudo</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nickname"
                                            value={formData.nickname}
                                            onChange={handleChange}
                                            className="input input-bordered"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Bio</span>
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="textarea textarea-bordered h-24"
                                        placeholder="Décrivez-vous en quelques mots..."
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Photo de profil</span>
                                    </label>
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full"
                                        accept="image/*"
                                    />
                                </div>

                                <div className="card-actions justify-end mt-6">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : (
                                            '💾 Sauvegarder'
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label label-text font-semibold">Nom complet</label>
                                        <p className="text-gray-700">{user?.name}</p>
                                    </div>
                                    <div>
                                        <label className="label label-text font-semibold">Pseudo</label>
                                        <p className="text-gray-700">@{user?.nickname}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="label label-text font-semibold">Email</label>
                                    <p className="text-gray-700">{user?.email}</p>
                                </div>

                                <div>
                                    <label className="label label-text font-semibold">Bio</label>
                                    <p className="text-gray-700">{user?.bio}</p>
                                </div>

                                <div>
                                    <label className="label label-text font-semibold">Membre depuis</label>
                                    <p className="text-gray-700">{formatDate(user.createdAt)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card bg-white dark:bg-slate-800 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-2xl mb-6 dark:text-white">📈 Mes Statistiques</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="stat place-items-center bg-base-100 dark:bg-slate-700 rounded-lg p-4">
                                <div className="stat-figure text-primary">
                                    <span className="text-2xl">🎮</span>
                                </div>
                                <div className="stat-title">Parties jouées</div>
                                <div className="stat-value text-lg">{user?.games.length}</div>
                            </div>

                            <div className="stat place-items-center bg-base-100 rounded-lg p-4">
                                <div className="stat-figure text-secondary">
                                    <span className="text-2xl">🏆</span>
                                </div>
                                <div className="stat-title">Victoires</div>
                                <div className="stat-value text-lg">{user.victories}</div>
                            </div>

                            <div className="stat place-items-center bg-base-100 rounded-lg p-4">
                                <div className="stat-figure text-accent">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div className="stat-title">Taux de victoire</div>
                                <div className="stat-value text-lg">
                                    {user && user.games && user.games.length > 0
                                        ? Math.round((user.victories / user.games.length) * 100)
                                        : 0
                                    }%
                                </div>
                            </div>

                            <div className="stat place-items-center bg-base-100 rounded-lg p-4">
                                <div className="stat-figure text-info">
                                    <span className="text-2xl">⭐</span>
                                </div>
                                <div className="stat-title">Classement</div>
                                <div className="stat-value text-lg">{`#${rank}`}</div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold mb-4 dark:text-white">Progression mensuelle</h4>
                            <div
                                className="bg-gray-100 dark:bg-slate-700 rounded-lg h-32 flex items-center justify-center">
                                <p className="text-gray-500 dark:text-gray-300">Graphique de progression à
                                    implémenter</p>
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
                                     className="flex items-center gap-4 p-3 bg-base-100 dark:bg-slate-700 rounded-lg">
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