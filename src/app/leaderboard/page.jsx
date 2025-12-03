'use client';
import {useEffect, useState} from 'react';
import {Award, Crown, Medal, Sparkles, Target, TrendingUp, Trophy, Users} from 'lucide-react';

const PodiumPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/leaderboard');
                const data = await response.json();

                if (response.ok) {
                    setLeaderboard(data || []);
                } else {
                    setError('Erreur lors du chargement du classement');
                }
            } catch (err) {
                setError('Erreur de connexion');
                console.error('Erreur:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getPodiumOrder = (players) => {
        if (players.length < 3) return players;
        return [players[1], players[0], players[2]];
    };

    const getPodiumPosition = (index) => {
        const mobileConfig = {
            0: {
                height: 'h-16',
                gradient: 'from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700',
                gradientText: 'text-gray-600 dark:text-gray-300',
                icon: Trophy,
                rank: '2ème',
                animation: 'animate-float-slow',
                avatarSize: 'w-10 h-10',
                iconSize: 'h-4 w-4',
                textSize: 'text-sm',
                border: 'border-gray-300 dark:border-gray-400',
                borderAvatar: 'border-gray-300 dark:border-gray-400',
                podiumBg: 'from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700',
                podiumTopBg: 'from-gray-400/30 to-gray-500/50 dark:from-gray-400/20 dark:to-gray-500/40'
            },
            1: {
                height: 'h-20',
                gradient: 'from-yellow-400 to-yellow-600 dark:from-yellow-300 dark:to-yellow-500',
                gradientText: 'text-yellow-600 dark:text-yellow-300',
                icon: Crown,
                rank: '1er',
                animation: 'animate-float',
                avatarSize: 'w-12 h-12',
                iconSize: 'h-5 w-5',
                textSize: 'text-base',
                border: 'border-yellow-300 dark:border-yellow-400',
                borderAvatar: 'border-yellow-300 dark:border-yellow-400',
                podiumBg: 'from-yellow-400 to-yellow-600 dark:from-yellow-300 dark:to-yellow-500',
                podiumTopBg: 'from-yellow-400/30 to-yellow-500/50 dark:from-yellow-400/20 dark:to-yellow-500/40'
            },
            2: {
                height: 'h-14',
                gradient: 'from-orange-400 to-orange-600 dark:from-orange-300 dark:to-orange-500',
                gradientText: 'text-orange-600 dark:text-orange-300',
                icon: Medal,
                rank: '3ème',
                animation: 'animate-float-slow-delayed',
                avatarSize: 'w-8 h-8',
                iconSize: 'h-4 w-4',
                textSize: 'text-xs',
                border: 'border-orange-300 dark:border-orange-400',
                borderAvatar: 'border-orange-300 dark:border-orange-400',
                podiumBg: 'from-orange-400 to-orange-600 dark:from-orange-300 dark:to-orange-500',
                podiumTopBg: 'from-orange-400/30 to-orange-500/50 dark:from-orange-400/20 dark:to-orange-500/40'
            }
        };

        const desktopConfig = {
            0: {
                height: 'h-28 md:h-32 lg:h-36',
                gradient: 'from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700',
                gradientText: 'text-gray-600 dark:text-gray-300',
                icon: Trophy,
                rank: '2ème',
                animation: 'animate-float-slow',
                avatarSize: 'w-20 h-20 md:w-24 md:h-24',
                iconSize: 'h-6 w-6 md:h-8 md:w-8',
                textSize: 'text-lg md:text-xl',
                border: 'border-gray-300 dark:border-gray-400',
                borderAvatar: 'border-gray-300 dark:border-gray-400',
                podiumBg: 'from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700',
                podiumTopBg: 'from-gray-400/30 to-gray-500/50 dark:from-gray-400/20 dark:to-gray-500/40'
            },
            1: {
                height: 'h-32 md:h-40 lg:h-44',
                gradient: 'from-yellow-400 to-yellow-600 dark:from-yellow-300 dark:to-yellow-500',
                gradientText: 'text-yellow-600 dark:text-yellow-300',
                icon: Crown,
                rank: '1er',
                animation: 'animate-float',
                avatarSize: 'w-24 h-24 md:w-32 md:h-32',
                iconSize: 'h-8 w-8 md:h-10 md:w-10',
                textSize: 'text-xl md:text-2xl',
                border: 'border-yellow-300 dark:border-yellow-400',
                borderAvatar: 'border-yellow-300 dark:border-yellow-400',
                podiumBg: 'from-yellow-400 to-yellow-600 dark:from-yellow-300 dark:to-yellow-500',
                podiumTopBg: 'from-yellow-400/30 to-yellow-500/50 dark:from-yellow-400/20 dark:to-yellow-500/40'
            },
            2: {
                height: 'h-24 md:h-28 lg:h-32',
                gradient: 'from-orange-400 to-orange-600 dark:from-orange-300 dark:to-orange-500',
                gradientText: 'text-orange-600 dark:text-orange-300',
                icon: Medal,
                rank: '3ème',
                animation: 'animate-float-slow-delayed',
                avatarSize: 'w-16 h-16 md:w-20 md:h-20',
                iconSize: 'h-6 w-6 md:h-7 md:w-7',
                textSize: 'text-base md:text-lg',
                border: 'border-orange-300 dark:border-orange-400',
                borderAvatar: 'border-orange-300 dark:border-orange-400',
                podiumBg: 'from-orange-400 to-orange-600 dark:from-orange-300 dark:to-orange-500',
                podiumTopBg: 'from-orange-400/30 to-orange-500/50 dark:from-orange-400/20 dark:to-orange-500/40'
            }
        };

        const config = isMobile ? mobileConfig[index] : desktopConfig[index];

        return {
            ...config,
            positionClass: index === 0 ? 'order-1' : index === 1 ? 'order-2' : 'order-3'
        };
    };

    const calculateWinRate = (player) => {
        return player.games > 0 ? ((player.victories / player.games) * 100).toFixed(1) : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-slate-900/30 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-blue-600 dark:text-blue-400 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Chargement du classement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-slate-900/30 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-4xl md:text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Erreur</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{error}</p>
                </div>
            </div>
        );
    }

    const podiumPlayers = getPodiumOrder(leaderboard.slice(0, 3));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-slate-900/30 py-4 md:py-8">
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) scale(1);
                    }
                    50% {
                        transform: translateY(-8px) scale(1.02);
                    }
                }

                @keyframes float-slow {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-4px);
                    }
                }

                @keyframes float-slow-delayed {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-6px);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-float-slow {
                    animation: float-slow 4s ease-in-out infinite;
                }

                .animate-float-slow-delayed {
                    animation: float-slow-delayed 3.5s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
            `}</style>

            <div className="container mx-auto px-3 md:px-4">
                <div className="text-center mb-8 md:mb-12">
                    <div className="flex justify-center items-center gap-2 md:gap-4 mb-4 md:mb-6">
                        <div className="p-2 md:p-4 bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 rounded-xl md:rounded-2xl shadow-lg">
                            <Trophy className="h-5 w-5 md:h-8 md:w-8 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Classement
                        </h1>
                        <div className="p-2 md:p-4 bg-gradient-to-r from-orange-400 to-yellow-400 dark:from-orange-500 dark:to-yellow-500 rounded-xl md:rounded-2xl shadow-lg">
                            <Sparkles className="h-5 w-5 md:h-8 md:w-8 text-white" />
                        </div>
                    </div>
                    <p className="text-sm md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
                        Découvrez l'élite des joueurs de Loup-Garou
                    </p>
                </div>

                <div className="max-w-6xl mx-auto mb-8 md:mb-16">
                    <div className={`flex justify-center items-end gap-2 md:gap-4 lg:gap-8 px-1 md:px-4 relative ${
                        isMobile ? 'scale-90' : ''
                    }`}>
                        {podiumPlayers.map((player, index) => {
                            const position = getPodiumPosition(index);
                            const IconComponent = position.icon;

                            return (
                                <div
                                    key={player.id}
                                    className={`flex flex-col items-center flex-1 ${
                                        isMobile ? 'max-w-24' : 'max-w-48 lg:max-w-64'
                                    } ${position.positionClass} ${position.animation}`}
                                >
                                    <div
                                        className={`w-full bg-gradient-to-b ${position.gradient} rounded-lg md:rounded-2xl p-3 md:p-6 text-white shadow-lg md:shadow-2xl relative overflow-hidden border-2 ${position.border} transition-all duration-300`}
                                    >
                                        {index === 1 && !isMobile && (
                                            <>
                                                <div className="absolute top-1 md:top-2 right-1 md:right-2 w-2 h-2 md:w-3 md:h-3 bg-yellow-300 dark:bg-yellow-400 rounded-full animate-ping"></div>
                                                <div className="absolute top-4 md:top-8 left-2 md:left-3 w-1 h-1 md:w-2 md:h-2 bg-yellow-200 dark:bg-yellow-300 rounded-full animate-pulse"></div>
                                            </>
                                        )}

                                        <div className="text-center relative z-10">
                                            <div className="flex items-center justify-center gap-1 md:gap-2 mb-2 md:mb-4">
                                                <IconComponent className={`${position.iconSize} text-white`} />
                                                <span className={`font-bold ${position.textSize} text-white`}>
                                                    {position.rank}
                                                </span>
                                            </div>

                                            <div className="flex justify-center mb-2 md:mb-4">
                                                <div
                                                    className={`relative ${position.avatarSize} rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-lg border-2 ${position.borderAvatar}`}
                                                >
                                                    {player?.avatar ? (
                                                        <img
                                                            src={player.avatar}
                                                            alt={player.nickname}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Users className={`${
                                                            isMobile ? 'h-4 w-4' : 'h-6 w-6 md:h-8 md:w-8'
                                                        } text-white/80`} />
                                                    )}
                                                    {index === 1 && !isMobile && (
                                                        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2">
                                                            <Crown className="h-3 w-3 md:h-5 md:w-5 lg:h-6 lg:w-6 text-yellow-300 dark:text-yellow-200 animate-bounce" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className={`font-bold mb-1 md:mb-2 truncate ${position.textSize} text-white px-1`}>
                                                {isMobile ? player.nickname.substring(0, 8) + (player.nickname.length > 8 ? '...' : '') : `@${player.nickname}`}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-1 md:gap-2 text-xs">
                                                <div className="bg-black/20 dark:bg-white/10 rounded p-1 md:p-2">
                                                    <div className="font-bold text-sm md:text-lg">{player.victories}</div>
                                                    <div className="text-white/70 dark:text-white/80 text-[10px] md:text-xs">
                                                        Victoires
                                                    </div>
                                                </div>
                                                <div className="bg-black/20 dark:bg-white/10 rounded p-1 md:p-2">
                                                    <div className="font-bold text-sm md:text-lg">{calculateWinRate(player)}%</div>
                                                    <div className="text-white/70 dark:text-white/80 text-[10px] md:text-xs">
                                                        Win Rate
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`w-4/5 ${position.height} bg-gradient-to-b ${position.podiumBg} rounded-b-lg md:rounded-b-xl relative mt-1 md:mt-2 shadow-lg`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-white/10 to-transparent rounded-b-lg md:rounded-b-xl"></div>
                                        <div
                                            className={`absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 ${
                                                isMobile ? 'w-5 h-5' : 'w-6 h-6 md:w-8 md:h-8'
                                            } rounded-full bg-white dark:bg-gray-100 flex items-center justify-center shadow-md`}
                                        >
                                            <span className={`font-bold ${
                                                isMobile ? 'text-[10px]' : 'text-xs md:text-sm'
                                            } ${position.gradientText}`}>
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mb-8 md:mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="p-4 md:p-6">
                            <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                                <div className="p-1 md:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                                </div>
                                Classement Complet
                            </h2>

                            <div className="space-y-2 md:space-y-3">
                                {leaderboard.slice(3).map((player, index) => (
                                    <div
                                        key={player.id}
                                        className="flex items-center gap-2 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg md:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600"
                                    >
                                        <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-full flex-shrink-0">
                                            <span className="font-bold text-white text-xs md:text-sm">
                                                #{index + 4}
                                            </span>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-500 dark:to-purple-700 flex items-center justify-center overflow-hidden border border-white dark:border-gray-600 shadow-md">
                                                {player.avatar ? (
                                                    <img
                                                        src={player.avatar}
                                                        alt={player.nickname}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Users className="h-3 w-3 md:h-4 md:w-4 lg:h-6 lg:w-6 text-white/80" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm md:text-base">
                                                {isMobile ? player.nickname.substring(0, 10) + (player.nickname.length > 10 ? '...' : '') : `@${player.nickname}`}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-2 md:gap-4 lg:gap-6 text-right">
                                            <div className="text-center">
                                                <div className="text-gray-900 dark:text-white font-bold text-sm md:text-lg">
                                                    {player.victories}
                                                </div>
                                                <div className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs">
                                                    Victoires
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-green-600 dark:text-green-400 font-bold text-sm md:text-lg">
                                                    {calculateWinRate(player)}%
                                                </div>
                                                <div className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs">
                                                    Win Rate
                                                </div>
                                            </div>
                                            {!isMobile && (
                                                <div className="text-center">
                                                    <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                        {player.games}
                                                    </div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                                                        Parties
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {leaderboard.length === 0 && (
                                <div className="text-center py-6 md:py-12">
                                    <Target className="h-8 w-8 md:h-12 md:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2 md:mb-4" />
                                    <h3 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">
                                        Aucun joueur dans le classement
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                                        Soyez le premier à apparaître ici !
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {leaderboard.length > 0 && (
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl">
                                <div className="p-2 md:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl md:rounded-2xl w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 flex items-center justify-center">
                                    <Award className="h-4 w-4 md:h-6 md:w-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="text-xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1 md:mb-2">
                                    {leaderboard[0]?.victories || 0}
                                </div>
                                <div className="text-gray-600 dark:text-gray-300 font-medium text-xs md:text-sm mb-1">
                                    Record de victoires
                                </div>
                                <div className="text-gray-900 dark:text-white text-xs truncate">
                                    {isMobile ? leaderboard[0]?.nickname.substring(0, 8) + '...' : `@${leaderboard[0]?.nickname}`}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl">
                                <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-xl md:rounded-2xl w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 md:mb-2">
                                    {leaderboard.reduce((max, player) => {
                                        const winRate = calculateWinRate(player);
                                        return Math.max(max, parseFloat(winRate));
                                    }, 0).toFixed(1)}%
                                </div>
                                <div className="text-gray-600 dark:text-gray-300 font-medium text-xs md:text-sm">
                                    Meilleur win rate
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow hover:shadow-xl">
                                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl md:rounded-2xl w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 flex items-center justify-center">
                                    <Users className="h-4 w-4 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 md:mb-2">
                                    {leaderboard.reduce((total, player) => total + player.games, 0)}
                                </div>
                                <div className="text-gray-600 dark:text-gray-300 font-medium text-xs md:text-sm">
                                    Parties totales
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PodiumPage;