'use client';
import {useEffect, useState} from "react";
import Link from "next/link";
import {ArrowRight, Clock, Eye, Gamepad2, Heart, MessageSquare, Moon, Skull, Sword, Trophy, Users} from "lucide-react";
import {socket} from "@/socket";

const Home = () => {
    const [gameCount, setGameCount] = useState(0);
    const [playersOnline, setPlayersOnline] = useState(0);
    const [loading, setLoading] = useState(true);
    const [particles, setParticles] = useState([]);

    const computePlayersOnline = (games) => {
        return (games || []).reduce((sum, g) => {
            if (!g) return sum;
            if (Array.isArray(g.players)) return sum + g.players.length;
            if (g.players && typeof g.players === 'object') return sum + Object.keys(g.players).length;
            return sum;
        }, 0);
    };

    useEffect(() => {
        const randomParticles = [...Array(20)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3
        }));
        setParticles(randomParticles);
    }, []);

    useEffect(() => {
        setLoading(true);
        if (!socket) {
            setLoading(false);
            return;
        }

        const handleConnect = () => {
            socket.emit('get-available-games');
        };

        const handleAvailableGames = (gamesData) => {
            const games = Array.isArray(gamesData) ? gamesData : (gamesData?.games || []);
            setGameCount(games.length);
            setPlayersOnline(computePlayersOnline(games));
            setLoading(false);
        };

        const handleConnectionError = () => {
            setLoading(false);
        };

        socket.on('connect', handleConnect);
        socket.on('available-games', handleAvailableGames);
        socket.on('connection-error', handleConnectionError);
        socket.on('disconnect', () => setLoading(false));

        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off('connect', handleConnect);
            socket.off('available-games', handleAvailableGames);
            socket.off('connection-error', handleConnectionError);
            socket.off('disconnect', () => setLoading(false));
        };
    }, []);

    const features = [
        {
            icon: Moon,
            title: "Nuit Épique",
            description: "Plongez dans l'atmosphère unique des nuits de pleine lune",
            color: "from-purple-600 to-indigo-600",
            bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-purple-900/20"
        },
        {
            icon: Sword,
            title: "Stratégie Intense",
            description: "Déduisez, manipulez, survivez dans ce jeu psychologique",
            color: "from-red-600 to-orange-600",
            bgColor: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-red-900/20"
        },
        {
            icon: Users,
            title: "Communauté Vivante",
            description: "Rejoignez des milliers de joueurs passionnés",
            color: "from-blue-600 to-cyan-600",
            bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-blue-900/20"
        },
        {
            icon: Heart,
            title: "Rôles Variés",
            description: "Découvrez plus de 20 rôles uniques avec des pouvoirs spéciaux",
            color: "from-green-600 to-emerald-600",
            bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-green-900/20"
        }
    ];

    const roles = [
        {name: "Loup-Garou", color: "bg-gradient-to-r from-red-700 to-orange-700", icon: "🐺"},
        {name: "Villageois", color: "bg-gradient-to-r from-green-700 to-emerald-700", icon: "👨‍🌾"},
        {name: "Voyante", color: "bg-gradient-to-r from-purple-700 to-pink-700", icon: "🔮"},
        {name: "Chasseur", color: "bg-gradient-to-r from-blue-700 to-cyan-700", icon: "🏹"},
        {name: "Sorcière", color: "bg-gradient-to-r from-indigo-700 to-violet-700", icon: "🧙‍♀️"},
        {name: "Cupidon", color: "bg-gradient-to-r from-pink-700 to-rose-700", icon: "🏹❤️"},
    ];

    const quickActions = [
        {
            icon: Gamepad2,
            title: "Créer une partie",
            description: "Lancez votre propre aventure nocturne",
            href: "/game/create",
            color: "bg-gradient-to-r from-purple-700 via-violet-700 to-blue-700",
            badge: "Nouveau"
        },
        {
            icon: Users,
            title: "Rejoindre",
            description: "Trouvez une partie en cours",
            href: "/game/list",
            color: "bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700",
            badge: loading ? "..." : `${gameCount} disponibles`
        },
        {
            icon: Trophy,
            title: "Classement",
            description: "Consultez les meilleurs joueurs",
            href: "/leaderboard",
            color: "bg-gradient-to-r from-yellow-700 via-orange-700 to-amber-700",
            badge: "Top 100"
        },
        {
            icon: MessageSquare,
            title: "Communauté",
            description: "Rejoignez notre Discord",
            href: process.env.NEXT_PUBLIC_DISCORD_URL || "#",
            external: true,
            color: "bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-700",
            badge: "Live"
        }
    ];

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white overflow-hidden">
            {/* Background avec forêt mystérieuse */}
            <div className="fixed inset-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-slate-950/40 to-black/80"></div>
            </div>

            {/* Lune sanglante */}
            <div className="fixed top-10 right-10 z-0">
                <div className="w-32 h-32 bg-gradient-to-br from-red-900 via-orange-800 to-red-950 rounded-full shadow-2xl shadow-red-800/50 animate-pulse-slow relative"
                     style={{
                         boxShadow: '0 0 60px rgba(139, 0, 0, 0.8), 0 0 100px rgba(220, 38, 38, 0.4)'
                     }}>
                    <div className="absolute inset-0 rounded-full opacity-30 animate-pulse"
                         style={{
                             background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 70%)'
                         }}></div>
                </div>
            </div>

            {/* Particules de brouillard */}
            <div className="fixed inset-0 pointer-events-none">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full opacity-30"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            width: Math.random() * 100 + 20 + 'px',
                            height: Math.random() * 100 + 20 + 'px',
                            background: `radial-gradient(circle, rgba(168, 85, 247, ${Math.random() * 0.3}) 0%, transparent 70%)`,
                            animation: `float ${5 + Math.random() * 5}s infinite ease-in-out`,
                            animationDelay: `${particle.delay}s`
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
                {/* Logo du loup-garou */}
                <div className="flex justify-center mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-purple-800 to-red-800 rounded-full blur-3xl opacity-60 animate-pulse"
                             style={{
                                 boxShadow: '0 0 80px rgba(220, 38, 38, 0.6)'
                             }}></div>
                        <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black border-4 border-red-700/50 flex items-center justify-center shadow-2xl"
                             style={{
                                 boxShadow: '0 0 40px rgba(220, 38, 38, 0.4)'
                             }}>
                            <div className="text-7xl animate-bounce" style={{animationDuration: '3s'}}>🐺</div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 animate-pulse">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-2xl"
                                 style={{
                                     boxShadow: '0 0 30px rgba(220, 38, 38, 0.8)'
                                 }}>
                                <Skull className="w-8 h-8 text-white"/>
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-orange-600 drop-shadow-2xl" style={{
                    textShadow: '0 0 30px rgba(220, 38, 38, 0.8), 0 0 60px rgba(139, 0, 0, 0.6)',
                    letterSpacing: '0.05em'
                }}>
                    LOUP-GAROU
                    <span className="block text-2xl md:text-4xl font-bold text-red-400 mt-4 drop-shadow-lg">
              La Nuit Éternelle vous attend...
            </span>
                </h1>

                <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-semibold">
                    Transformez-vous. Tuez. Survivez.
                    <span className="block text-gray-400 text-base md:text-lg mt-4 font-normal">
              Dans l&apos;obscurité de la nuit, les mensonges sont les seules vérités.
              <br/>
              Seul le plus malin émergera de l&apos;ombre...
            </span>
                </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                        <Link
                            href="/game/create"
                            className="group relative overflow-hidden px-10 py-6 bg-gradient-to-r from-red-700 via-red-800 to-red-900 border-2 border-red-600/60 rounded-xl font-bold text-white text-lg hover:from-red-600 hover:via-red-700 hover:to-red-800 transition-all duration-300 shadow-2xl hover:shadow-red-900/50 hover:scale-105"
                            style={{
                                boxShadow: '0 0 30px rgba(220, 38, 38, 0.5)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10 flex items-center gap-3">
                                <Moon className="w-6 h-6"/>
                                <span>CHASSER CETTE NUIT</span>
                            </div>
                        </Link>
                        <Link
                            href="/game/list"
                            className="group relative overflow-hidden flex items-center gap-3 px-10 py-6 bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-purple-700/60 rounded-xl hover:border-red-600 hover:shadow-xl transition-all duration-300"
                            style={{
                                boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)'
                            }}
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Eye className="w-5 h-5 text-purple-400 group-hover:text-red-400 relative z-10"/>
                            <div className="text-left relative z-10">
                                <div
                                    className="font-semibold text-white group-hover:text-red-300">
                                    Sentir les proies
                                </div>
                                <div className="text-sm text-gray-400">
                                    {loading ? "Repérage..." : `${gameCount} meutes active`}
                                </div>
                            </div>
                            <ArrowRight
                                className="w-5 h-5 ml-4 text-purple-400 group-hover:text-red-400 group-hover:translate-x-1 transition-transform relative z-10"/>
                        </Link>
                    </div>
                </div>

            <div
                className="bg-gradient-to-b from-black via-slate-950 to-black py-16 border-t border-red-900/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Les Murmures de la Nuit
                        </h2>
                        <p className="text-gray-500 text-sm tracking-widest uppercase">
                            Statistiques du Carnage
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div
                            className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-red-900/30 hover:border-red-700/60 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20 group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-red-700/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all duration-300"></div>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="p-2 rounded-lg bg-red-900/30 border border-red-700/50">
                                    <Skull className="w-5 h-5 text-red-500"/>
                                </div>
                                <span className="text-gray-400 text-sm uppercase font-bold tracking-wider">Parties Actives</span>
                            </div>
                            <div className="text-4xl font-black mb-1 text-red-500 relative z-10">
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
                                ) : (
                                    gameCount
                                )}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest relative z-10">
                                Meutes en chasse
                            </div>
                        </div>

                        <div
                            className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-900/30 hover:border-purple-700/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-700/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all duration-300"></div>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="p-2 rounded-lg bg-purple-900/30 border border-purple-700/50">
                                    <Users className="w-5 h-5 text-purple-500"/>
                                </div>
                                <span className="text-gray-400 text-sm uppercase font-bold tracking-wider">Proies</span>
                            </div>
                            <div className="text-4xl font-black mb-1 text-purple-500 relative z-10">
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
                                ) : (
                                    playersOnline
                                )}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest relative z-10">
                                En silence
                            </div>
                        </div>

                        <div
                            className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-orange-900/30 hover:border-orange-700/60 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/20 group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-700/10 rounded-full blur-2xl group-hover:bg-orange-600/20 transition-all duration-300"></div>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="p-2 rounded-lg bg-orange-900/30 border border-orange-700/50">
                                    <Skull className="w-5 h-5 text-orange-500"/>
                                </div>
                                <span className="text-gray-400 text-sm uppercase font-bold tracking-wider">Éliminés</span>
                            </div>
                            <div className="text-4xl font-black mb-1 text-orange-500 relative z-10">
                                1,247
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest relative z-10">
                                À jamais
                            </div>
                        </div>

                        <div
                            className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-900/30 hover:border-blue-700/60 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-700/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all duration-300"></div>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="p-2 rounded-lg bg-blue-900/30 border border-blue-700/50">
                                    <Clock className="w-5 h-5 text-blue-500"/>
                                </div>
                                <span className="text-gray-400 text-sm uppercase font-bold tracking-wider">Durée</span>
                            </div>
                            <div className="text-4xl font-black mb-1 text-blue-500 relative z-10">
                                12 min
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest relative z-10">
                                Par terreur
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Le Fardeau du Loup
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm uppercase tracking-widest">
                        Ce que tu dois maîtriser pour survivre
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-gray-800 hover:border-red-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-700/10 to-purple-700/10 rounded-full blur-3xl group-hover:from-red-600/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
                            <div className="relative z-10 flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} flex-shrink-0 group-hover:shadow-lg transition-all duration-300`}>
                                    <feature.icon className="w-6 h-6 text-white"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-red-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div
                className="bg-gradient-to-b from-black via-slate-950 to-black py-16 border-y border-red-900/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Les Rôles de la Nuit
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-sm uppercase tracking-widest">
                            Chaque rôle détient un pouvoir différent
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                        {roles.map((role, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-xl p-4 border border-gray-800 hover:border-red-700/60 transition-all duration-300 cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 hover:shadow-xl hover:shadow-red-900/20 hover:scale-105"
                            >
                                <div
                                    className={`absolute inset-0 ${role.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                                <div className="text-3xl text-center mb-2 group-hover:scale-110 transition-transform">{role.icon}</div>
                                <div
                                    className="text-center font-bold text-sm text-gray-300 group-hover:text-white transition-colors relative z-10">{role.name}</div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href="/rules"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 border border-red-600/60 rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-900/50 transition-all duration-300 text-white font-semibold"
                        >
                            <Eye className="w-4 h-4"/>
                            Découvrir tous les rôles
                            <ArrowRight className="w-4 h-4"/>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Préparez-vous pour la Chasse
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm uppercase tracking-widest">
                        La nuit tombe, l'heure du carnage approche
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            target={action.external ? "_blank" : "_self"}
                            rel={action.external ? "noopener noreferrer" : ""}
                            className="group relative overflow-hidden rounded-xl border border-gray-800 hover:border-red-700/60 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/30 hover:-translate-y-2 bg-gradient-to-br from-slate-800 to-slate-900"
                        >
                            <div
                                className={`absolute inset-0 ${action.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`${action.color} p-3 rounded-xl shadow-lg`}>
                                        <action.icon className="w-6 h-6 text-white"/>
                                    </div>
                                    {action.badge && (
                                        <span
                                            className="text-xs px-2 py-1 bg-gray-900 text-gray-300 rounded-full border border-gray-700">
                      {action.badge}
                    </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-red-300 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                                    {action.description}
                                </p>
                                <div className="flex items-center text-red-400 font-semibold">
                                    <span>Entrer</span>
                                    <ArrowRight
                                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div
                className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-900 py-20 border-t border-red-900/30">
                <div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>

                {/* Loup-garou styisé en arrière-plan */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 -left-20 text-8xl transform -rotate-12 animate-pulse">🐺</div>
                    <div className="absolute top-1/3 -right-20 text-8xl transform rotate-12 animate-pulse" style={{animationDelay: '1s'}}>🐺</div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="text-6xl mb-6 animate-bounce" style={{animationDuration: '2s'}}>🌙</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        La Lune se lève...
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                        L&apos;aube approche. Seuls les plus forts et les plus rusés survivront cette nuit éternelle.
                        Allez-vous chasser ou être chassé ?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth"
                            className="px-8 py-4 bg-gradient-to-r from-red-700 via-red-800 to-red-900 font-bold rounded-xl hover:shadow-2xl hover:shadow-red-900/50 hover:scale-105 transition-all duration-300 text-white border border-red-600/60"
                        >
                            Rejoindre la Meute
                        </Link>
                        <Link
                            href="/game/list"
                            className="px-8 py-4 bg-transparent border-2 border-red-700 font-bold rounded-xl hover:border-red-500 hover:text-red-300 transition-all duration-300 text-gray-300 hover:shadow-xl hover:shadow-red-900/20"
                        >
                            Voir les Proies
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.02);
                    }
                }

                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite;
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                * {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}

export default Home;