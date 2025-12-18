"use client";
import {useEffect, useState, useRef, useMemo} from "react";
import {classicRoles, roles} from "@/utils/Roles";
import Image from "next/image";
import {useAuth} from "@/app/AuthProvider";
import {useRouter} from "next/navigation";
import {ChartColumn, Cog, Gamepad2, MinusCircle, PlusCircle, Puzzle, Sparkles, Users, Shield, Moon, Sun} from "lucide-react";
import { GAME_STATES } from "@/server/config/constants";
import {socket} from "@/socket";

const CreateGamePage = () => {
    const defaultSelectedRoles = roles.reduce((acc, role) => {
        acc[role.id] = 0;
        return acc;
    }, {});

    const [gameName, setGameName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(8);
    const [selectedRoles, setSelectedRoles] = useState(defaultSelectedRoles);
    const [gameMode, setGameMode] = useState("classic");
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const {token, setGame, setPlayer} = useAuth();
    const [hasActiveGame, setHasActiveGame] = useState(false);
    const [checkingActiveGame, setCheckingActiveGame] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setCheckingActiveGame(true);
        if (!socket) {
            setLoading(false);
            return;
        }
        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));


        const handleConnect = () => {
            socket.emit('get-available-games');
        };

        const handleAvailableGames = (gamesData) => {
            let activeGameFound = false;
            for (const game of gamesData) {
                const player = Object.values(game.players).find(p => p.id === userFromLocalStorage.id);

                if (player && game.state !== GAME_STATES.FINISHED) {
                    activeGameFound = true;
                    break;
                }
            }
            setHasActiveGame(activeGameFound);
            setCheckingActiveGame(false);
        };

        socket.on('available-games', handleAvailableGames);
    
        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off('available-games', handleAvailableGames);
        };
    }, []);

    useEffect(() => {
        if (gameMode === "custom") {
            setSelectedRoles({...defaultSelectedRoles});
        } else {
            setSelectedRoles(classicRoles[maxPlayers] || defaultSelectedRoles);
        }
    }, [gameMode]);

    useEffect(() => {
        if (gameMode === "classic") {
            setSelectedRoles(classicRoles[maxPlayers] || defaultSelectedRoles);
        }
    }, [maxPlayers]);

    const gameModes = [
        {
            id: "classic",
            name: "Classique",
            description: "Les règles traditionnelles du Loup-Garou",
            icon: <Shield className="w-5 h-5" />
        },
        {
            id: "custom",
            name: "Personnalisé",
            description: "Configurez vos propres règles",
            icon: <Puzzle className="w-5 h-5" />
        },
    ];

    const updateRoleCount = (roleId, increment) => {
        setSelectedRoles(prev => {
            const current = prev[roleId] ?? 0;
            const role = roles.find(r => r.id === roleId);
            if (!role) return prev;

            const newCount = increment ? current + 1 : current - 1;
            if (newCount < 0) return prev;

            const prevTotal = Object.values(prev).reduce((sum, c) => sum + c, 0);
            if (prevTotal + (increment ? 1 : -1) > maxPlayers) return prev;

            return {...prev, [roleId]: newCount};
        });
    };

    const totalPlayers = Object.values(selectedRoles).reduce((sum, count) => sum + count, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (hasActiveGame || checkingActiveGame) return;

        setIsCreating(true);
        setError(null);

        try {
            const response = await fetch('/api/game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: gameName,
                    configuration: selectedRoles,
                    type: gameMode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la création de la partie');
            }
            setGame(data.gameId);
            setPlayer(data.playerId);
            window.location = `/game/${data.gameId}`;

        } catch (err) {
            setError(err.message);
        } finally {
            setIsCreating(false);
        }
    }

    const isDisabled = isCreating || hasActiveGame || checkingActiveGame;
    const buttonLabel = hasActiveGame
        ? "Vous êtes déjà dans une partie"
        : checkingActiveGame
            ? "Vérification…"
            : isCreating
                ? "Création..."
                : "Créer la partie";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 ring-4 ring-purple-200 dark:ring-purple-900/30">
                        <span className="text-3xl">🐺</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                        Créer une Partie
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                        Configurez votre partie de Loup-Garou et invitez vos amis
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Cog className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="card-title text-2xl text-gray-900 dark:text-white">
                                    Configuration de base
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-700 dark:text-gray-300 font-medium">
                                            Nom de la partie
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={gameName}
                                        onChange={(e) => setGameName(e.target.value)}
                                        placeholder="Ma super partie de Loup-Garou"
                                        className="input input-lg w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text text-gray-700 dark:text-gray-300 font-medium">
                                            Joueurs maximum: <span className="text-blue-600 dark:text-blue-400 font-bold">{maxPlayers}</span>
                                        </span>
                                    </label>
                                    <input
                                        type="range"
                                        min="8"
                                        max="18"
                                        value={maxPlayers}
                                        onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                                        className="range range-primary w-full bg-gray-200 dark:bg-gray-700"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2 w-full">
                                        {[8, 10, 12, 14, 16, 18].map((num) => (
                                            <span key={num}>{num}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-control mt-6">
                                <label className="label">
                                    <span className="label-text text-gray-700 dark:text-gray-300 font-medium">Mode de jeu</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {gameModes.map((mode) => (
                                        <div
                                            key={mode.id}
                                            className={`card cursor-pointer transition-all duration-300 border-2 ${
                                                gameMode === mode.id
                                                    ? "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-500 dark:border-blue-400 shadow-lg"
                                                    : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                            }`}
                                            onClick={() => setGameMode(mode.id)}
                                        >
                                            <div className="card-body p-4 text-center">
                                                <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3 ${
                                                    gameMode === mode.id
                                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                                                }`}>
                                                    {mode.icon}
                                                </div>
                                                <h3 className={`card-title text-lg justify-center ${
                                                    gameMode === mode.id
                                                        ? "text-blue-700 dark:text-blue-300"
                                                        : "text-gray-800 dark:text-gray-200"
                                                }`}>
                                                    {mode.name}
                                                </h3>
                                                <p className={`text-sm ${
                                                    gameMode === mode.id
                                                        ? "text-blue-600 dark:text-blue-400"
                                                        : "text-gray-600 dark:text-gray-400"
                                                }`}>
                                                    {mode.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="card-body">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Puzzle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="card-title text-2xl text-gray-900 dark:text-white">
                                        Composition des rôles
                                    </h2>
                                </div>
                                <div className={`badge badge-lg flex items-center gap-2 px-4 py-3 font-bold ${
                                    totalPlayers === maxPlayers
                                        ? "badge-success bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                        : totalPlayers > maxPlayers
                                            ? "badge-error bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                            : "badge-primary bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                }`}>
                                    <Users className="w-4 h-4" />
                                    <span>{totalPlayers} / {maxPlayers}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex items-start sm:items-center w-full sm:w-auto min-w-0 gap-4">
                                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                                                <Image
                                                    src={role.image}
                                                    alt={role.name}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                                                    {role.name}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                    {role.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center mt-3 sm:mt-0 space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => updateRoleCount(role.id, false)}
                                                disabled={gameMode !== "custom" || selectedRoles[role.id] === 0}
                                                className={`btn btn-circle btn-sm w-10 h-10 flex items-center justify-center ${
                                                    gameMode !== "custom" || selectedRoles[role.id] === 0
                                                        ? "btn-disabled bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
                                                        : "btn-ghost bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50"
                                                }`}
                                            >
                                                <MinusCircle className="w-5 h-5" />
                                            </button>

                                            <span className="text-gray-900 dark:text-white font-bold text-xl w-8 text-center">
                                                {selectedRoles[role.id]}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => updateRoleCount(role.id, true)}
                                                disabled={gameMode !== "custom" || totalPlayers >= maxPlayers}
                                                className={`btn btn-circle btn-sm w-10 h-10 flex items-center justify-center ${
                                                    gameMode !== "custom" || totalPlayers >= maxPlayers
                                                        ? "btn-disabled bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
                                                        : "btn-ghost bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50"
                                                }`}
                                            >
                                                <PlusCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPlayers > maxPlayers && (
                                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                                        <span className="text-lg">⚠️</span>
                                        <span>Trop de joueurs sélectionnés ! Maximum: {maxPlayers}</span>
                                    </div>
                                </div>
                            )}

                            {totalPlayers < 8 && (
                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                                        <span className="text-lg">⚠️</span>
                                        <span>Minimum 8 joueurs requis pour une partie équilibrée</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <ChartColumn className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="card-title text-2xl text-gray-900 dark:text-white">
                                    Récapitulatif
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-800">
                                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Mode de jeu</div>
                                    <div className="text-blue-800 dark:text-blue-300 font-bold text-lg">
                                        {gameModes.find(m => m.id === gameMode)?.name}
                                    </div>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center border border-purple-200 dark:border-purple-800">
                                    <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">Joueurs</div>
                                    <div className="text-purple-800 dark:text-purple-300 font-bold text-lg">
                                        {totalPlayers}/{maxPlayers}
                                    </div>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center border border-red-200 dark:border-red-800">
                                    <div className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">Loups-Garous</div>
                                    <div className="text-red-800 dark:text-red-300 font-bold text-lg">
                                        {selectedRoles[1] + selectedRoles[8] || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="card-actions justify-center">
                                <button
                                    type="submit"
                                    disabled={isDisabled || totalPlayers > maxPlayers || totalPlayers < 8 || selectedRoles[1] + selectedRoles[8] === 0}
                                    className="btn btn-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 border-none text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg w-full max-w-md"
                                >
                                    <Gamepad2 className="w-5 h-5" />
                                    {buttonLabel}
                                    <Sparkles className="w-5 h-5" />
                                </button>

                                {hasActiveGame && (
                                    <p className="text-red-600 dark:text-red-400 text-sm mt-2 text-center">
                                        Quittez ou terminez votre partie actuelle avant d'en créer une nouvelle.
                                    </p>
                                )}
                            </div>

                            {isCreating && (
                                <div className="text-center mt-4">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                        Préparation de la partie... Cette opération peut prendre quelques secondes
                                    </p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                                        <span className="text-lg">❌</span>
                                        <span>{error}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGamePage;