import {useEffect, useState} from "react";
import {classicRoles, roles} from "@/utils/Roles";
import Image from "next/image";

const AdminConfigurationModal = ({ game, show, close = () => {}, save = () => {} }) => {
    const defaultSelectedRoles = roles.reduce((acc, role) => {
        acc[role.id] = 0;
        return acc;
    }, {});

    const [gameName, setGameName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(8);
    const [selectedRoles, setSelectedRoles] = useState(defaultSelectedRoles);
    const [gameMode, setGameMode] = useState("classic");

    useEffect(() => {
        if (!game) return;
        const configuration = JSON.parse(game.configuration)

        setGameName(game.name || "");
        setMaxPlayers(configuration ? Object.values(configuration).reduce((a, b) => a + b, 0) : 0);
        setGameMode(game.type || "classic");
        setSelectedRoles(configuration);
    }, [game]);

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
            const current = prev[roleId];
            const role = roles.find(r => r.id === roleId);
            if (!role) return prev;
            const newCount = increment ? current + 1 : current - 1;
            if (newCount < 0) return prev;
            if (totalPlayers + (increment ? 1 : -1) > maxPlayers) return prev;
            return {...prev, [roleId]: newCount};
        });
    };

    const totalPlayers = Object.values(selectedRoles).reduce((sum, count) => sum + count, 0);

    const handleSave = () => {
        save(gameName, gameMode, selectedRoles)
        close();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6 md:p-8 relative border border-gray-200 dark:border-gray-700">
                <button
                    className="absolute top-4 right-4 btn btn-sm btn-circle bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-0"
                    onClick={close}
                >
                    ✕
                </button>

                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                    Configuration de la partie
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="label text-gray-700 dark:text-gray-300 font-medium">
                            Nom de la partie
                        </label>
                        <input
                            type="text"
                            value={gameName}
                            onChange={e => setGameName(e.target.value)}
                            className="input input-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                            placeholder="Entrez le nom de votre partie"
                        />
                    </div>

                    <div>
                        <label className="label text-gray-700 dark:text-gray-300 font-medium">
                            Joueurs maximum: <span className="text-blue-600 dark:text-blue-400 font-bold">{maxPlayers}</span>
                        </label>
                        <input
                            type="range"
                            min="8"
                            max="18"
                            value={maxPlayers}
                            onChange={e => setMaxPlayers(parseInt(e.target.value))}
                            className="range range-primary w-full bg-gray-200 dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2 w-full">
                            {[8, 10, 12, 14, 16, 18].map((num) => (
                                <span key={num}>{num}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label text-gray-700 dark:text-gray-300 font-medium">Mode de jeu</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {gameModes.map((mode) => (
                                <div
                                    key={mode.id}
                                    className={`card cursor-pointer transition-all duration-200 ${
                                        gameMode === mode.id
                                            ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-600/30 dark:to-purple-600/30 border-blue-500 dark:border-blue-400 shadow-lg"
                                            : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                    } border-2`}
                                    onClick={() => setGameMode(mode.id)}
                                >
                                    <div className="card-body p-4 text-center">
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

                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Composition des rôles
                        </h3>

                        <div className={`mb-3 p-3 rounded-lg border ${
                            totalPlayers === maxPlayers
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                : totalPlayers > maxPlayers
                                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        }`}>
                            <div className="flex justify-between items-center">
                                <span className={`font-medium ${
                                    totalPlayers === maxPlayers
                                        ? "text-green-800 dark:text-green-300"
                                        : totalPlayers > maxPlayers
                                            ? "text-red-800 dark:text-red-300"
                                            : "text-blue-800 dark:text-blue-300"
                                }`}>
                                    Total joueurs
                                </span>
                                <span className={`font-bold text-lg ${
                                    totalPlayers === maxPlayers
                                        ? "text-green-600 dark:text-green-400"
                                        : totalPlayers > maxPlayers
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-blue-600 dark:text-blue-400"
                                }`}>
                                    {totalPlayers} / {maxPlayers}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-8 h-8 flex-shrink-0">
                                            <Image
                                                src={role.image}
                                                alt={role.name}
                                                width={32}
                                                height={32}
                                                className="rounded-md object-cover"
                                            />
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {role.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => updateRoleCount(role.id, false)}
                                            disabled={gameMode !== "custom" || selectedRoles[role.id] === 0}
                                            className={`btn btn-xs w-8 h-8 flex items-center justify-center ${
                                                gameMode !== "custom" || selectedRoles[role.id] === 0
                                                    ? "btn-disabled bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
                                                    : "btn-ghost bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50"
                                            }`}
                                        >
                                            -
                                        </button>
                                        <span className="text-gray-900 dark:text-white font-bold w-6 text-center text-lg">
                                            {selectedRoles[role.id]}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => updateRoleCount(role.id, true)}
                                            disabled={gameMode !== "custom" || totalPlayers >= maxPlayers}
                                            className={`btn btn-xs w-8 h-8 flex items-center justify-center ${
                                                gameMode !== "custom" || totalPlayers >= maxPlayers
                                                    ? "btn-disabled bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
                                                    : "btn-ghost bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50"
                                            }`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Messages d'alerte */}
                        {totalPlayers > maxPlayers && (
                            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                                    <span className="text-lg">⚠️</span>
                                    <span>Trop de joueurs sélectionnés ! Réduisez le nombre de rôles.</span>
                                </div>
                            </div>
                        )}
                        {totalPlayers < 6 && (
                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                                    <span className="text-lg">⚠️</span>
                                    <span>Minimum 6 joueurs requis pour une partie équilibrée.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        className="btn btn-outline text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 order-2 sm:order-1"
                        onClick={close}
                    >
                        Annuler
                    </button>
                    <button
                        className="btn bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white border-0 order-1 sm:order-2"
                        onClick={handleSave}
                        disabled={totalPlayers > maxPlayers || totalPlayers < 6}
                    >
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminConfigurationModal;