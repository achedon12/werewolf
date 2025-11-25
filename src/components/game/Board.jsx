import Image from "next/image";
import {useEffect, useMemo, useState} from "react";
import {getRoleByName, playerIsWolf} from "@/utils/Roles.js";
import {Heart} from "lucide-react";
import { getMostTargetPlayerId, wolfVoteCounts as computeWolfVoteCounts } from "@/server/socket/utils/roleTurnManager.js";

const GameBoard = ({
                       players,
                       currentPlayer,
                       game,
                       numberCanBeSelected = 0,
                       selectedPlayers = [],
                       setSelectedPlayers,
                       revealedCards = [],
                   }) => {
    const [configuration, setConfiguration] = useState({});
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [radius, setRadius] = useState(160);
    const [boardSize, setBoardSize] = useState(400);
    const [viewport, setViewport] = useState({w: 0, h: 0});

    const mostTargetByWolvesId = getMostTargetPlayerId(game);
    const baseRadius = 160;
    const referencePlayers = 8;
    const paddingHorizontal = 32;
    const paddingVertical = 120;

    useEffect(() => {
        if (!game) return;
        setConfiguration(JSON.parse(game.configuration));
    }, [game]);

    useEffect(() => {
        if (!configuration) return;
        const total = Object.values(configuration).reduce((a, b) => a + b, 0);
        setMaxPlayers(total);
    }, [configuration]);

    useEffect(() => {
        const onResize = () => {
            setViewport({w: window.innerWidth, h: window.innerHeight});
        };
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        const desired = baseRadius * Math.max(0.6, maxPlayers / referencePlayers);

        const maxDiameterW = viewport.w ? Math.max(0, viewport.w - paddingHorizontal) : desired * 2;
        const maxDiameterH = viewport.h ? Math.max(0, viewport.h - paddingVertical) : desired * 2;
        const maxDiameter = Math.min(maxDiameterW, maxDiameterH);

        const maxRadiusFromViewport = Math.max(80, (maxDiameter - 100) / 2);

        const finalRadius = Math.min(desired, maxRadiusFromViewport, baseRadius * 1.8);

        setRadius(finalRadius);
    }, [maxPlayers, viewport]);

    useEffect(() => {
        setBoardSize(Math.round(radius * 2 + 100));
    }, [radius]);

    if (!players || players.length === 0) {
        return (<div className="flex justify-center items-center my-12">
            <div
                className="text-center text-gray-400 bg-base-200/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-300/50 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                </div>
                <p className="text-lg font-semibold">Aucun joueur dans la partie</p>
                <p className="text-sm mt-2">En attente de joueurs...</p>
            </div>
        </div>);
    }

    const alivePlayers = players.filter(p => p.isAlive);
    const deadPlayers = players.filter(p => !p.isAlive);
    const loverIds = game?.config?.lovers?.exists ? (game.config.lovers.players || []).map(String) : [];
    const currentPlayerIsWolf = playerIsWolf(currentPlayer?.role)
    const currentPlayerIsCupidon = currentPlayer?.role === "Cupidon";
    const currentPlayerIsLover = currentPlayer && loverIds.includes(String(currentPlayer.id));
    const currentPlayerIsWitch = currentPlayer?.role === "Sorcière";

    const wolfVoteCounts = useMemo(() => computeWolfVoteCounts(game), [game?.config?.wolves?.targets || {}]);    const isWolvesTurn = game.turn === 6 && game.phase === "Nuit";
    const isWitchTurn = game.turn === 7 && game.phase === "Nuit";

    const isSelected = (id) => {
        return Array.isArray(selectedPlayers) && selectedPlayers.includes(id);
    };

    const handleSelect = (player, id) => {
        if (currentPlayer && id === currentPlayer.id) return;
        if (!player.isAlive) return;
        const current = Array.isArray(selectedPlayers) ? selectedPlayers.slice() : [];

        if (isSelected(id)) {
            const next = current.filter(i => i !== id);
            setSelectedPlayers(next);
            return;
        }

        if (numberCanBeSelected === 1) {
            setSelectedPlayers([id]);
            return;
        }

        if (current.length < numberCanBeSelected) {
            setSelectedPlayers([...current, id]);
        }
    };

    const getCardInfo = (player) => {
        if (!player?.role) {
            return {src: "/cards/card.jpeg", alt: "Dos de carte"};
        }

        if (Array.isArray(revealedCards) && revealedCards.includes(String(player.id))) {
            const role = getRoleByName(player.role);
            return {src: role?.image ?? "/cards/card.jpeg", alt: player.role ?? "Carte"};
        }

        if (currentPlayerIsWolf && (player.role === "Loup-Garou" || player.role === "Loup-Garou Blanc")) {
            // force reveal werewolves to each other (to not reveal white werewolf to normal werewolves)
            const role = getRoleByName("Loup-Garou");
            return {src: role?.image ?? "/cards/card.jpeg", alt: player.role};
        }

        if (player.id === currentPlayer?.id) {
            const role = getRoleByName(player.role);
            return {src: role?.image ?? "/cards/card.jpeg", alt: player.role};
        }

        return {src: "/cards/card.jpeg", alt: "Dos de carte"};
    }
    const mostTargetByWolvesPlayer = players.find(p => String(p.id) === String(mostTargetByWolvesId)) || null;

    return (
        <div className="relative flex justify-center my-8">
            <div
                className="relative"
                style={{
                    width: `${boardSize}px`, height: `${boardSize}px`, maxWidth: "100%",
                }}
            >
                <div
                    className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-pulse"
                    style={{
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <div className="absolute inset-4 rounded-full border border-white/10"></div>
                </div>

                <div className="absolute inset-0 rounded-full">
                    {players.map((_, idx) => {
                        const angle = (360 / players.length) * idx;
                        return (<div
                            key={`line-${idx}`}
                            className="absolute top-1/2 left-1/2 w-px h-2/3 bg-white/5 transform origin-top"
                            style={{transform: `rotate(${angle}deg) translateY(-50%)`}}
                        />);
                    })}
                </div>

                {players.map((player, idx) => {
                    const totalPlayers = players.length;
                    const angle = (2 * Math.PI / totalPlayers) * idx - Math.PI / 2;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);

                    const isCurrentUser = player.id === currentPlayer?.id;
                    const pid = player.id || player.socketId || `${idx}`;
                    const selected = isSelected(pid);
                    const notSelectable = !player.isAlive || (Array.isArray(selectedPlayers) && !selected && selectedPlayers.length >= numberCanBeSelected && numberCanBeSelected !== 1);

                    const card = getCardInfo(player);
                    const voteCount = wolfVoteCounts[String(player.id)] || 0;

                    return (
                        <div
                            key={pid}
                            className="absolute top-1/2 left-1/2 transition-all duration-300 transform"
                            style={{
                                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                            }}
                        >
                            <Image
                                className="absolute bottom-6 -right-5 z-10"
                                src={card.src}
                                alt={card.alt}
                                width={40}
                                height={70}
                            />
                            {loverIds.includes(String(player.id)) && (currentPlayerIsCupidon || currentPlayerIsLover) && (
                                <div className="absolute bottom-6 -left-0 z-10">
                                    <Heart size={24} fill="currentColor" stroke="none"
                                           className="text-pink-500 animate-pulse"/>
                                </div>
                            )}

                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => handleSelect(player, pid)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") handleSelect(player, pid);
                                }}
                                className={`relative group cursor-pointer ${!player.isAlive ? "grayscale cursor-not-allowed opacity-60" : ""}`}
                                aria-pressed={selected}
                                aria-disabled={!player.isAlive}
                            >
                                <div
                                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 transition-all duration-300 ${player.isAlive ? "border-green-600" : "border-red-600"} p-1 ${selected ? "ring-4 ring-purple-400 scale-105" : ""} ${notSelectable ? "opacity-70" : ""}`}
                                >
                                    <Image
                                        src={player.isBot ? "/bot-avatar.png" : player.avatar ? process.env.NEXT_PUBLIC_APP_URL + player.avatar : "/default-avatar.png"}
                                        alt={player.nickname}
                                        width={80}
                                        height={80}
                                        className="rounded-full w-full h-full object-cover"
                                    />
                                </div>

                                <div
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                                    <div
                                        className="bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap border border-white/10 shadow-2xl">
                                        <div className="font-semibold">{player.nickname}</div>
                                        <div
                                            className={`text-xs mt-1 ${player.isAlive ? "text-green-400" : "text-red-400"}`}>
                                            {player.isAlive ? "🟢 En vie" : "🔴 Mort"}
                                        </div>
                                    </div>
                                    <div
                                        className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
                                </div>
                            </div>

                            <div className="text-center mt-2 transition-all duration-300">
                                <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm ${player.isAlive ? "text-white bg-black/30" : "text-gray-400 bg-red-900/30"} ${isCurrentUser ? "text-purple-300 bg-purple-900/50" : ""} ${selected ? "ring-2 ring-purple-300" : ""}`}
                                >
                                  {isCurrentUser ? "(Vous)" : player.nickname}
                                </span>
                                {currentPlayerIsWolf && isWolvesTurn && voteCount > 0 && (
                                    <span className="ml-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white">
                                    {voteCount}
                                </span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {currentPlayerIsWitch && mostTargetByWolvesPlayer && (
                    <div className="absolute top-6 right-6 md:top-8 md:right-8 z-30">
                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                            <div className="text-xs text-gray-300">Ciblé par les loups</div>
                            <Image
                                src={mostTargetByWolvesPlayer.isBot ? "/bot-avatar.png" : mostTargetByWolvesPlayer.avatar ? mostTargetByWolvesPlayer.avatar : "/default-avatar.png"}
                                alt={mostTargetByWolvesPlayer.nickname}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                            />
                            <div className="text-sm font-semibold text-white">{mostTargetByWolvesPlayer.nickname}</div>
                        </div>
                    </div>
                )}

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl">
                        <div className="text-center">
                            <div className="text-white font-bold text-sm">LOUP-GAROU</div>
                            <div className="text-gray-400 text-xs mt-1">{players.length} joueurs</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default GameBoard;