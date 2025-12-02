'use client';
import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import PlayButton from "@/components/common/button/playButton/PlayButton";
import {ArrowRight, Clock, Gamepad2, Globe, MessageSquare, Shield, Sparkles, Trophy, Users, Zap} from "lucide-react";
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
            icon: Users,
            title: "Multijoueur",
            description: "Jusqu'à 18 joueurs par partie, accessible à tous",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            icon: Zap,
            title: "Rapide & Simple",
            description: "Créez une partie en 30 secondes, jouez immédiatement",
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50 dark:bg-purple-900/20"
        },
        {
            icon: Shield,
            title: "Sécurisé",
            description: "Protection anti-triche et modération active",
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50 dark:bg-green-900/20"
        },
        {
            icon: Globe,
            title: "International",
            description: "Joueurs du monde entier, multilingue",
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-50 dark:bg-orange-900/20"
        }
    ];

    const quickActions = [
        {
            icon: Gamepad2,
            title: "Créer une partie",
            description: "Lancez votre propre aventure",
            href: "/game/create",
            color: "bg-gradient-to-r from-purple-600 to-blue-600"
        },
        {
            icon: Users,
            title: "Rejoindre",
            description: "Trouvez une partie en cours",
            href: "/game/list",
            color: "bg-gradient-to-r from-green-600 to-emerald-600"
        },
        {
            icon: Trophy,
            title: "Classement",
            description: "Consultez les meilleurs joueurs",
            href: "/leaderboard",
            color: "bg-gradient-to-r from-yellow-600 to-orange-600"
        },
        {
            icon: MessageSquare,
            title: "Communauté",
            description: "Rejoignez notre Discord",
            href: process.env.NEXT_PUBLIC_DISCORD_URL || "#",
            external: true,
            color: "bg-gradient-to-r from-indigo-600 to-purple-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent dark:from-blue-500/5 dark:via-purple-500/5"></div>

                <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div
                                className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl animate-pulse-slow">
                                <Image
                                    src="/logo.png"
                                    alt="Loup-Garou Logo"
                                    width={80}
                                    height={80}
                                    className="drop-shadow-lg"
                                />
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-5 h-5 text-white"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                        Loup-Garou
                        <span className="block text-2xl md:text-4xl font-normal text-blue-600 dark:text-blue-400 mt-2">
                          Online Edition
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Plongez dans un jeu de déduction palpitant où mensonges et vérités s&apos;affrontent.
                        <span className="block text-gray-500 dark:text-gray-400 text-lg mt-2">
                          Rejoignez des milliers de joueurs dans des parties épiques et découvrez qui se cache derrière le masque.
                        </span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                        <PlayButton
                            href="/game/create"
                            label="Créer une partie"
                            subtitle="Démarrez votre aventure"
                            icon={Gamepad2}
                            primary
                        />
                        <Link
                            href="/game/list"
                            className="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300"
                        >
                            <Users
                                className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"/>
                            <div className="text-left">
                                <div
                                    className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    Rejoindre une partie
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {loading ? "Chargement..." : `${gameCount} parties disponibles`}
                                </div>
                            </div>
                            <ArrowRight
                                className="w-5 h-5 ml-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform"/>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Pourquoi jouer avec nous ?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Une expérience de jeu unique combinant stratégie, socialisation et amusement
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-2xl ${feature.bgColor} border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                                <feature.icon className="w-6 h-6 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            En direct
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Les chiffres qui parlent d&apos;eux-mêmes
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Gamepad2 className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Parties en cours</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                ) : (
                                    gameCount
                                )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Actuellement
                            </div>
                        </div>

                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <Users className="w-5 h-5 text-green-600 dark:text-green-400"/>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Joueurs en ligne</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                ) : (
                                    playersOnline
                                )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                En ce moment
                            </div>
                        </div>

                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Parties jouées</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                Plus de 500
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Au total
                            </div>
                        </div>

                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400"/>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Temps moyen</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                10-15 min
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Par partie
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Commencez à jouer
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Quelques clics suffisent pour entrer dans l&apos;aventure
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            target={action.external ? "_blank" : "_self"}
                            rel={action.external ? "noopener noreferrer" : ""}
                            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="relative z-10">
                                <div
                                    className={`${action.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <action.icon className="w-6 h-6 text-white"/>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {action.description}
                                </p>
                                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                                    <span>Commencer</span>
                                    <ArrowRight
                                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                                </div>
                            </div>
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Prêt à jouer ?
                    </h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                        Rejoignez la plus grande communauté de Loup-Garou en ligne.
                        Créez des souvenirs inoubliables avec des amis du monde entier.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth"
                            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            S&apos;inscrire gratuitement
                        </Link>
                        <Link
                            href="/rules"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                            Découvrir les règles
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }

                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite;
                }
            `}</style>
        </div>
    );
}

export default Home;