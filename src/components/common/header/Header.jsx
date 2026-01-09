'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useAuth} from "@/app/AuthProvider";
import {toast} from 'react-toastify';
import {
    ChevronDown,
    Hash,
    Joystick,
    LogIn,
    LogOut,
    Menu,
    NotebookText,
    PlusCircle,
    Search,
    Settings,
    Trophy,
    UserRound,
    Users,
    X
} from "lucide-react";
import Image from "next/image";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showInfosMenu, setShowInfosMenu] = useState(false);

    const auth = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setIsClient(true);
        const gameParam = searchParams.get('gameId');
        if (gameParam) {
            setRoomId(gameParam);
            setShowJoinModal(true);
        }
    }, []);

    useEffect(() => {
        const gameParam = searchParams.get('gameId');
        if (gameParam) {
            setRoomId(gameParam);
        }
    }, [showJoinModal]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.user-menu')) {
                setShowUserMenu(false);
            }
            if (showInfosMenu && !event.target.closest('.infos-menu')) {
                setShowInfosMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showUserMenu, showInfosMenu]);

    if (pathname?.startsWith('/admin')) return null;

    const handleJoinById = async () => {
        if (!auth.user) {
            toast.error("Vous devez être connecté pour rejoindre une partie.");
            router.push('/auth');
            return;
        }
        if (!roomId.trim()) {
            setError("Veuillez entrer un ID de salle.");
            return;
        }
        setError(null);
        try {
            const res = await fetch(`/api/game/${roomId.trim()}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            if (res.ok) {
                setShowJoinModal(false);
                setRoomId('');
                router.push(`/game/${roomId.trim()}`);
            } else {
                setError("Aucune partie trouvée avec cet ID.");
            }
        } catch {
            setError("Erreur lors de la vérification de la salle.");
        }
    };

    const handleJoinRandom = async () => {
        if (!auth.user) {
            toast.error("Vous devez être connecté pour rejoindre une partie.");
            router.push('/auth');
            return;
        }
        setError(null);
        try {
            const res = await fetch('/api/game/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            const data = await res.json();
            const game = data.games?.find(g => g.state === 'En attente');
            if (game) {
                setShowJoinModal(false);
                router.push(`/game/${game.id}`);
            } else {
                setError("Aucune partie disponible pour rejoindre.");
            }
        } catch {
            setError("Erreur lors de la recherche de partie.");
        }
    };

    const createGame = () => {
        if (!auth.user) {
            toast.error("Vous devez être connecté pour créer une partie.");
            router.push('/auth');
            return;
        }
        router.push('/game/create');
    }

    const handleLogout = () => {
        auth.logout();
        setShowUserMenu(false);
        router.push('/');
    };

    const renderProfileButton = () => {
        if (!isClient) {
            return <UserRound className="w-5 h-5" suppressHydrationWarning/>;
        }

        if (auth.user) {
            return (
                <div className="flex items-center gap-2 user-menu">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 transition-colors"
                        aria-label="Ouvrir le menu utilisateur"
                    >
                            <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                              {auth.user.nickname}
                            </span>
                        <div className="relative">
                            <Image
                                src={auth.user.avatar || '/default-avatar.png'}
                                alt={`${auth.user.name} — avatar`}
                                width={36}
                                height={36}
                                className="rounded-full border-2 border-transparent hover:border-blue-500 transition-colors"
                            />
                            <div
                                className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                        </div>
                    </button>

                    {showUserMenu && (
                        <div
                            className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                <p className="font-semibold text-gray-900 dark:text-white">{auth.user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{auth.user.email}</p>
                            </div>
                            <Link
                                href="/auth/profile"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <UserRound className="w-4 h-4"/>
                                Mon profil
                            </Link>
                            <Link
                                href="/auth/profile/settings"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <Settings className="w-4 h-4"/>
                                Paramètres
                            </Link>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                            >
                                <LogOut className="w-4 h-4"/>
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button
                onClick={() => router.push('/auth')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                aria-label="Se connecter"
            >
                <LogIn className="w-4 h-4"/>
                <span className="hidden md:inline">Connexion</span>
            </button>
        );
    };

    const isActive = (path) => {
        return pathname === path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300';
    };

    return (
        <>
            <header
                className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <span className="text-2xl">🐺</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Loup-Garou</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-1">
                            <Link
                                href="/game/create"
                                onClick={createGame}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/game/create')}`}
                            >
                                <PlusCircle className="w-4 h-4"/>
                                <span>Créer</span>
                            </Link>
                            <Link
                                href="/game/list"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/game/list')}`}
                            >
                                <Joystick className="w-4 h-4"/>
                                <span>Parties</span>
                            </Link>
                            <button
                                onClick={() => setShowJoinModal(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                                <Search className="w-4 h-4"/>
                                <span>Rejoindre</span>
                            </button>
                            <Link
                                href="/leaderboard"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/leaderboard')}`}
                            >
                                <Trophy className="w-4 h-4"/>
                                <span>Classement</span>
                            </Link>
                            <div className="relative infos-menu">
                                <button
                                    onClick={() => setShowInfosMenu(!showInfosMenu)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <NotebookText className="w-4 h-4"/>
                                    <span>Infos</span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${showInfosMenu ? 'rotate-180' : ''}`}/>
                                </button>
                                {showInfosMenu && (
                                    <div
                                        className="absolute left-0 top-12 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                        <Link
                                            href="/rules"
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setShowInfosMenu(false)}
                                        >
                                            <NotebookText className="w-4 h-4"/>
                                            Règles
                                        </Link>
                                        <Link
                                            href="/patch-notes"
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setShowInfosMenu(false)}
                                        >
                                            <NotebookText className="w-4 h-4"/>
                                            Patch-notes
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>

                        <div className="flex items-center gap-3">
                            <button
                                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            >
                                {isMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                            </button>

                            {renderProfileButton()}
                        </div>
                    </div>

                    {isMenuOpen && (
                        <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        createGame();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                                >
                                    <PlusCircle className="w-5 h-5"/>
                                    <span className="font-medium">Créer une partie</span>
                                </button>
                                <Link
                                    href="/game/list"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <Joystick className="w-5 h-5"/>
                                    <span className="font-medium">Parties disponibles</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowJoinModal(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                                >
                                    <Search className="w-5 h-5"/>
                                    <span className="font-medium">Rejoindre une partie</span>
                                </button>
                                <Link
                                    href="/leaderboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <Trophy className="w-5 h-5"/>
                                    <span className="font-medium">Classement</span>
                                </Link>
                                <div className="px-4 py-3">
                                    <button
                                        onClick={() => setShowInfosMenu(!showInfosMenu)}
                                        className="flex items-center gap-3 w-full text-left font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <NotebookText className="w-5 h-5"/>
                                        <span>Infos</span>
                                        <ChevronDown
                                            className={`w-4 h-4 ml-auto transition-transform ${showInfosMenu ? 'rotate-180' : ''}`}/>
                                    </button>
                                    {showInfosMenu && (
                                        <div className="flex flex-col gap-2 mt-2 ml-8">
                                            <Link
                                                href="/rules"
                                                onClick={() => {
                                                    setShowInfosMenu(false);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                                            >
                                                <NotebookText className="w-4 h-4"/>
                                                Règles
                                            </Link>
                                            <Link
                                                href="/patch-notes"
                                                onClick={() => {
                                                    setShowInfosMenu(false);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                                            >
                                                <NotebookText className="w-4 h-4"/>
                                                Patch-notes
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {showJoinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-md mx-4 relative border border-gray-200 dark:border-gray-700">
                        <button
                            className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => {
                                setShowJoinModal(false);
                                setError(null);
                                setRoomId('');
                            }}
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Rejoindre une
                                partie</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Entrez un code de partie ou rejoignez une partie aléatoire
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Code de la partie
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Hash
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                        <input
                                            type="text"
                                            className="pl-10 pr-4 py-3 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                            value={roomId}
                                            onChange={e => setRoomId(e.target.value)}
                                            placeholder="ex: ABC123"
                                            onKeyDown={(e) => e.key === 'Enter' && handleJoinById()}
                                        />
                                    </div>
                                    <button
                                        className="btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6"
                                        onClick={handleJoinById}
                                    >
                                        Rejoindre
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span
                                        className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">ou</span>
                                </div>
                            </div>

                            <button
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                                onClick={handleJoinRandom}
                            >
                                <Users className="w-4 h-4"/>
                                Rejoindre une partie aléatoire
                            </button>

                            {error && (
                                <div
                                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Besoin d'aide ? <Link href="/faq"
                                                          className="text-blue-600 dark:text-blue-400 hover:underline">Consultez
                                    la FAQ</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}