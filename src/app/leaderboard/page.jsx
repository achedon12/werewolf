'use client';
import { useEffect, useState } from 'react';
import { Crown, Trophy, Medal, Star, Users, Target, TrendingUp, Award } from 'lucide-react';

const PodiumPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        switch (index) {
            case 0: return {
                height: 'h-28',
                color: 'bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600',
                glow: 'shadow-[0_0_30px_rgba(209,213,219,0.3)]',
                icon: Trophy,
                rank: '2ème',
                animation: 'animate-float-slow',
                positionClass: 'order-1'
            };
            case 1: return {
                height: 'h-40',
                color: 'bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-700',
                glow: 'shadow-[0_0_50px_rgba(234,179,8,0.5)]',
                icon: Crown,
                rank: '1er',
                animation: 'animate-float',
                positionClass: 'order-2'
            };
            case 2: return {
                height: 'h-24',
                color: 'bg-gradient-to-b from-orange-300 via-orange-500 to-orange-800',
                glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
                icon: Medal,
                rank: '3ème',
                animation: 'animate-float-slow-delayed',
                positionClass: 'order-3'
            };
            default: return {
                height: 'h-20',
                color: 'bg-gradient-to-b from-purple-400 to-purple-600',
                glow: '',
                icon: Star,
                rank: `${index + 1}ème`,
                animation: '',
                positionClass: ''
            };
        }
    };

    const calculateWinRate = (player) => {
        return player.games > 0 ? ((player.victories / player.games) * 100).toFixed(1) : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-gray-300">Chargement du classement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-error text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Erreur</h2>
                    <p className="text-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    const podiumPlayers = getPodiumOrder(leaderboard.slice(0, 3));

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 py-8">
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-10px) scale(1.02); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes float-slow-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes shine {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
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
                .shine-effect {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200% 100%;
                    animation: shine 3s infinite;
                }
            `}</style>

            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" />
                        <h1 className="text-5xl md:text-6xl font-bold text-white bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                            Classement
                        </h1>
                        <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" />
                    </div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Découvrez les meilleurs joueurs de Loup-Garou Online
                    </p>
                </div>

                <div className="max-w-6xl mx-auto mb-16">
                    <div className="flex justify-center items-end gap-2 md:gap-4 px-4 relative">
                        {podiumPlayers.map((player, index) => {
                            const position = getPodiumPosition(index);
                            const IconComponent = position.icon;

                            return (
                                <div
                                    key={player.id}
                                    className={`flex flex-col items-center flex-1 max-w-56 ${position.positionClass} ${position.animation}`}
                                >
                                    <div className={`w-full ${position.color} rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden border-2 ${
                                        index === 1 ? 'border-yellow-300' :
                                            index === 0 ? 'border-gray-300' : 'border-orange-300'
                                    } ${position.glow} transform transition-all duration-300 hover:scale-105`}>

                                        {index === 1 && (
                                            <>
                                                <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                                                <div className="absolute top-8 left-3 w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
                                                <div className="absolute bottom-4 right-4 w-2 h-2 bg-yellow-200 rounded-full animate-pulse delay-1000"></div>
                                            </>
                                        )}

                                        <div className="text-center relative z-10">
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                <IconComponent className={`h-8 w-8 ${
                                                    index === 1 ? 'text-yellow-300' :
                                                        index === 0 ? 'text-gray-300' : 'text-orange-300'
                                                }`} />
                                                <span className="font-bold text-xl">
                                                    {position.rank}
                                                </span>
                                            </div>

                                            <div className="flex justify-center mb-4">
                                                <div className={`relative ${
                                                    index === 1 ? 'w-24 h-24 ring-4 ring-yellow-300' :
                                                        index === 0 ? 'w-20 h-20 ring-2 ring-gray-300' :
                                                            'w-16 h-16 ring-2 ring-orange-300'
                                                } rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-lg`}>
                                                    {player.avatar ? (
                                                        <img
                                                            src={player.avatar}
                                                            alt={player.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Users className={`${
                                                            index === 1 ? 'h-10 w-10' : 'h-8 w-8'
                                                        } text-white/80`} />
                                                    )}
                                                    {index === 1 && (
                                                        <div className="absolute -top-2 -right-2">
                                                            <Crown className="h-6 w-6 text-yellow-300 animate-bounce" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className={`font-bold mb-2 truncate ${
                                                index === 1 ? 'text-2xl' : 'text-lg'
                                            }`}>
                                                @{player.nickname}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-black/20 rounded-lg p-2">
                                                    <div className="font-bold text-lg">{player.victories}</div>
                                                    <div className="text-white/70 text-xs">Victoires</div>
                                                </div>
                                                <div className="bg-black/20 rounded-lg p-2">
                                                    <div className="font-bold text-lg">{calculateWinRate(player)}%</div>
                                                    <div className="text-white/70 text-xs">Win Rate</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`w-4/5 ${position.height} ${position.color} rounded-b-lg relative mt-2 shadow-lg`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-b-lg"></div>
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                                            <span className={`font-bold text-sm ${
                                                index === 1 ? 'text-yellow-600' :
                                                    index === 0 ? 'text-gray-600' : 'text-orange-600'
                                            }`}>
                                                #{leaderboard.indexOf(player) + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="h-6 w-6 text-green-400" />
                                Classement Complet
                            </h2>

                            <div className="space-y-3">
                                {leaderboard.slice(3).map((player, index) => (
                                    <div
                                        key={player.id}
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 group hover:scale-105"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                                            <span className="font-bold text-white text-sm">
                                                #{index + 4}
                                            </span>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-white/30">
                                                {player.avatar ? (
                                                    <img
                                                        src={player.avatar}
                                                        alt={player.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Users className="h-6 w-6 text-white/80" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white truncate">
                                                @{player.nickname}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-6 text-right">
                                            <div className="text-center">
                                                <div className="text-white font-bold text-lg">
                                                    {player.victories}
                                                </div>
                                                <div className="text-gray-300 text-xs">Victoires</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-green-400 font-bold text-lg">
                                                    {calculateWinRate(player)}%
                                                </div>
                                                <div className="text-gray-300 text-xs">Win Rate</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-blue-400 font-bold text-lg">
                                                    {player.games}
                                                </div>
                                                <div className="text-gray-300 text-xs">Parties</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {leaderboard.length === 0 && (
                                <div className="text-center py-12">
                                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Aucun joueur dans le classement
                                    </h3>
                                    <p className="text-gray-300">
                                        Soyez le premier à apparaître ici !
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {leaderboard.length > 0 && (
                    <div className="max-w-2xl mx-auto mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20 hover:scale-105 transition-transform">
                                <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-yellow-400">
                                    {leaderboard[0]?.victories || 0}
                                </div>
                                <div className="text-gray-300 text-sm">Record de victoires</div>
                                <div className="text-white text-xs mt-1 truncate">
                                    @{leaderboard[0]?.nickname}
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20 hover:scale-105 transition-transform">
                                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-400">
                                    {leaderboard.reduce((max, player) => {
                                        const winRate = calculateWinRate(player);
                                        return Math.max(max, parseFloat(winRate));
                                    }, 0).toFixed(1)}%
                                </div>
                                <div className="text-gray-300 text-sm">Meilleur win rate</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20 hover:scale-105 transition-transform">
                                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-400">
                                    {leaderboard.reduce((total, player) => total + player.games, 0)}
                                </div>
                                <div className="text-gray-300 text-sm">Parties totales</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PodiumPage;