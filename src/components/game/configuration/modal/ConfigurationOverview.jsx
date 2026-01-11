import {useEffect, useState} from 'react';
import Image from 'next/image';
import {roles} from "@/utils/Roles";
import {CircleX, Cog} from "lucide-react";

const ConfigurationOverviewModal = ({ show, close = () => {}, game }) => {
    const [configuration, setConfiguration] = useState({});
    const [wolfNumber, setWolfNumber] = useState(0);
    const [villagerNumber, setVillagerNumber] = useState(0);
    const [specialNumber, setSpecialNumber] = useState(0);

    useEffect(() => {
        if (!game) return;
        setConfiguration(JSON.parse(game.configuration));
    }, [game]);

    useEffect(() => {
        if (!configuration) return;
        let wolves = 0;
        let villagers = 0;
        let specials = 0;

        Object.keys(configuration).forEach(key => {
            const role = roles.find(r => r.id === Number(key));
            if (!role || configuration[key] <= 0) return;
            if (role.team === 'Équipe des Loups') {
                wolves += 1
            } else if (role.team === 'Équipe du Village') {
                villagers += 1
            } else if (role.team === 'Spécial'){
                specials += 1
            }
        });
        setWolfNumber(wolves);
        setVillagerNumber(villagers);
        setSpecialNumber(specials);
    }, [configuration]);

    if (!show || !game) return null;

    return (
        <div className="modal modal-open z-[100]">
            <div
                className="modal-backdrop fixed inset-0 bg-black/80 backdrop-blur-lg"
                onClick={close}
            />

            <div className="modal-box max-w-none w-full h-screen rounded-none bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <div className="sticky top-0 z-10 bg-base-200/80 backdrop-blur-lg border-b border-white/10 p-6">
                    <div className="flex justify-between items-center max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-3xl text-purple-400 font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                                <Cog className="inline mr-2" size={32} />
                                Configuration de la Partie
                            </h2>
                            <p className="text-gray-300 mt-2">
                                {game.name} - {Object.values(configuration).reduce((a, b) => a + b, 0)} joueurs
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                className="btn btn-circle btn-ghost hover:bg-red-500/20 hover:text-red-400 transition-all"
                                onClick={close}
                            >
                                <CircleX className="text-2xl" size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="stat bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="stat-title text-gray-300">Total Joueurs</div>
                            <div className="stat-value text-primary text-2xl">
                                {Object.values(configuration).reduce((a, b) => a + b, 0)}
                            </div>
                        </div>
                        <div className="stat bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="stat-title text-gray-300">Rôles Uniques</div>
                            <div className="stat-value text-secondary text-2xl">
                                {specialNumber}
                            </div>
                        </div>
                        <div className="stat bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="stat-title text-gray-300">Villageois</div>
                            <div className="stat-value text-accent text-2xl">
                                {villagerNumber}
                            </div>
                        </div>
                        <div className="stat bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="stat-title text-gray-300">Loups-Garous</div>
                            <div className="stat-value text-red-400 text-2xl">
                                {wolfNumber}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {roles
                            .filter(role => configuration[role.id] > 0)
                            .sort((a, b) => configuration[b.id] - configuration[a.id])
                            .map(role => (
                                <div
                                    key={role.id}
                                    className="group relative p-6 bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                                >
                                    <div className="absolute -top-3 -right-3 z-10">
                                        <div className="badge badge-lg badge-primary text-lg font-bold px-3 py-2 shadow-lg">
                                            x{configuration[role.id]}
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
                                                <Image
                                                    src={role.image}
                                                    alt={role.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-base-200 ${
                                                role.team === 'Équipe des Loups' ? 'bg-red-500' :
                                                    role.team === 'Équipe du Village' ? 'bg-green-500' :
                                                        'bg-yellow-500'
                                            }`}></div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                                                {role.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                                {role.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                            <span className={`badge badge-sm ${
                                                role.team === 'Équipe des Loups' ? 'badge-error' :
                                                    role.team === 'Équipe du Village' ? 'badge-success' :
                                                        'badge-warning'
                                            }`}>
                                                {role.team === 'Équipe des Loups' ? '🐺 Loup' :
                                                    role.team === 'Équipe du Village' ? '🏠 Villageois' :
                                                        '⭐ Spécial'}
                                            </span>
                                                <span className="badge badge-sm badge-outline">
                                                {role.nightAction ? '🌙 Nuit' : '☀️ Jour'}
                                            </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            ))}
                    </div>

                    {Object.keys(configuration).filter(key => configuration[key] > 0).length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-base-200/30 flex items-center justify-center">
                                <span className="text-6xl">🎴</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Aucun rôle configuré</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                La partie n&apos;a pas encore de configuration de rôles.
                                Les rôles seront attribués aléatoirement.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConfigurationOverviewModal;