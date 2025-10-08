"use client";

import {use, useEffect, useState} from "react";
import {useAuth} from "@/app/AuthProvider";
import Image from "next/image";
import {socket} from "@/socket";
import {formatTime} from "@/utils/Date";

const GamePage = ({params}) => {
    const {id} = use(params);
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("game");
    const [chatMessage, setChatMessage] = useState("");
    const [creator, setCreator] = useState(null);
    const [configuration, setConfiguration] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [history, setHistory] = useState([]);
    const [hasJoin, setHasJoin] = useState(false);
    const {user, token} = useAuth()

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(`/api/game/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Erreur réseau lors du chargement de la partie");
                }

                const gameData = await response.json();

                setCreator(gameData.admin);
                setGame({
                    ...gameData,
                    players: gameData.players || []
                });
                const newConfiguration = JSON.parse(gameData.configuration);
                setConfiguration(newConfiguration)
            } catch (error) {
                console.error("Erreur chargement partie:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    useEffect(() => {
        if (!id || !socket) return;

        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));

        if (hasJoin) return;

        const handleGameUpdate = (gameData) => {
            setGame(gameData);
            try {
                setConfiguration(JSON.parse(gameData.configuration));
            } catch (e) {
                setConfiguration({});
            }
        };

        const handleGameHistory = (history) => {
            setHistory(history);
        };

        const handleAvailableChannels = (channels) => { /* ... */ };
        const handleChatMessage = (msg) => { /* ... */ };
        const handleNewAction = (action) => setHistory(prev => [...prev, action]);

        const handlePlayersUpdate = (data) => {
            console.log("Mise à jour des joueurs reçue:", data);
            setGame(prev => ({
                ...prev,
                players: data.players
            }));
            console.log(game)
            setCurrentPlayer((data.players || []).find(p => p.id === userFromLocalStorage.id));
        };

        const handleGameError = (error) => console.error("Erreur Socket.IO:", error);

        socket.on("game-update", handleGameUpdate);
        socket.on("game-history", handleGameHistory);
        socket.on("available-channels", handleAvailableChannels);
        socket.on("chat-message", handleChatMessage);
        socket.on("new-action", handleNewAction);
        socket.on("players-update", handlePlayersUpdate);
        socket.on("game-error", handleGameError);

        socket.emit("join-game", id, userFromLocalStorage, "");

        setHasJoin(true);

        socket.emit("request-history", id);

        return () => {
            socket.off("game-update", handleGameUpdate);
            socket.off("game-history", handleGameHistory);
            socket.off("available-channels", handleAvailableChannels);
            socket.off("chat-message", handleChatMessage);
            socket.off("new-action", handleNewAction);
            socket.off("players-update", handlePlayersUpdate);
            socket.off("game-error", handleGameError);
            socket.emit("leave-game", id, userFromLocalStorage);
        };
    }, [id, socket]);


    useEffect(() => {
        console.log("Historique mis à jour:", history);
    }, [history]);

    const sendChatMessage = () => {
        if (chatMessage.trim()) {
            // Logique d'envoi de message
            console.log("Message envoyé:", chatMessage);
            setChatMessage("");
        }
    };

    const performAction = (action, targetPlayerId = null) => {
        console.log("Action:", action, "Cible:", targetPlayerId);
    };

    if (loading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-gray-400 mt-4">Chargement de la partie...</p>
                </div>
            </div>
        );
    }

    if (!game) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl text-white">Partie non trouvée</h1>
                    <p className="text-gray-400">La partie que vous cherchez n'existe pas.</p>
                </div>
            </div>
        );
    }

    const alivePlayers = game.players.filter(p => p.isAlive);
    const deadPlayers = game.players.filter(p => !p.isAlive);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="bg-base-200/20 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{game.name}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className={`badge ${
                                    game.state === "En attente" ? "badge-warning" :
                                        game.state === "En cours" ? "badge-success" : "badge-error"
                                }`}>
                                    {game.state}
                                </span>
                                <span className="badge badge-info">{game.phase}</span>
                                <span className="text-gray-400">
                                    {alivePlayers.length} / {Object.values(configuration).reduce((a, b) => a + b, 0)} joueurs vivants
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <div className="text-right">
                                <p className="text-gray-400 text-sm">Créé par</p>
                                <p className="text-white font-medium">@{creator.nickname}</p>
                            </div>
                            <div className="avatar">
                                <div
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                    <Image src={creator.avatar || "/default-avatar.png"} alt={creator.nickname}
                                           width={40} height={40}
                                           className="rounded-full"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        <div
                            className="tabs tabs-boxed bg-base-200/20 backdrop-blur-sm flex gap-4 justify-center border border-white/10">
                            <button
                                className={`tab ${activeTab === "game" ? "tab-active" : ""}`}
                                onClick={() => setActiveTab("game")}
                            >
                                🎮 Jeu
                            </button>
                            <button
                                className={`tab ${activeTab === "players" ? "tab-active" : ""}`}
                                onClick={() => setActiveTab("players")}
                            >
                                👥 Joueurs
                            </button>
                            <button
                                className={`tab ${activeTab === "rules" ? "tab-active" : ""}`}
                                onClick={() => setActiveTab("rules")}
                            >
                                📖 Règles
                            </button>
                        </div>

                        {activeTab === "game" && (
                            <div className="space-y-6">
                                <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                                    <div className="card-body">
                                        <h2 className="card-title text-2xl text-white mb-4">
                                            Actions (Phase {game.phase === "Nuit" ? "🌙" : "☀️"} {game.phase})
                                        </h2>

                                        {game.phase === "Nuit" && currentPlayer && (
                                            <div className="alert alert-info bg-blue-500/10 border-blue-500/20">
                                                <span>
                                                    C'est la nuit ! Les pouvoirs spéciaux peuvent être utilisés.
                                                    {currentPlayer.role === "Loup-Garou" && " Choisissez une victime."}
                                                    {currentPlayer.role === "Voyante" && " Découvrez l'identité d'un joueur."}
                                                    {currentPlayer.role === "Docteur" && " Soignez un joueur."}
                                                </span>
                                            </div>
                                        )}

                                        {game.phase === "Jour" && (
                                            <div className="alert alert-warning bg-yellow-500/10 border-yellow-500/20">
                                                <span>
                                                    C'est le jour ! Discutez et votez pour éliminer un suspect.
                                                </span>
                                            </div>
                                        )}

                                        {currentPlayer && currentPlayer.isAlive && (
                                            <div className="mt-6">
                                                <h3 className="text-lg font-semibold text-white mb-4">Vos actions</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {game.phase === "Nuit" && currentPlayer.role === "Loup-Garou" && (
                                                        <select
                                                            className="select select-bordered w-full bg-base-200/50"
                                                            onChange={(e) => performAction("attack", e.target.value)}
                                                        >
                                                            <option value="">Choisir une victime</option>
                                                            {alivePlayers
                                                                .filter(p => p.role !== "Loup-Garou")
                                                                .map(player => (
                                                                    <option key={player.id} value={player.id}>
                                                                        {player.nickname}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    )}

                                                    {game.phase === "Nuit" && currentPlayer.role === "Voyante" && (
                                                        <select
                                                            className="select select-bordered w-full bg-base-200/50"
                                                            onChange={(e) => performAction("reveal", e.target.value)}
                                                        >
                                                            <option value="">Découvrir un joueur</option>
                                                            {alivePlayers
                                                                .filter(p => p.id !== currentPlayer?.id)
                                                                .map(player => (
                                                                    <option key={player.id} value={player.id}>
                                                                        {player.nickname}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    )}

                                                    {game.phase === "Jour" && (
                                                        <select
                                                            className="select select-bordered w-full bg-base-200/50"
                                                            onChange={(e) => performAction("vote", e.target.value)}
                                                        >
                                                            <option value="">Voter pour éliminer</option>
                                                            {alivePlayers
                                                                .filter(p => p.id !== currentPlayer?.id)
                                                                .map(player => (
                                                                    <option key={player.id} value={player.id}>
                                                                        {player.nickname}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">Temps restant:</span>
                                                <span className="text-white font-mono">04:32</span>
                                            </div>
                                            <progress
                                                className="progress progress-primary w-full"
                                                value="70"
                                                max="100"
                                            ></progress>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center my-6">
                                    <div className="relative w-64 h-64">
                                        {game.players.map((player, idx) => {
                                            const angle = (2 * Math.PI * idx) / game.players.length;
                                            const radius = 110;
                                            const x = radius * Math.cos(angle) + 110;
                                            const y = radius * Math.sin(angle) + 110;
                                            return (
                                                <div
                                                    key={player.id}
                                                    className={`absolute`}
                                                    style={{
                                                        left: `${x}px`,
                                                        top: `${y}px`,
                                                        transform: "translate(-50%, -50%)",
                                                        zIndex: player.isAlive ? 2 : 1,
                                                        opacity: player.isAlive ? 1 : 0.5,
                                                    }}
                                                >
                                                    <div
                                                        className={`avatar ${player.id === currentPlayer?.id ? "ring-2 ring-purple-500" : ""}`}>
                                                        <div
                                                            className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                                            <Image src={player.avatar || "/default-avatar.png"}
                                                                   alt={player.nickname} width={40} height={40}
                                                                   className="rounded-full"/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="text-center text-xs text-white mt-1">{player.nickname}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div
                                    className="card glass shadow-2xl backdrop-blur-sm border border-white/10 h-full mt-6">
                                    <div className="card-body flex flex-col">
                                        <h3 className="card-title text-white mb-4">💬 Chat</h3>

                                        <div className="flex-1 space-y-3 max-h-96 overflow-y-auto mb-4">
                                            {[
                                                {user: "LoupAlpha", message: "Qui soupçonnez-vous ?", time: "21:05"},
                                                {
                                                    user: "VoyanteMagique",
                                                    message: "Je crois que LoupNoir ment",
                                                    time: "21:06"
                                                },
                                                {
                                                    user: "LoupNoir",
                                                    message: "Moi ? Je suis un simple villageois !",
                                                    time: "21:07"
                                                },
                                            ].map((msg, index) => (
                                                <div key={index} className="p-3 bg-base-200/30 rounded-lg">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span
                                                            className="font-semibold text-purple-400">@{msg.user}</span>
                                                        <span className="text-gray-400 text-xs">{msg.time}</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{msg.message}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={chatMessage}
                                                onChange={(e) => setChatMessage(e.target.value)}
                                                placeholder="Tapez votre message..."
                                                className="input input-bordered flex-1 bg-base-200/50"
                                                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                            />
                                            <button
                                                onClick={sendChatMessage}
                                                className="btn btn-primary"
                                            >
                                                Envoyer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "players" && (
                            <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                                <div className="card-body">
                                    <h2 className="card-title text-2xl text-white mb-6">👥 Joueurs de la partie</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {game.players.map(player => (
                                            <div
                                                key={player.id}
                                                className={`p-4 rounded-2xl border-2 backdrop-blur-sm transition-all ${
                                                    player.isAlive
                                                        ? "bg-base-200/30 border-green-500/20"
                                                        : "bg-red-500/10 border-red-500/20 opacity-60"
                                                } ${
                                                    player.id === currentPlayer?.id ? "ring-2 ring-purple-500" : ""
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div
                                                                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                                                <span className="text-white">👤</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-white">
                                                                {player.nickname}
                                                                {player.id === currentPlayer?.id && " (Vous)"}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm">
                                                                {player.isAlive ? "🟢 En vie" : "🔴 Mort"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="badge badge-outline">
                                                            {player.isAlive ? player.role : "💀"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "rules" && (
                            <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                                <div className="card-body">
                                    <h2 className="card-title text-2xl text-white mb-6">📖 Règles de la partie</h2>
                                    <div className="prose prose-invert max-w-none">
                                        <h3 className="text-white">Phase de Nuit</h3>
                                        <ul className="text-gray-300">
                                            <li>Les Loups-Garous choisissent une victime</li>
                                            <li>La Voyante peut découvrir un rôle</li>
                                            <li>Le Docteur peut soigner un joueur</li>
                                            <li>La Sorcière peut utiliser ses potions</li>
                                        </ul>

                                        <h3 className="text-white mt-6">Phase de Jour</h3>
                                        <ul className="text-gray-300">
                                            <li>Discussion et accusations</li>
                                            <li>Vote pour éliminer un suspect</li>
                                            <li>Révélation du rôle de l'éliminé</li>
                                        </ul>

                                        <h3 className="text-white mt-6">Conditions de victoire</h3>
                                        <ul className="text-gray-300">
                                            <li>Villageois: Éliminer tous les Loups-Garous</li>
                                            <li>Loups-Garous: Être en égalité numérique avec les Villageois</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
                            <div className="card-body">
                                <h3 className="card-title text-white mb-4">ℹ️ Informations</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Votre rôle:</span>
                                        <span className="text-white font-semibold">
                                            {currentPlayer?.role || "Non assigné"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Statut:</span>
                                        <span className={currentPlayer?.isAlive ? "text-green-400" : "text-red-400"}>
                                            {currentPlayer?.isAlive ? "🟢 En vie" : "🔴 Mort"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Phase:</span>
                                        <span className="text-white">{game.phase}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10 mt-6">
                            <div className="card-body">
                                <h3 className="card-title text-white mb-4">📜 Historique</h3>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {history.map((event, index) => (
                                        <div key={index}
                                             className="flex items-start gap-3 p-3 bg-base-200/30 rounded-lg">
                                            <span className="text-gray-400 text-sm mt-1">{formatTime(event.createdAt)}</span>
                                            <p className="text-gray-300 flex-1">{event.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;