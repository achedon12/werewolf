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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-base-200 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
                <button className="absolute top-4 right-4 btn btn-sm btn-circle" onClick={close}>✕</button>
                <h2 className="text-3xl font-bold mb-6 text-center text-white">Configuration de la partie</h2>
                <div className="space-y-6">
                    <div>
                        <label className="label text-gray-300 font-medium">Nom de la partie</label>
                        <input
                            type="text"
                            value={gameName}
                            onChange={e => setGameName(e.target.value)}
                            className="input input-lg w-full bg-base-200/50 border-white/20"
                        />
                    </div>
                    <div>
                        <label className="label text-gray-300 font-medium">
                            Joueurs maximum: {maxPlayers}
                        </label>
                        <input
                            type="range"
                            min="8"
                            max="18"
                            value={maxPlayers}
                            onChange={e => setMaxPlayers(parseInt(e.target.value))}
                            className="range range-primary w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 px-2 w-full">
                            <span>8</span><span>10</span><span>12</span><span>14</span><span>16</span><span>18</span>
                        </div>
                    </div>
                    <div>
                        <label className="label text-gray-300 font-medium">Mode de jeu</label>
                        <div className="grid grid-cols-2 gap-4">
                            {gameModes.map((mode) => (
                                <div
                                    key={mode.id}
                                    className={`card cursor-pointer ${gameMode === mode.id ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500" : "bg-base-200/50 border-white/10"} border-2`}
                                    onClick={() => setGameMode(mode.id)}
                                >
                                    <div className="card-body p-4 text-center">
                                        <h3 className="card-title text-white text-lg justify-center">{mode.name}</h3>
                                        <p className="text-gray-400 text-sm">{mode.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl text-white mb-2">Composition des rôles</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {roles.map((role) => (
                                <div key={role.id}
                                     className="flex items-center justify-between p-2 bg-base-200/30 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <Image src={role.image} alt={role.name} width={32} height={32}
                                               className="rounded-md"/>
                                        <span className="text-white">{role.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => updateRoleCount(role.id, false)}
                                            disabled={gameMode !== "custom"}
                                            className="btn btn-xs btn-ghost"
                                        >-
                                        </button>
                                        <span
                                            className="text-white font-bold w-6 text-center">{selectedRoles[role.id]}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateRoleCount(role.id, true)}
                                            disabled={gameMode !== "custom" || totalPlayers >= maxPlayers}
                                            className="btn btn-xs btn-ghost"
                                        >+
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 text-sm text-gray-400">Total: {totalPlayers} / {maxPlayers} joueurs</div>
                        {totalPlayers > maxPlayers && (
                            <div className="alert alert-error mt-2 bg-red-500/10 border-red-500/20">
                                <span>⚠️ Trop de joueurs sélectionnés !</span>
                            </div>
                        )}
                        {totalPlayers < 6 && (
                            <div className="alert alert-warning mt-2 bg-yellow-500/10 border-yellow-500/20">
                                <span>⚠️ Minimum 6 joueurs requis</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mt-8 space-x-4">
                    <button className="btn btn-outline" onClick={close}>Annuler</button>
                    <button
                        className="btn btn-primary"
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