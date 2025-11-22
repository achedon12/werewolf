"use client";
import {useEffect, useState} from "react";
import {classicRoles, roles} from "@/utils/Roles";
import Image from "next/image";
import {useAuth} from "@/app/AuthProvider";
import {useRouter} from "next/navigation";
import {ChartColumn, Cog, Gamepad2, MinusCircle, PlusCircle, Puzzle, Sparkles} from "lucide-react";

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
    const router = useRouter();

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
        {id: "classic", name: "Classique", description: "Les règles traditionnelles du Loup-Garou"},
        {id: "custom", name: "Personnalisé", description: "Configurez vos propres règles"},
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
        setIsCreating(true);

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
            console.log('Redirection vers', `/game/${data.gameId}`);
            window.location = `/game/${data.gameId}`;

        } catch (err) {

            setError(err.message);
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div
                        className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                        <span className="text-3xl">🐺</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Créer une Partie
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Configurez votre partie de Loup-Garou et invitez vos amis
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-white mb-6">
                                <Cog className="inline mr-2"/>
                                Configuration de base
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label">
                                                        <span
                                                            className="label-text text-gray-300 font-medium">Nom de la partie</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={gameName}
                                        onChange={(e) => setGameName(e.target.value)}
                                        placeholder="Ma super partie de Loup-Garou"
                                        className="input input-lg w-full bg-base-200/50 border-white/20 backdrop-blur-sm transition-all duration-300 focus:bg-base-200/80 focus:border-purple-400"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                                    <span className="label-text text-gray-300 font-medium">
                                                        Joueurs maximum: {maxPlayers}
                                                    </span>
                                    </label>
                                    <input
                                        type="range"
                                        min="8"
                                        max="18"
                                        value={maxPlayers}
                                        onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                                        className="range range-primary w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 px-2 w-full">
                                        <span>8</span>
                                        <span>10</span>
                                        <span>12</span>
                                        <span>14</span>
                                        <span>16</span>
                                        <span>18</span>
                                    </div>
                                </div>

                            </div>

                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text text-gray-300 font-medium">Mode de jeu</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {gameModes.map((mode) => (
                                        <div
                                            key={mode.id}
                                            className={`card cursor-pointer transition-all duration-300 ${
                                                gameMode === mode.id
                                                    ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500"
                                                    : "bg-base-200/50 border-white/10"
                                            } border-2`}
                                            onClick={() => setGameMode(mode.id)}
                                        >
                                            <div className="card-body p-4 text-center">
                                                <h3 className="card-title text-white text-lg justify-center">
                                                    {mode.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm">{mode.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="card-title text-2xl text-white">
                                    <Puzzle className="inline mr-2"/>
                                    Composition des rôles
                                </h2>
                                <div className="badge badge-primary flex items-center gap-2 px-2 md:px-4 py-1 md:py-2 min-w-0">
                                    <span className="hidden sm:inline text-sm md:text-base">Total:</span>
                                    <span className="hidden sm:inline text-sm md:text-base">{totalPlayers}</span>
                                    <span className="hidden sm:inline text-sm md:text-base">joueurs</span>
                                    <span className="inline sm:hidden text-sm">{totalPlayers}j</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-base-200/30 rounded-2xl backdrop-blur-sm border border-white/5"
                                    >
                                        <div className="flex items-start sm:items-center w-full sm:w-auto min-w-0 gap-4">
                                            <div className="flex-shrink-0 w-20 h-20 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center overflow-hidden">
                                                <Image
                                                    src={role.image}
                                                    alt={role.name}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-white text-sm sm:text-base truncate">{role.name}</h3>
                                                <p className="text-gray-400 text-xs sm:text-sm truncate max-w-[18rem] sm:max-w-none">
                                                    {role.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center mt-3 sm:mt-0 space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => updateRoleCount(role.id, false)}
                                                disabled={gameMode !== "custom"}
                                                className="btn btn-circle btn-sm btn-ghost text-gray-400 hover:text-white disabled:opacity-30"
                                                aria-label={`Retirer ${role.name}`}
                                            >
                                                <MinusCircle className="w-5 h-5"/>
                                            </button>

                                            <span className="text-white font-bold text-lg w-8 text-center">
                                              {selectedRoles[role.id]}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => updateRoleCount(role.id, true)}
                                                disabled={gameMode !== "custom" || totalPlayers >= maxPlayers}
                                                className="btn btn-circle btn-sm btn-ghost text-gray-400 hover:text-white disabled:opacity-30"
                                                aria-label={`Ajouter ${role.name}`}
                                            >
                                                <PlusCircle className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPlayers > maxPlayers && (
                                <div className="alert alert-error mt-4 bg-red-500/10 border-red-500/20">
                                    <span>⚠️ Trop de joueurs sélectionnés! Maximum: {maxPlayers}</span>
                                </div>
                            )}

                            {totalPlayers < 8 && (
                                <div className="alert alert-warning mt-4 bg-yellow-500/10 border-yellow-500/20">
                                    <span>⚠️ Minimum 8 joueurs requis pour une partie équilibrée</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-white mb-4">
                                <ChartColumn className="inline mr-2"/>
                                Récapitulatif
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="stat place-items-center bg-base-200/30 rounded-2xl p-4">
                                    <div className="stat-title text-gray-400">Mode de jeu</div>
                                    <div className="stat-value text-primary text-lg">
                                        {gameModes.find(m => m.id === gameMode)?.name}
                                    </div>
                                </div>

                                <div className="stat place-items-center bg-base-200/30 rounded-2xl p-4">
                                    <div className="stat-title text-gray-400">Joueurs</div>
                                    <div className="stat-value text-secondary text-lg">
                                        {totalPlayers}/{maxPlayers}
                                    </div>
                                </div>

                                <div className="stat place-items-center bg-base-200/30 rounded-2xl p-4">
                                    <div className="stat-title text-gray-400">Loups-Garous</div>
                                    <div className="stat-value text-red-400 text-lg">
                                        {selectedRoles[1] || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="card-actions justify-center">
                                <button
                                    type="submit"
                                    disabled={isCreating || totalPlayers > maxPlayers || totalPlayers < 6}
                                    className="btn btn-lg btn-primary bg-gradient-to-r from-purple-500 to-blue-500 border-none text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 w-full max-w-md"
                                >
                                    {isCreating ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            Création en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Gamepad2 className="inline mr-2"/>
                                            Créer la partie
                                            <Sparkles className="inline ml-1"/>
                                        </>
                                    )}
                                </button>
                            </div>

                            {isCreating && (
                                <div className="text-center mt-4">
                                    <p className="text-gray-400 text-sm">
                                        Préparation de la partie... Cette opération peut prendre quelques secondes
                                    </p>
                                    <div className="w-full bg-base-200/50 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-error mt-4 bg-red-500/10 border-red-500/20">
                                    <span>❌ {error}</span>
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