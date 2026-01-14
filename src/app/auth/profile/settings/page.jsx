'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {formatDate} from "@/utils/Date";
import {toast} from "react-toastify";
import {useAuth} from "@/app/AuthProvider";
import {
    Camera,
    Check,
    Edit2,
    Globe,
    Lock,
    Moon,
    Music,
    Palette,
    Save,
    Sun,
    Trash2,
    User,
    Volume2,
    X
} from 'lucide-react';

const SettingsPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [themeEnabled, setThemeEnabled] = useState(true);
    const [streamerModeEnabled, setStreamerModeEnabled] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const {theme, setTheme, token, setUser} = useAuth();

    const availableThemes = [
        {value: 'light', label: 'Clair', icon: Sun},
        {value: 'dark', label: 'Sombre', icon: Moon},
        {value: 'auto', label: 'Automatique', icon: Globe}
    ];

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        email: '',
        bio: '',
        avatar: '',
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

                if (!res.ok) {
                    throw new Error(data.error || 'Erreur lors du chargement du profil');
                }

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
                setNotifications(data.notificationsEnabled || true);
            } catch (error) {
                console.error('Erreur lors du chargement du profil:', error);
                toast.error(error.message || 'Erreur lors du chargement du profil');
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (!userProfile) return;
        setSoundEnabled(userProfile.ambientSoundsEnabled);
        setThemeEnabled(userProfile.ambientThemeEnabled);

        if (userProfile.theme) {
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

            const data = await res.json();
            if (res.ok) {
                setUserProfile(data);
                setUser(data);
                setIsEditing(false);

                toast.success('Profil mis à jour avec succès !');
            } else {
                throw new Error(data.error || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            toast.error(error.message || 'Erreur lors de la mise à jour');
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
            if (file.size > 5 * 1024 * 1024) {
                toast.error('L\'image ne doit pas dépasser 5MB');
                return;
            }
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
                throw new Error(data.error || 'Erreur lors de la mise à jour des sons');
            }
        } catch (error) {
            toast.error(error.message || "Erreur lors de la mise à jour des sons");
            console.error('Erreur lors de la mise à jour des sons:', error);
        }
    };

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
                throw new Error(data.error || 'Erreur lors de la mise à jour du thème');
            }
        } catch (error) {
            toast.error(error.message || "Erreur lors de la mise à jour du thème");
            console.error('Erreur lors de la mise à jour des sons:', error);
        }
    };

    const toggleStreamerMode = async () => {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({streamerModeEnabled: !streamerModeEnabled}),
            });

            const data = await response.json();
            if (response.ok) {
                setUserProfile(data);
                setUser(data);
                setStreamerModeEnabled(!streamerModeEnabled);
                toast.success(`Mode streamer ${!streamerModeEnabled ? 'activé' : 'désactivé'}`);
            } else {
                throw new Error(data.error || 'Erreur lors de la mise à jour du mode streamer');
            }
        } catch (error) {
            toast.error(error.message || "Erreur lors de la mise à jour du mode streamer");
            console.error('Erreur lors de la mise à jour du mode streamer:', error);
        }
    }

    const toggleNotifications = async () => {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({notificationsEnabled: !notifications}),
            });

            const data = await response.json();
            if (response.ok) {
                setUserProfile(data);
                setUser(data);
                setNotifications(!notifications);
                toast.success(`Notifications ${!notifications ? 'activées' : 'désactivées'}`);
            } else {
                throw new Error(data.error || 'Erreur lors de la mise à jour des notifications');
            }
        } catch (error) {
            toast.error(error.message || "Erreur lors de la mise à jour des notifications");
        }
    };

    if (isLoading && !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        <div
                            className="w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des paramètres...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div
                        className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                        <User className="w-10 h-10 text-white"/>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Paramètres du compte
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Gérez vos préférences et vos informations personnelles
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-center mb-6">
                                    <div className="relative inline-block">
                                        <div
                                            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                                            {formData?.avatar ? (
                                                <Image
                                                    src={formData.avatar}
                                                    alt="Avatar"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-12 h-12 text-gray-400 dark:text-gray-500"/>
                                                </div>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <label
                                                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110">
                                                <Camera className="w-4 h-4 text-white"/>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                                        {userProfile?.name}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">@{userProfile?.nickname}</p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                                            isEditing
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {isEditing ? (
                                            <>
                                                <X className="w-5 h-5"/>
                                                Annuler
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 className="w-5 h-5"/>
                                                Modifier le profil
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Palette className="w-5 h-5"/>
                                    Préférences
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 dark:text-gray-300">Effets sonores</span>
                                        <button
                                            onClick={toggleSound}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                soundEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 dark:text-gray-300">Thème ambiant</span>
                                        <button
                                            onClick={toggleTheme}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                themeEnabled ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    themeEnabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 dark:text-gray-300">Notifications</span>
                                        <button
                                            onClick={toggleNotifications}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                notifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    notifications ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 dark:text-gray-300">Mode streamer</span>
                                        <button
                                            onClick={toggleStreamerMode}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                streamerModeEnabled ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    streamerModeEnabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        <div
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <User className="w-5 h-5"/>
                                    Informations du profil
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    {isEditing ? 'Modifiez vos informations personnelles' : 'Vos informations personnelles'}
                                </p>
                            </div>

                            <div className="p-6">
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Nom complet
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    placeholder="Votre nom"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Pseudo
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nickname"
                                                    value={formData.nickname}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    placeholder="@pseudo"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                placeholder="votre@email.com"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Bio
                                            </label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                                                placeholder="Parlez-nous un peu de vous..."
                                                maxLength={200}
                                            />
                                            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                                                {formData.bio.length}/200 caractères
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div
                                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        Sauvegarde...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5"/>
                                                        Sauvegarder les modifications
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Nom complet
                                                </div>
                                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {userProfile?.name}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Pseudo</div>
                                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                                    @{userProfile?.nickname}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                                            <div className="text-lg font-medium text-gray-900 dark:text-white">
                                                {userProfile?.email}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Bio</div>
                                            <div className="text-lg text-gray-700 dark:text-gray-300">
                                                {userProfile?.bio || 'Aucune bio renseignée.'}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Membre depuis
                                            </div>
                                            <div className="text-lg text-gray-700 dark:text-gray-300">
                                                {userProfile ? formatDate(userProfile.createdAt) : '...'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Palette className="w-5 h-5"/>
                                    Apparence
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    Personnalisez l'apparence de l'application
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-gray-900 dark:text-white">Sélection du
                                            thème</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {availableThemes.map(({value, label, icon: Icon}) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setTheme(value)}
                                                    className={`p-4 rounded-xl border-2 transition-all ${
                                                        theme === value
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${
                                                            theme === value
                                                                ? 'bg-blue-100 dark:bg-blue-800'
                                                                : 'bg-gray-100 dark:bg-gray-700'
                                                        }`}>
                                                            <Icon className={`w-5 h-5 ${
                                                                theme === value
                                                                    ? 'text-blue-600 dark:text-blue-400'
                                                                    : 'text-gray-600 dark:text-gray-400'
                                                            }`}/>
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {label}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {value === 'auto' ? 'Détecter automatiquement' : ''}
                                                            </div>
                                                        </div>
                                                        {theme === value && (
                                                            <Check
                                                                className="ml-auto w-5 h-5 text-blue-600 dark:text-blue-400"/>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div
                                                className="flex-1 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                                        <Volume2
                                                            className="w-5 h-5 text-green-600 dark:text-green-400"/>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            Effets sonores
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {soundEnabled ? 'Activés' : 'Désactivés'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="flex-1 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                        <Music
                                                            className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            Thème ambiant
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {themeEnabled ? 'Activé' : 'Désactivé'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Lock className="w-5 h-5"/>
                                    Sécurité
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    Gestion de votre compte et données
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                <button
                                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400"/>
                                        </div>
                                        <div className="text-left">
                                            <div
                                                className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                                                Supprimer le compte
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Cette action est irréversible
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                <div className="pt-4 text-center">
                                    <div
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-full border border-gray-200 dark:border-gray-700">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Dernière connexion : {userProfile ? formatDate(userProfile.lastLogin) : '...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;