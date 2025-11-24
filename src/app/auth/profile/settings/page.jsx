'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {formatDate} from "@/utils/Date";
import {toast} from "react-toastify";
import {useAuth} from "@/app/AuthProvider";

const SettingsPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [themeEnabled, setThemeEnabled] = useState(true);
    const {token, setUser} = useAuth()

    const availableThemes = [
        'light',
        'dark'
    ];

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        email: '',
        bio: '',
        avatar: '',
        theme: 'dark'
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
                setUserProfile(data);
                setUser(data);
                setFormData({
                    name: data.name || '',
                    nickname: data.nickname || '',
                    email: data.email || '',
                    bio: data.bio || '',
                    avatar: data.avatar || '',
                    theme: data.theme || 'dark'
                });
            } catch (error) {
                console.error('Erreur lors du chargement du profil:', error);
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if(!userProfile) return;
        setSoundEnabled(userProfile.ambientSoundsEnabled);
        setThemeEnabled(userProfile.ambientThemeEnabled);

        if(userProfile.theme) {
            document.documentElement.setAttribute('data-theme', userProfile.theme);
        }
    }, [userProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUserProfile(updatedUser);
                setUser(updatedUser);
                setIsEditing(false);

                document.documentElement.setAttribute('data-theme', formData.theme);
                toast.success('Profil et thème mis à jour avec succès !');
            } else {
                throw new Error('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            toast.error('Erreur lors de la mise à jour');
        }
        setIsSaving(false);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'theme') {
            document.documentElement.setAttribute('data-theme', value);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleSound = async () => {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ambientSoundsEnabled: !soundEnabled}),
            });

            const data = await response.json();
            if (response.ok) {
                setUserProfile(data);
                setUser(data);
                setSoundEnabled(!soundEnabled);
                toast.success(`Effets sonores ${!soundEnabled ? 'activés' : 'désactivés'}`);
            } else {
                throw new Error('Erreur lors de la mise à jour des sons');
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour des sons");
            console.error('Erreur lors de la mise à jour des sons:', error);
        }
    }

    const toggleTheme = async () => {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ambientThemeEnabled: !themeEnabled}),
            });

            const data = await response.json();
            if (response.ok) {
                setUserProfile(data);
                setUser(data);
                setThemeEnabled(!themeEnabled);
                toast.success(`Thème ambiant ${!themeEnabled ? 'activé' : 'désactivé'}`);
            } else {
                throw new Error('Erreur lors de la mise à jour du thème');
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du thème");
            console.error('Erreur lors de la mise à jour des sons:', error);
        }
    }

    if (isLoading && !userProfile) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="card bg-white dark:bg-slate-800 shadow-xl">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                        <h3 className="card-title text-2xl dark:text-white w-full text-center">
                            {isEditing ? 'Modifier le profil' : 'Informations personnelles'}
                        </h3>
                        <button
                            className={`btn ${isEditing ? 'btn-ghost' : 'btn-primary'} w-full md:w-auto`}
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isSaving}
                        >
                            {isEditing ? '✕ Annuler' : '✏️ Modifier'}
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="avatar">
                                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-2">
                                        <Image
                                            src={formData?.avatar || '/default-avatar.png'}
                                            alt="Avatar"
                                            width={96}
                                            height={96}
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="form-control w-full max-w-xs">
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered file-input-primary w-full"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Nom complet</span>
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
                                        <span className="label-text font-semibold">Pseudo</span>
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
                                    <span className="label-text font-semibold">Email</span>
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
                                    <span className="label-text font-semibold">Bio</span>
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Décrivez-vous en quelques mots..."
                                    maxLength={200}
                                />
                                <label className="label">
                                    <span className="label-text-alt">{formData.bio.length}/200 caractères</span>
                                </label>
                            </div>

                            <div className="card-actions justify-end mt-8">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            Sauvegarde...
                                        </>
                                    ) : (
                                        '💾 Sauvegarder les modifications'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label label-text font-semibold text-lg">Nom complet</label>
                                    <p className="text-gray-700 dark:text-gray-300 text-base">{userProfile?.name}</p>
                                </div>
                                <div>
                                    <label className="label label-text font-semibold text-lg">Pseudo</label>
                                    <p className="text-gray-700 dark:text-gray-300 text-base">@{userProfile?.nickname}</p>
                                </div>
                            </div>

                            <div>
                                <label className="label label-text font-semibold text-lg">Email</label>
                                <p className="text-gray-700 dark:text-gray-300 text-base">{userProfile?.email}</p>
                            </div>

                            <div>
                                <label className="label label-text font-semibold text-lg">Bio</label>
                                <p className="text-gray-700 dark:text-gray-300 text-base">
                                    {userProfile?.bio || 'Aucune bio renseignée.'}
                                </p>
                            </div>

                            <div>
                                <label className="label label-text font-semibold text-lg">Membre depuis</label>
                                <p className="text-gray-700 dark:text-gray-300 text-base">
                                    {userProfile ? formatDate(userProfile.createdAt) : '...'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="card bg-white dark:bg-slate-800 shadow-xl">
                <div className="card-body">
                    <h3 className="card-title text-2xl dark:text-white mb-6">Configuration du thème</h3>

                    <div className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-lg">Choisir un thème</span>
                            </label>
                            <select
                                name="theme"
                                value={formData.theme}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                {availableThemes.map((theme) => (
                                    <option key={theme} value={theme}>
                                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <label className="label">
                                <span className="label-text-alt">Le thème sera appliqué immédiatement</span>
                            </label>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                            <button
                                className={`btn ${soundEnabled ? 'btn-success' : 'btn-outline'} flex-1`}
                                onClick={toggleSound}
                                type="button"
                            >
                                {soundEnabled ? '🔊 Sons activés' : '🔇 Sons désactivés'}
                            </button>
                            <button
                                className={`btn ${themeEnabled ? 'btn-success' : 'btn-outline'} flex-1`}
                                onClick={toggleTheme}
                                type="button"
                            >
                                {themeEnabled ? '🌅 Thème activé' : '🌃 Thème désactivé'}
                            </button>
                        </div>

                        {isEditing && (
                            <div className="card-actions justify-end pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="btn btn-primary"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            Sauvegarde...
                                        </>
                                    ) : (
                                        '💾 Sauvegarder le thème'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;