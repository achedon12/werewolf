'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useAuth} from "@/app/AuthProvider";
import {toast} from 'react-toastify';
import {ChevronDown, Joystick, Menu, NotebookText, PlusCircle, Search, Trophy, Users, X} from "lucide-react";
import GameJoinModal from "@/components/modal/gameJoinModal/GameJoinModal.jsx";
import ProfileButton from "@/components/common/header/items/ProfileButton.jsx";
import FriendsModal from "@/components/modal/friends/FriendsModal.jsx";
import FriendsButton from "@/components/common/header/items/FriendsButton.jsx";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showInfosMenu, setShowInfosMenu] = useState(false);
    const [showFriendsModal, setShowFriendsModal] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([
        {id: 1, name: "Charlie", username: "@charlie_w", avatar: "🐱", status: "En jeu", gameId: "123"},
        {id: 2, name: "Diana", username: "@diana_g", avatar: "🦉", status: "En ligne"},
    ]);

    const auth = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && auth.user) {
            fetchFriendRequests();
        }
    }, [isHydrated, auth.user]);

    if (pathname?.startsWith('/admin')) return null;

    const createGame = () => {
        if (!auth.user) {
            toast.error("Vous devez être connecté pour créer une partie.");
            router.push('/auth');
            return;
        }
        router.push('/game/create');
    }

    const isActive = (path) => {
        return pathname === path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300';
    };

    const fetchFriendRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/friends/request', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Erreur lors de la récupération des demandes d\'ami');
                return;
            }

            const data = await response.json();
            setFriendRequests(data.friendRequests || []);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`/api/friends/request/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                toast.error("Erreur lors de l'acceptation de la demande");
                return;
            }

            toast.success("Demande d'ami acceptée !");
            setFriendRequests(friendRequests.filter(req => req.id !== requestId));
            fetchFriendRequests();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur serveur");
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`/api/friends/request/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                toast.error("Erreur lors du refus de la demande");
                return;
            }

            toast.info("Demande d'ami déclinée");
            setFriendRequests(friendRequests.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur serveur");
        }
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
                                className={`text-gray-700 dark:text-gray-300  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/game/create')}`}
                            >
                                <PlusCircle className="w-4 h-4 text-gray-700 dark:text-gray-300 "/>
                                <span className="text-gray-700 dark:text-gray-300 ">Créer</span>
                            </Link>
                            <Link
                                href="/game/list"
                                className={`text-gray-700 dark:text-gray-300  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/game/list')}`}
                            >
                                <Joystick className="w-4 h-4"/>
                                <span className="text-gray-700 dark:text-gray-300 ">Parties</span>
                            </Link>
                            <button
                                onClick={() => setShowJoinModal(true)}
                                className="text-gray-700 dark:text-gray-300  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <Search className="text-gray-700 dark:text-gray-300  w-4 h-4"/>
                                <span className="text-gray-700 dark:text-gray-300 ">Rejoindre</span>
                            </button>
                            <Link
                                href="/leaderboard"
                                className={`text-gray-700 dark:text-gray-300  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/leaderboard')}`}
                            >
                                <Trophy className="text-gray-700 dark:text-gray-300  w-4 h-4"/>
                                <span className="text-gray-700 dark:text-gray-300 ">Classement</span>
                            </Link>
                            <div className="relative infos-menu">
                                <button
                                    onClick={() => setShowInfosMenu(!showInfosMenu)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <NotebookText className="w-4 h-4 text-gray-700 dark:text-gray-300 "/>
                                    <span className="text-gray-700 dark:text-gray-300 ">Infos</span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-700 dark:text-gray-300  transition-transform ${showInfosMenu ? 'rotate-180' : ''}`}/>
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
                            <FriendsButton
                                friendRequests={friendRequests}
                                onlineFriends={onlineFriends}
                                setShowFriendsModal={setShowFriendsModal}
                                handleAcceptRequest={handleAcceptRequest}
                                handleDeclineRequest={handleDeclineRequest}
                                isHydrated={isHydrated}
                            />

                            <button
                                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            >
                                {isMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                            </button>

                            <ProfileButton/>
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

                                {isHydrated && auth.user && (
                                    <>
                                        <button
                                            onClick={() => setShowFriendsModal(true)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                                        >
                                            <Users className="w-5 h-5"/>
                                            <div className="flex items-center justify-between flex-1">
                                                <span className="font-medium">Amis</span>
                                                {friendRequests.length > 0 && (
                                                    <span
                                                        className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                                        {friendRequests.length}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </>
                                )}

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

            <GameJoinModal setShow={setShowJoinModal} show={showJoinModal}/>
            <FriendsModal
                show={showFriendsModal}
                setShow={setShowFriendsModal}
                friendRequests={friendRequests}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
            />
        </>
    );
}