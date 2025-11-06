'use client';
import {useEffect, useState} from "react";
import Image from "next/image";
import PlayButton from "@/components/common/button/playButton/PlayButton";
import {Moon, Users, Zap} from "lucide-react";


const Home = () => {

    const [gameCount, setGameCount] = useState(0);
    const [playersOnline, setPlayersOnline] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        setLoading(true);
        fetch('/api/game/list')
            .then(res => res.json())
            .then(data => {
                setGameCount(data.games.length);
                setPlayersOnline(data.playersOnline);
            })
            .catch(err => {
                setError('Failed to load data');
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900">
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="mb-12">
                    <div className="flex justify-center mb-6">
                        <div
                            className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-orange-300">
                            <Image src="/logo.png" alt="Loup-Garou Logo" width={64} height={64} />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                        Loup-Garou
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Plongez dans l'univers mystérieux du Loup-Garou. Créez des parties,
                        invitez vos amis et découvrez qui ment et qui dit la vérité.
                    </p>

                    <div className="mt-12 flex justify-center">
                        <PlayButton
                            href="/game/list"
                            label="Jouer Maintenant"
                            subtitle="Rejoignez une partie ou créez la vôtre"
                        />
                    </div>
                </div>

                {error && <div className="text-red-400 mt-2">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="card bg-base-100/10 backdrop-blur shadow-xl">
                        <div className="card-body items-center text-center">
                            <Users className="text-3xl mb-4" />
                            <h3 className="card-title text-white mb-2">Multijoueur</h3>
                            <p className="text-gray-300">Jusqu'à 18 joueurs par partie</p>
                        </div>
                    </div>

                    <div className="card bg-base-100/10 backdrop-blur shadow-xl">
                        <div className="card-body items-center text-center">
                            <Zap className="text-3xl mb-4" />
                            <h3 className="card-title text-white mb-2">Rapide</h3>
                            <p className="text-gray-300">Configuration en moins de 2 minutes</p>
                        </div>
                    </div>

                    <div className="card bg-base-100/10 backdrop-blur shadow-xl">
                        <div className="card-body items-center text-center">
                            <Moon className="text-3xl mb-4" />
                            <h3 className="card-title text-white mb-2">Immersif</h3>
                            <p className="text-gray-300">Ambiance mystérieuse et thématique</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 p-8 bg-base-100/5 rounded-2xl backdrop-blur max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Statistiques en direct</h2>
                    <div className="flex flex-col md:flex-row justify-around text-center space-y-6 md:space-y-0">
                        <div>
                            <div className="stat-value text-primary text-3xl">{gameCount}</div>
                            <div className="stat-desc text-gray-400">Parties en cours</div>
                        </div>
                        <div>
                            <div className="stat-value text-secondary text-3xl">{playersOnline}</div>
                            <div className="stat-desc text-gray-400">Joueurs connectés</div>
                        </div>
                        <div>
                            <div className="stat-value text-accent text-3xl">98%</div>
                            <div className="stat-desc text-gray-400">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;