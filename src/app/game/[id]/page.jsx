"use client";

import {use, useEffect, useRef, useState} from "react";
import {useAuth} from "@/app/AuthProvider";
import {socket} from "@/socket";
import GameInformation from "@/components/game/Information";
import GameChat from "@/components/game/chat/Chat";
import GameActions from "@/components/game/actions/Actions";
import GameHeader from "@/components/game/Header";

const GamePage = ({params}) => {
    const {id} = use(params);
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("game");
    const [chatMessage, setChatMessage] = useState("");
    const [chatMessages, setChatMessages] = useState({});
    const [chatChannels, setChatChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState("general");
    const [chatSubTab, setChatSubTab] = useState("messages");
    const [creator, setCreator] = useState(null);
    const [configuration, setConfiguration] = useState(null);
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [history, setHistory] = useState([]);
    const [hasJoin, setHasJoin] = useState(false);
    const {user, token} = useAuth();
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (!id || !socket) return;

        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));

        if (hasJoin) return;

        setLoading(true);

        const handleGameUpdate = (gameData) => {
            setGame(gameData);
            try {
                setConfiguration(JSON.parse(gameData.configuration));
                setCreator(gameData.admin)
            } catch (e) {
                setConfiguration({});
            }
        };

        const handleGameHistory = (historyData) => {
            setHistory(historyData || []);
            const chatsByChannel = (historyData || [])
                .filter(h => h.type === 'chat_message')
                .reduce((acc, h) => {
                    const ch = (h.details && h.details.channel) || 'general';
                    acc[ch] = acc[ch] || [];
                    const messageText = (typeof h.message === 'string')
                        ? h.message.replace(new RegExp(`^${h.playerName}:\\s*`), '')
                        : h.message;
                    acc[ch].push({
                        playerName: h.playerName,
                        message: messageText,
                        createdAt: h.createdAt || new Date().toISOString(),
                        type: 'player',
                        channel: ch
                    });
                    return acc;
                }, {});
            setChatMessages(prev => ({...prev, ...chatsByChannel}));
        };

        const handleAvailableChannels = (channels) => {
            const keys = Object.keys(channels).filter(key => channels[key]);
            setChatChannels(keys);
            setChatMessages(prev => {
                const next = {...prev};
                keys.forEach(k => {
                    if (!next[k]) next[k] = [];
                });
                return next;
            });
        };

        const handleChatMessage = (msg) => {
            const channel = msg.channel || 'general';
            setChatMessages(prev => {
                const next = {...prev};
                next[channel] = [...(next[channel] || []), {
                    playerName: (msg.playerName ?? "Système"),
                    message: msg.message,
                    createdAt: msg.createdAt || new Date().toISOString(),
                    type: msg.type || "player",
                    channel
                }];
                return next;
            });
        };

        const handleNewAction = (action) => {
            setHistory(prev => [...prev, action]);
        };

        const handlePlayersUpdate = (data) => {
            const players = data.players || [];
            setPlayers(players);

            const found = players.find(p =>
                p.id === userFromLocalStorage?.id ||
                p.socketId === userFromLocalStorage?.id ||
                p.socketId === socket.id ||
                p.id === socket.id
            );

            setCurrentPlayer(found || null);
        };

        const handleGameError = (error) => console.error("Erreur Socket.IO:", error);

        const handleChannelJoined = (payload) => {
            if (!payload || !payload.channel) return;
            setCurrentChannel(payload.channel);
            setChatMessages(prev => {
                const next = {...prev};
                next[payload.channel] = [...(next[payload.channel] || []), {
                    playerName: "Système",
                    message: payload.message || `Vous avez rejoint ${payload.channel}`,
                    createdAt: new Date().toISOString(),
                    type: "system",
                    channel: payload.channel
                }];
                return next;
            });
        };

        const handleChatError = (err) => {
            setChatMessages(prev => {
                const next = {...prev};
                const ch = currentChannel || 'general';
                next[ch] = [...(next[ch] || []), {
                    playerName: "Système",
                    message: err?.error || "Erreur chat",
                    createdAt: new Date().toISOString(),
                    type: "system",
                    channel: ch
                }];
                return next;
            });
        };

        const handleHowl = () => {
            const audio = new Audio('/sounds/howl.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.error("Erreur de lecture audio:", e));
        }

        socket.on("game-update", handleGameUpdate);
        socket.on("game-history", handleGameHistory);
        socket.on("howl", handleHowl);
        socket.on("available-channels", handleAvailableChannels);
        socket.on("chat-message", handleChatMessage);
        socket.on("new-action", handleNewAction);
        socket.on("players-update", handlePlayersUpdate);
        socket.on("game-error", handleGameError);
        socket.on("channel-joined", handleChannelJoined);
        socket.on("chat-error", handleChatError);

        socket.emit("join-game", id, userFromLocalStorage, "");
        socket.emit("join-channel", id, "general");
        socket.emit("request-history", id);

        setHasJoin(true);
        setTimeout(() => setLoading(false), 1000);

        return () => {
            socket.off("game-update", handleGameUpdate);
            socket.off("game-history", handleGameHistory);
            socket.off("available-channels", handleAvailableChannels);
            socket.off("chat-message", handleChatMessage);
            socket.off("new-action", handleNewAction);
            socket.off("players-update", handlePlayersUpdate);
            socket.off("game-error", handleGameError);
            socket.off("channel-joined", handleChannelJoined);
            socket.off("chat-error", handleChatError);
            socket.off("howl", handleHowl);
            socket.emit("leave-game", id, userFromLocalStorage);
        };
    }, [id, socket]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages, currentChannel]);

    useEffect(() => {
        console.log("Historique mis à jour:", history);
    }, [history]);

    const switchChannel = (channel) => {
        if (!channel || channel === currentChannel) return;
        socket.emit("join-channel", id, channel);
        setCurrentChannel(channel);
    };

    const sendChatMessage = () => {
        if (chatMessage.trim()) {
            const ch = currentChannel || "general";
            const payload = {gameId: id, message: chatMessage, channel: ch};
            socket.emit("send-chat", payload);
            setChatMessage("");
        }
    };

    const startGame = () => {
        socket.emit("start-game", id);
    }


    const performAction = (action, targetPlayerId = null) => {
        socket.emit("player-action", {
            gameId: id,
            type: action,
            targetPlayerId,
            playerName: currentPlayer?.nickname,
            playerRole: currentPlayer?.role,
            details: {}
        });
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

    if (!game && !loading) {
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

    const participantsForChannel = (channel) => {
        if (channel === "werewolves") {
            return players.filter(p => p.role === "Loup-Garou");
        }
        if (channel === "vote") {
            return players.filter(p => p.online);
        }
        return players;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <GameHeader game={game} players={players} configuration={configuration} creator={creator}/>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    <GameActions
                        players={players}
                        currentPlayer={currentPlayer}
                        game={game}
                        performAction={performAction}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <div className="lg:col-span-1">
                        <GameInformation game={game} currentPlayer={currentPlayer} startGame={startGame}/>

                        <GameChat
                            chatChannels={chatChannels}
                            switchChannel={switchChannel}
                            chatMessages={chatMessages}
                            chatMessage={chatMessage}
                            participantsForChannel={participantsForChannel}
                            currentChannel={currentChannel}
                            chatSubTab={chatSubTab}
                            chatContainerRef={chatContainerRef}
                            setChatSubTab={setChatSubTab}
                            setChatMessage={setChatMessage}
                            sendChatMessage={sendChatMessage}
                            currentPlayer={currentPlayer}/>

                        {/*<div className="card glass shadow-2xl backdrop-blur-sm border border-white/10 mt-6">
                            <div className="card-body">
                                <h3 className="card-title text-white mb-4">📜 Historique</h3>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {history.map((event, index) => (
                                        <div key={index}
                                             className="flex items-start gap-3 p-3 bg-base-200/30 rounded-lg">
                                                <span
                                                    className="text-gray-400 text-sm mt-1">{formatTime(event.createdAt)}</span>
                                            <p className="text-gray-300 flex-1">{event.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;