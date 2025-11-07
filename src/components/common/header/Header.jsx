'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useAuth} from "@/app/AuthProvider";
import {toast} from 'react-toastify';
import {Gamepad2, House, Joystick, NotebookText, Search, UserRound} from "lucide-react";
import Image from "next/image";
import {usePathname} from "next/navigation";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState(null);
    const [isClient, setIsClient] = useState(false);

    const auth = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();


    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const gameParam = searchParams.get('game');
        if (gameParam) {
            setRoomId(gameParam);
        }
    }, [searchParams]);

    if (pathname?.startsWith('/admin')) return null;

    const handleJoinById = async () => {
        if (!auth.user) {
            toast.error("Vous devez être connecté pour rejoindre une partie.");
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
            return;
        }
        setError(null);
        try {
            const res = await fetch('/api/game/list');
            const data = await res.json();
            const game = data.games.find(g => g.state === 'En attente');
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
            return;
        }
        router.push('/game/create');
    }

    const redirectLogin = () => {
        if (auth.user) {
            router.push('/auth/profile');
        } else {
            router.push('/auth');
        }
    }

    const renderProfileButton = () => {
        if (!isClient) {
            return <UserRound className="w-6 h-6" suppressHydrationWarning/>;
        }

        return auth.user ? (
            <div className="flex items-center space-x-2 gap-2">
                <Image
                    src={auth.user.avatar || '/default-avatar.png'}
                    alt={auth.user.name ? `${auth.user.name} — avatar` : 'Avatar utilisateur'}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
            </div>
        ) : (
            <UserRound className="w-6 h-6"/>
        );
    };

    return (
        <>
            <header className="bg-base-200 shadow-lg">
                <div className="navbar container mx-auto">
                    <div className="navbar-start">
                        <Link href="/" className="btn btn-ghost normal-case text-xl gap-2 text-base-content">
                            <span className="text-2xl">🐺</span>
                            Loup-Garou
                        </Link>
                    </div>

                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 space-x-2">
                            <li>
                                <Link href="/" className="btn btn-ghost text-base-content">
                                    <House className="inline w-5 h-5 mr-1"/>
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link href="/rules" className="btn btn-ghost text-base-content">
                                    <NotebookText className="inline w-5 h-5 mr-1"/>
                                    Règles
                                </Link>
                            </li>
                            <li>
                                <Link href="/game/list" className="btn btn-ghost text-base-content">
                                    <Joystick className="inline w-5 h-5 mr-1"/>
                                    Parties
                                </Link>
                            </li>
                            <li>
                                <button onClick={createGame} className="btn btn-ghost text-base-content"
                                        name="create-game-button">
                                    <Gamepad2 className="inline w-5 h-5 mr-1"/>
                                    Créer une partie
                                </button>
                            </li>
                            <li>
                                <button
                                    className="btn btn-ghost text-base-content"
                                    onClick={() => setShowJoinModal(true)}
                                    name="join-game-button"
                                >
                                    <Search className="inline w-5 h-5 mr-1"/>
                                    Rejoindre
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="navbar-end">
                        <div className="dropdown dropdown-end lg:hidden">
                            <button
                                id="mobile-menu-button"
                                className="btn btn-ghost btn-circle"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-menu"
                                title={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            >
                                <svg
                                    className="w-5 h-5 text-base-content"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    focusable="false"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </button>

                            {isMenuOpen && (
                                <ul
                                    id="mobile-menu"
                                    role="menu"
                                    aria-labelledby="mobile-menu-button"
                                    aria-hidden={!isMenuOpen}
                                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                                >
                                    <li>
                                        <Link href="/" onClick={() => setIsMenuOpen(false)}
                                              className="text-base-content">
                                            <House className="inline w-5 h-5 mr-1"/>
                                            Accueil
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/rules" onClick={() => setIsMenuOpen(false)}
                                              className="text-base-content">
                                            <NotebookText className="inline w-5 h-5 mr-1"/>
                                            Règles
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/game/list" onClick={() => setIsMenuOpen(false)}
                                              className="text-base-content">
                                            <Joystick className="inline w-5 h-5 mr-1"/>
                                            Parties
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/game/create" onClick={() => setIsMenuOpen(false)}
                                              className="text-base-content">
                                            <Gamepad2 className="inline w-5 h-5 mr-1"/>
                                            Créer une partie
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            className="text-base-content w-full text-left"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setShowJoinModal(true);
                                            }}
                                            name="join-game-button-mobile"
                                        >
                                            <Search className="inline w-5 h-5 mr-1"/>
                                            Rejoindre
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>

                        <button
                            onClick={redirectLogin}
                            aria-label={auth?.user ? 'Ouvrir le profil' : 'Se connecter'}
                            className="flex items-center justify-center text-base-content hover:bg-base-200 hover:scale-105 transition-all hover:cursor-pointer"
                            name="profile-button"
                            suppressHydrationWarning
                        >
                            <span className="text-sm">
                                {renderProfileButton()}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {showJoinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-base-100 rounded-xl p-8 shadow-lg w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
                            onClick={() => {
                                setShowJoinModal(false);
                                setError(null);
                                setRoomId('');
                            }}
                            name="close-join-modal-button"
                        >✕
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-base-content">Rejoindre une partie</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 text-base-content">Entrer l'ID de la salle</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={roomId}
                                        onChange={e => setRoomId(e.target.value)}
                                        placeholder="ID de la salle"
                                    />
                                    <button className="btn btn-primary" onClick={handleJoinById}>
                                        Rejoindre
                                    </button>
                                </div>
                            </div>
                            <div className="divider">ou</div>
                            <button
                                className="btn btn-secondary w-full"
                                onClick={handleJoinRandom}
                                name="join-random-game-button"
                            >
                                Rejoindre une salle aléatoire
                            </button>
                            {error && <div className="text-error text-sm mt-2">{error}</div>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}