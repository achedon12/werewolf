"use client";

import {use, useEffect, useRef, useState} from "react";
import {socket} from "@/socket";
import GameInformation from "@/components/game/information/Information";
import GameChat from "@/components/game/chat/Chat";
import GameActions from "@/components/game/actions/Actions";
import GameHeader from "@/components/game/Header";
import AmbientForest from "@/components/game/ambient/AmbientForest.jsx";
import PlayersConfigurationModal from "@/components/game/information/modal/Players";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import ConfigurationOverviewModal from "@/components/game/information/modal/ConfigurationOverview";
import AdminConfigurationModal from "@/components/game/information/modal/Configuration";
import StartingCounter from "@/components/game/StartingCounter";
import {ACTION_TYPES, GAME_PHASES, GAME_STATES} from "@/server/config/constants";
import {History} from "lucide-react";
import LoverAmbient from "@/components/game/ambient/LoverAmbient.jsx";

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
    const [ambientThemeEnabled, setAmbientThemeEnabled] = useState(false);
    const [loverAmbientEnabled, setLoverAmbientEnabled] = useState(false);
    const [loverAmbientData, setLoverAmbientData] = useState(null);
    const [ambientSoundsEnabled, setAmbientSoundsEnabled] = useState(false);
    const [currentAmbientSound, setCurrentAmbientSound] = useState(null);
    const [showConfigurationOverviewModal, setShowConfigurationOverviewModal] = useState(false);
    const [showConfigurationModal, setShowConfigurationModal] = useState(false);
    const [showPlayersConfigurationModal, setShowPlayersConfigurationModal] = useState(false);
    const [numberCanBeSelected, setNumberCanBeSelected] = useState(0);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [startingSoon, setStartingSoon] = useState(null);
    const ambientSoundRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [roleCallRemaining, setRoleCallRemaining] = useState(null);
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [revealedCards, setRevealedCards] = useState([]);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        if (!id || !socket) return;

        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));

        const savedTheme = userFromLocalStorage.ambientThemeEnabled;
        const savedSounds = userFromLocalStorage.ambientSoundsEnabled;
        setAmbientThemeEnabled(savedTheme);
        setAmbientSoundsEnabled(savedSounds);

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

        const handleStartingSoon = (seconds) => {
            setStartingSoon(seconds);
        };

        const handleGameError = (error) => {
            toast.error(error || "Erreur de jeu")
        };

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

        const handleAmbientSettings = (settings) => {
            if (settings) {
                setAmbientThemeEnabled(settings.themeEnabled || false);
                setAmbientSoundsEnabled(settings.soundsEnabled || false);
            }
        };

        const handleExcludePlayerConfirm = (message) => {
            toast.error(message);
            router.push('/');
        }

        const handleNotify = (message) => {
            toast.info(message || "Action administrateur éxécutée.");
        }

        socket.on("game-update", handleGameUpdate);
        socket.on("game-history", handleGameHistory);
        socket.on("howl", handleHowl);
        socket.on("ambient-settings", handleAmbientSettings);
        socket.on("available-channels", handleAvailableChannels);
        socket.on("chat-message", handleChatMessage);
        socket.on("new-action", handleNewAction);
        socket.on("players-update", handlePlayersUpdate);
        socket.on("exclude-player-confirm", handleExcludePlayerConfirm);
        socket.on("game-notify", handleNotify);
        socket.on("seer-reveal-result", handleSeerReveal);
        socket.on("start-lover-animation", handleLoverAnimation);
        socket.on("game-error", handleGameError);
        socket.on("channel-joined", handleChannelJoined);
        socket.on("chat-error", handleChatError);
        socket.on("starting-soon", handleStartingSoon);
        socket.on('role-call-start', handleRoleCallStart);
        socket.on('role-call-tick', handleRoleCallTick);
        socket.on('role-call-end', handleRoleCallEnd);
        socket.on('role-call-stopped', handleRoleCallStopped);
        socket.on('role-call-finished', handleRoleCallFinished);
        socket.on('game-set-number-can-be-selected', (number) => setNumberCanBeSelected(number));

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
            socket.off("ambient-settings", handleAmbientSettings);
            socket.off('exclude-player-confirm', handleExcludePlayerConfirm);
            socket.off('game-notify', handleNotify)
            socket.off('seer-reveal-result', handleSeerReveal);
            socket.off('start-lover-animation', handleLoverAnimation);
            socket.off('starting-soon', handleStartingSoon);
            socket.emit("leave-game", id, userFromLocalStorage);
            socket.off('role-call-start', handleRoleCallStart);
            socket.off('role-call-tick', handleRoleCallTick);
            socket.off('role-call-end', handleRoleCallEnd);
            socket.off('role-call-stopped', handleRoleCallStopped);
            socket.off('role-call-finished', handleRoleCallFinished);

        };
    }, [id, socket]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages, currentChannel]);

    useEffect(() => {
        const initializeAmbientSound = () => {
            if (!ambientSoundRef.current) {
                setCurrentAmbientSound('/sounds/ambiance.mp3');
                ambientSoundRef.current = new Audio('/sounds/ambiance.mp3');
                ambientSoundRef.current.loop = true;
                ambientSoundRef.current.volume = 0.2;
            }
        };

        if (ambientSoundsEnabled) {
            initializeAmbientSound();
            playAmbientSound();
        } else {
            stopAmbientSound();
        }

        return () => {
            stopAmbientSound();
        };
    }, [ambientSoundsEnabled]);

    useEffect(() => {
        if (!startingSoon) return;
        if (startingSoon <= 0) {
            setStartingSoon(null);
            return;
        }
        const timer = setTimeout(() => {
            setStartingSoon(startingSoon - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [startingSoon]);

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            toast.warning(
                <div style={{ cursor: 'pointer' }} onClick={openDiscord}>
                    App is still in development. <br />
                    Bugs may occur!<br />
                    Join our Discord for support.<br />
                    Click this message to open Discord.
                </div>,
                {
                    autoClose: 10000,
                    closeOnClick: true,
                }
            );
        }

        const onOutsideClick = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onOutsideClick);
        return () => document.removeEventListener('mousedown', onOutsideClick);
    }, []);

    const openDiscord = () => {
        const url = process.env.NEXT_PUBLIC_DISCORD_URL
        try {
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (e) {
            window.location.href = url;
        }
    };

    const handleSeerReveal = (data) => {
        const {message, id} = data || {};
        if (id !== undefined && id !== null) {
            const sid = String(id);
            setRevealedCards(prev => Array.from(new Set([...prev, sid])));
            setTimeout(() => {
                setRevealedCards(prev => prev.filter(x => x !== sid));
            }, 5000);
        }
        toast.info(message || "Résultat de la révélation de la Voyante.");
    }

    const handleLoverAnimation = (data) => {
        const {playerName, playerId, message} = data || {};
        setLoverAmbientData({playerName, playerId});
        setLoverAmbientEnabled(true)
        setTimeout(() => {
            setLoverAmbientEnabled(false);
            setLoverAmbientData(null);
        }, 8000);

        toast.info(message || `Vous êtes maintenant lié(e) à ${playerName} !`);
    }

    const handleRoleCallTick = (data) => {
        if (!data) return;
        const remaining = typeof data.remaining === 'number' ? data.remaining : (data.duration ?? null);
        setRoleCallRemaining(remaining);
    };
    const handleRoleCallStart = (payload) => {
        setRoleCallRemaining(payload?.duration ?? null);
    };
    const handleRoleCallEnd = () => setRoleCallRemaining(null);
    const handleRoleCallStopped = () => setRoleCallRemaining(null);
    const handleRoleCallFinished = () => setRoleCallRemaining(null);


    const playAmbientSound = () => {
        if (ambientSoundRef.current && ambientSoundsEnabled) {
            ambientSoundRef.current.play().catch(e => {
                console.error("Erreur lecture son ambiance:", e);
            });
        }
    };

    const stopAmbientSound = () => {
        if (ambientSoundRef.current) {
            ambientSoundRef.current.pause();
            ambientSoundRef.current.currentTime = 0;
        }
    };

    const toggleAmbientTheme = () => {
        const newValue = !ambientThemeEnabled;
        setAmbientThemeEnabled(newValue);
        // localStorage.setItem('ambientThemeEnabled', newValue.toString());
        // socket.emit("ambient-settings-update", {
        //     gameId: id,
        //     themeEnabled: newValue,
        //     soundsEnabled: ambientSoundsEnabled
        // });
    };

    const toggleAmbientSounds = () => {
        const newValue = !ambientSoundsEnabled;
        setAmbientSoundsEnabled(newValue);
        // localStorage.setItem('ambientSoundsEnabled', newValue.toString());
        //
        if (newValue) {
            playAmbientSound();
        } else {
            stopAmbientSound();
        }
        //
        // socket.emit("ambient-settings-update", {
        //     gameId: id,
        //     themeEnabled: ambientThemeEnabled,
        //     soundsEnabled: newValue
        // });
    };

    const handleExcludePlayer = (user, reason) => {
        socket.emit("exclude-player", id, user, reason);
    }

    const handleAddBot = (botName) => {
        socket.emit("add-bot", id, botName);
    }

    const handleUpdateGame = (newName, newType, newConfig) => {
        socket.emit("update-game", id, {name: newName, type: newType, configuration: JSON.stringify(newConfig)})
    }

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

    const performAction = () => {
        socket.emit("player-action", {
            gameId: id,
            selectedPlayers
        });
        setSelectedPlayers([]);
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
        <div
            className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <GameHeader game={game} players={players} configuration={configuration} creator={creator}/>

            {!loverAmbientEnabled && ambientThemeEnabled && <AmbientForest/>}

            {ambientThemeEnabled && loverAmbientEnabled && (
                <LoverAmbient
                    data={loverAmbientData}
                    duration={8000}
                    onClose={() => setLoverAmbientEnabled(false)}
                />
            )}

            <div>
                <div className="hidden lg:flex absolute top-4 right-4 z-20 gap-2">
                    <button
                        onClick={toggleAmbientTheme}
                        className={`p-2 rounded-lg backdrop-blur-sm border transition-all ${
                            ambientThemeEnabled
                                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                : 'bg-gray-500/20 border-gray-500/50 text-gray-300'
                        }`}
                        title="Thème forêt"
                    >
                        🌲
                    </button>
                    <button
                        onClick={toggleAmbientSounds}
                        className={`p-2 rounded-lg backdrop-blur-sm border transition-all ${
                            ambientSoundsEnabled
                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                                : 'bg-gray-500/20 border-gray-500/50 text-gray-300'
                        }`}
                        title="Sons d'ambiance"
                    >
                        🎵
                    </button>
                </div>

                <div className="flex lg:hidden absolute top-4 right-4 z-50" ref={mobileMenuRef}>
                    <button
                        onClick={() => setMobileMenuOpen(v => !v)}
                        className="p-2 rounded-lg backdrop-blur-sm border bg-gray-500/20 border-gray-500/50 text-gray-300"
                        title="Options"
                        aria-expanded={mobileMenuOpen}
                        aria-haspopup="true"
                    >
                        ⚙️
                    </button>

                    {mobileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-base-100/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-2 space-y-2">
                            <button
                                onClick={() => { toggleAmbientTheme(); setMobileMenuOpen(false); }}
                                className={`w-full text-left p-2 rounded-md transition-all ${
                                    ambientThemeEnabled
                                        ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                                        : 'bg-gray-500/20 border border-gray-500/50 text-gray-300'
                                }`}
                            >
                                🌲 Thème forêt
                            </button>

                            <button
                                onClick={() => { toggleAmbientSounds(); setMobileMenuOpen(false); }}
                                className={`w-full text-left p-2 rounded-md transition-all ${
                                    ambientSoundsEnabled
                                        ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                                        : 'bg-gray-500/20 border border-gray-500/50 text-gray-300'
                                }`}
                            >
                                🎵 Sons d'ambiance
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    <GameActions
                        players={players}
                        currentPlayer={currentPlayer}
                        game={game}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        numberCanBeSelected={numberCanBeSelected}
                        selectedPlayers={selectedPlayers}
                        setSelectedPlayers={setSelectedPlayers}
                        roleCallRemaining={roleCallRemaining}
                        performAction={performAction}
                        revealedCards={revealedCards}
                    />

                    <div className="lg:col-span-1">
                        <GameInformation
                            game={game}
                            configuration={configuration}
                            players={players}
                            currentPlayer={currentPlayer}
                            startGame={startGame}
                            configurationGameOverview={setShowConfigurationOverviewModal}
                            configurationGame={setShowConfigurationModal}
                            playersConfiguration={() => setShowPlayersConfigurationModal(true)}
                        />

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

                        {game.state === GAME_STATES.IN_PROGRESS && (
                            <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10 mt-6">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-white text-lg mb-4">
                                        <History className="inline mr-2" size={20}/>
                                        Derniers Événements
                                    </h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {history
                                            .filter(event => event.type === ACTION_TYPES.GAME_EVENT)
                                            .map((event, index) => {
                                                const startedAtMs = new Date(game.startedAt).getTime();
                                                const eventAtMs = new Date(event.createdAt).getTime();
                                                const diffMs = Math.max(0, eventAtMs - startedAtMs);
                                                const totalSeconds = Math.floor(diffMs / 1000);
                                                const hours = Math.floor(totalSeconds / 3600);
                                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                                const seconds = totalSeconds % 60;
                                                const elapsed = [
                                                    hours.toString().padStart(2, '0'),
                                                    minutes.toString().padStart(2, '0'),
                                                    seconds.toString().padStart(2, '0')
                                                ].join(':');

                                                return (
                                                    <div key={index}
                                                         className="flex items-start gap-3 p-3 bg-base-200/30 rounded-lg">
                                                        <span className="text-gray-400 text-xs mt-1">{elapsed}</span>
                                                        <p className="text-gray-300 text-sm">{event.message}</p>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfigurationOverviewModal
                game={game}
                show={showConfigurationOverviewModal}
                close={() => setShowConfigurationOverviewModal(false)}
            />

            <PlayersConfigurationModal
                currentPlayer={currentPlayer}
                excludePlayer={handleExcludePlayer}
                addBot={handleAddBot}
                game={game}
                players={players}
                show={showPlayersConfigurationModal}
                close={() => setShowPlayersConfigurationModal(false)}
            />

            <AdminConfigurationModal
                game={game}
                show={showConfigurationModal}
                close={() => setShowConfigurationModal(false)}
                save={handleUpdateGame}
            />

            <StartingCounter
                startingSoon={startingSoon}
                currentPlayer={currentPlayer}
            />
        </div>
    );
};

export default GamePage;