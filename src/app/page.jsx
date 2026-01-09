'use client';
import {useEffect, useState} from "react";
import Link from "next/link";
import PlayButton from "@/components/common/button/playButton/PlayButton";
import {ArrowRight, Clock, Eye, Gamepad2, Heart, MessageSquare, Moon, Skull, Sword, Trophy, Users} from "lucide-react";
import {socket} from "@/socket";

const Home = () => {
    const [gameCount, setGameCount] = useState(0);
    const [playersOnline, setPlayersOnline] = useState(0);
    const [loading, setLoading] = useState(true);

    const computePlayersOnline = (games) => {
        return (games || []).reduce((sum, g) => {
            if (!g) return sum;
            if (Array.isArray(g.players)) return sum + g.players.length;
            if (g.players && typeof g.players === 'object') return sum + Object.keys(g.players).length;
            return sum;
        }, 0);
    };

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
            className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] bg-cover bg-center opacity-20">
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 dark:via-gray-900/70 to-white dark:to-gray-900"></div>
                </div>

                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-gray-900 dark:bg-white rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>

                <div
                    className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-yellow-200 via-yellow-100 to-white rounded-full shadow-2xl shadow-yellow-500/50 animate-pulse-slow">
                    <div
                        className="absolute inset-4 bg-gradient-to-br from-gray-100 dark:from-gray-800 to-gray-200 dark:to-gray-900 rounded-full"></div>
                </div>

                <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div
                                className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 via-gray-200 dark:from-gray-800 dark:via-gray-900 to-white dark:to-black border-4 border-red-600/30 flex items-center justify-center shadow-2xl">
                                <div className="text-5xl">🐺</div>
                            </div>
                            <div className="absolute -bottom-2 -right-2">
                                <div
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg animate-bounce">
                                    <Sword className="w-6 h-6 text-white"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        Loup-Garou
                        <span className="block text-2xl md:text-4xl font-normal text-gray-600 dark:text-gray-300 mt-4">
              La Nuit vous appelle...
            </span>
                    </h1>

                    <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Un jeu de déduction psychologique où chaque nuit peut être votre dernière.
                        <span className="block text-gray-600 dark:text-gray-400 text-lg mt-4">
              Mensonges, alliances, trahisons... Qui survivra jusqu&apos;à l&apos;aube ?
            </span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                        <PlayButton
                            href="/game/create"
                            label="Lancer une Partie"
                            subtitle="La nuit tombe..."
                            icon={Moon}
                            primary
                            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 border-red-500/50"
                        />
                        <Link
                            href="/game/list"
                            className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-400 dark:border-gray-700 rounded-xl hover:border-red-500 hover:shadow-xl transition-all duration-300"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-400"/>
                            <div className="text-left relative z-10">
                                <div
                                    className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300">
                                    Observer les parties
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    {loading ? "Chargement des ombres..." : `${gameCount} parties en attente`}
                                </div>
                            </div>
                            <ArrowRight
                                className="w-5 h-5 ml-4 text-gray-500 dark:text-gray-600 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-1 transition-transform"/>
                        </Link>
                    </div>
                </div>
            </div>

            <div
                className="bg-gradient-to-b from-gray-100/50 dark:from-gray-800/50 to-gray-200/50 dark:to-gray-900/50 py-16 border-t border-gray-300 dark:border-gray-700/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            La Nuit en Chiffres
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            L&apos;activité de notre village
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div
                            className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 hover:border-red-500/50 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                    <Skull className="w-5 h-5 text-red-600 dark:text-red-400"/>
                                </div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Parties nocturnes</span>
                            </div>
                            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                                ) : (
                                    gameCount
                                )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                En ce moment même
                            </div>
                        </div>

                        <div
                            className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 hover:border-green-500/50 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <Users className="w-5 h-5 text-green-600 dark:text-green-400"/>
                                </div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Âmes errantes</span>
                            </div>
                            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                                ) : (
                                    playersOnline
                                )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Dans l&apos;obscurité
                            </div>
                        </div>

                        <div
                            className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                    <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400"/>
                                </div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Nuits passées</span>
                            </div>
                            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                                1,247
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Parties terminées
                            </div>
                        </div>

                        <div
                            className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                                </div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Durée moyenne</span>
                            </div>
                            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                                12 min
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Par nuit
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        L&apos;Expérience Loup-Garou
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Tout ce qui rend nos nuits inoubliables
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-2xl ${feature.bgColor} border border-gray-300 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} flex-shrink-0`}>
                                    <feature.icon className="w-6 h-6 text-white"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div
                className="bg-gradient-to-b from-gray-100/50 dark:from-gray-900/50 to-gray-200/50 dark:to-gray-800/50 py-16 border-y border-gray-300 dark:border-gray-700/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Rôles Mystérieux
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Choisissez votre camp et découvrez vos pouvoirs
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                        {roles.map((role, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-xl p-4 border border-gray-400 dark:border-gray-700 hover:scale-105 transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800"
                            >
                                <div
                                    className={`absolute inset-0 ${role.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                                <div className="text-3xl text-center mb-2">{role.icon}</div>
                                <div
                                    className="text-center font-medium text-sm text-gray-900 dark:text-gray-200">{role.name}</div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href="/rules"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 border border-gray-400 dark:border-gray-700 rounded-xl hover:border-red-500 hover:text-red-600 dark:hover:text-red-300 transition-all duration-300 text-gray-900 dark:text-gray-300"
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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Prêt pour l&apos;Aventure ?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Rejoignez la communauté des loups-garous
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            target={action.external ? "_blank" : "_self"}
                            rel={action.external ? "noopener noreferrer" : ""}
                            className="group relative overflow-hidden rounded-xl border border-gray-400 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-transparent"
                        >
                            <div
                                className={`absolute inset-0 ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`${action.color} p-3 rounded-xl`}>
                                        <action.icon className="w-6 h-6 text-white"/>
                                    </div>
                                    {action.badge && (
                                        <span
                                            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                      {action.badge}
                    </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-400 mb-4">
                                    {action.description}
                                </p>
                                <div className="flex items-center text-red-600 dark:text-red-400 font-medium">
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
                className="relative overflow-hidden bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 py-20 border-t border-gray-300 dark:border-gray-800">
                <div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="text-6xl mb-6">🌕</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        La Lune se lève...
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                        Rejoignez des milliers de joueurs dans cette aventure nocturne.
                        Créez des alliances, déjouez les complots, et survivez jusqu&apos;à l&apos;aube.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth"
                            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-white"
                        >
                            S&apos;inscrire gratuitement
                        </Link>
                        <Link
                            href="/game/list"
                            className="px-8 py-4 bg-transparent border-2 border-gray-600 dark:border-gray-700 font-semibold rounded-xl hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-300 transition-all duration-300 text-gray-900 dark:text-gray-300"
                        >
                            Voir les parties
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 opacity-20">
                    <div className="text-4xl transform rotate-12">🐺</div>
                    <div className="text-4xl transform -rotate-12">🐺</div>
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