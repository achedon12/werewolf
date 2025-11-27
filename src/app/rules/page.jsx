"use client";
import RoleCard from "@/components/role/RoleCard";
import {useState} from "react";
import {roles} from "@/utils/Roles";
import {Moon, Sun, Users, Clock, Settings, Filter, BookOpen, Trophy, Swords, Shield} from "lucide-react";

const filters = [
    {label: "Tous", value: "all", color: "from-blue-500 to-purple-500", icon: "🔮"},
    {label: "Village", value: "village", color: "from-green-500 to-emerald-500", icon: "🏠"},
    {label: "Loups", value: "wolves", color: "from-red-500 to-orange-500", icon: "🐺"},
    {label: "Spécial", value: "special", color: "from-yellow-500 to-amber-500", icon: "⭐"},
]

const getFilteredRoles = (roles, filter) => {
    if (filter === "all") return roles;
    if (filter === "village") return roles.filter(role => role.team === "Équipe du Village");
    if (filter === "wolves") return roles.filter(role => role.team === "Équipe des Loups");
    if (filter === "special") return roles.filter(role => role.team === "Spécial");
    return roles;
}

const RulesPage = () => {
    const [activeFilter, setActiveFilter] = useState("all");
    const filteredRoles = getFilteredRoles(roles, activeFilter);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-slate-900 py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6 ring-4 ring-purple-200 dark:ring-purple-900/30">
                        <span className="text-4xl">🐺</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
                        Règles du Loup-Garou
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Maîtrisez l'art du mensonge et de la déduction dans ce jeu légendaire
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                                        <BookOpen className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Comment jouer ?
                                    </h2>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-blue-500" />
                                            Préparation du jeu
                                        </h3>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                            <ul className="space-y-3 text-blue-800 dark:text-blue-200">
                                                {[
                                                    "Groupez 7 joueurs ou plus (un nombre impair fonctionne mieux)",
                                                    "Construisez le deck avec : 1 Modérateur, 1 Voyante, 1 Docteur et 2 Loups-Garous",
                                                    "Pour plus de 15 joueurs, ajoutez un loup-garou supplémentaire",
                                                    "Mélangez et distribuez les cartes face cachée"
                                                ].map((item, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                                                    <Moon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <h4 className="font-bold text-xl text-blue-900 dark:text-blue-100">
                                                    Phase de Nuit
                                                </h4>
                                            </div>
                                            <ol className="space-y-3 text-blue-800 dark:text-blue-200">
                                                {[
                                                    "Modérateur : 'Tout le monde ferme les yeux'",
                                                    "Loups-Garous : Choisissent une victime",
                                                    "Docteur : Soigne un joueur",
                                                    "Voyante : Découvre une identité"
                                                ].map((item, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <span className="font-bold text-blue-600 dark:text-blue-400">{index + 1}.</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>

                                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-orange-100 dark:bg-orange-800/30 rounded-lg">
                                                    <Sun className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <h4 className="font-bold text-xl text-orange-900 dark:text-orange-100">
                                                    Phase de Jour
                                                </h4>
                                            </div>
                                            <ol className="space-y-3 text-orange-800 dark:text-orange-200">
                                                {[
                                                    "Annonce des événements de la nuit",
                                                    "Discussion pour identifier les loups",
                                                    "Accusations entre joueurs",
                                                    "Vote pour éliminer un suspect"
                                                ].map((item, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <span className="font-bold text-orange-600 dark:text-orange-400">{index + 1}.</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                            <Trophy className="w-5 h-5 text-green-500" />
                                            Conditions de victoire
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Swords className="w-6 h-6 text-red-600 dark:text-red-400" />
                                                    <h4 className="font-bold text-lg text-red-900 dark:text-red-100">
                                                        Loups-Garous gagnent si :
                                                    </h4>
                                                </div>
                                                <p className="text-red-700 dark:text-red-300">
                                                    Nombre de loups ≥ villageois restants
                                                </p>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                    <h4 className="font-bold text-lg text-green-900 dark:text-green-100">
                                                        Villageois gagnent si :
                                                    </h4>
                                                </div>
                                                <p className="text-green-700 dark:text-green-300">
                                                    Tous les loups-garous sont éliminés
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border-l-4 border-yellow-400">
                                        <h4 className="font-bold text-yellow-900 dark:text-yellow-100 text-lg mb-3 flex items-center gap-2">
                                            💡 Conseil du modérateur
                                        </h4>
                                        <p className="text-yellow-800 dark:text-yellow-200">
                                            Imposez 5 minutes maximum par phase de jour et appez toujours les rôles dans le même ordre chaque nuit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Répartition recommandée
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        {players: "7-10 joueurs", roles: "2 Loups, 1 Voyante, 1 Docteur, 3-6 Villageois"},
                                        {players: "11-15 joueurs", roles: "3 Loups, 1 Voyante, 1 Docteur, 1 Sorcière, 5-9 Villageois"},
                                        {players: "16+ joueurs", roles: "4+ Loups, tous rôles spéciaux, reste Villageois"}
                                    ].map((item, index) => (
                                        <div key={index} className="border-l-4 border-green-500 pl-4 py-1">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.players}</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{item.roles}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Durée de jeu
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">7-10 joueurs</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">15-20 min</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">10-15 joueurs</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">30-40 min</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            🎴 Tous les Rôles
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Explorez les pouvoirs uniques de chaque personnage
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {filters.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setActiveFilter(f.value)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                    activeFilter === f.value
                                        ? `bg-gradient-to-r ${f.color} text-white shadow-lg`
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                <span className="mr-2">{f.icon}</span>
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRoles.map((role) => (
                            <RoleCard
                                key={role.id}
                                roleName={role.name}
                                description={role.description}
                                imageUrl={role.image}
                                team={role.team}
                                nightAction={role.nightAction}
                                strategy={role.strategy}
                            />
                        ))}
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl">
                                <Settings className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Types de parties
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                                <h3 className="font-bold text-purple-800 dark:text-purple-300 text-xl mb-3">Partie Classique</h3>
                                <p className="text-purple-700 dark:text-purple-400">
                                    Composition automatique des rôles selon les recommandations officielles. Idéal pour une expérience équilibrée.
                                </p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-xl mb-3">Partie Personnalisée</h3>
                                <p className="text-blue-700 dark:text-blue-400">
                                    Choisissez librement chaque rôle. Parfait pour expérimenter de nouvelles stratégies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RulesPage;