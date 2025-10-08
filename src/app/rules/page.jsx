"use client";
import RoleCard from "@/components/role/RoleCard";
import {useState} from "react";
import {roles} from "@/utils/Roles";

const filters = [
    {label: "Tous", value: "all"},
    {label: "Village", value: "village"},
    {label: "Loups", value: "wolves"},
    {label: "Spécial", value: "special"},
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Règles du Loup-Garou
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Apprenez les règles et découvrez tous les rôles de ce jeu de déduction et de trahison
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">📜 Comment jouer ?</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Préparation du jeu</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        <li>Groupez <strong>7 joueurs ou plus</strong> (un nombre impair fonctionne
                                            mieux) :cite[1]
                                        </li>
                                        <li>Construisez le deck de rôles avec au minimum : 1 Modérateur, 1 Voyante, 1
                                            Docteur et 2 Loups-Garous :cite[1]
                                        </li>
                                        <li>Pour plus de 15 joueurs, ajoutez un loup-garou supplémentaire pour chaque
                                            groupe de 4 joueurs :cite[1]
                                        </li>
                                        <li>Mélangez et distribuez les cartes face cachée. Chaque joueur regarde
                                            secrètement sa carte :cite[1]
                                        </li>
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-bold text-lg text-blue-800 mb-3">🌙 Phase de Nuit</h4>
                                        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                                            <li>Le modérateur dit : <em>"Tout le monde ferme les yeux"</em></li>
                                            <li><strong>Loups-Garous</strong> : S'éveillent et choisissent une victime
                                                :cite[1]
                                            </li>
                                            <li><strong>Docteur</strong> : Choisit un joueur à soigner :cite[1]</li>
                                            <li><strong>Voyante</strong> : Découvre l'identité d'un joueur :cite[1]</li>
                                        </ol>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-bold text-lg text-green-800 mb-3">☀️ Phase de Jour</h4>
                                        <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
                                            <li>Le modérateur annonce les événements de la nuit</li>
                                            <li><strong>Discussion</strong> : Les joueurs débattent pour identifier les
                                                loups :cite[1]
                                            </li>
                                            <li><strong>Accusations</strong> : Les joueurs peuvent accuser d'autres
                                                joueurs
                                            </li>
                                            <li><strong>Vote</strong> : Majorité requise pour éliminer un suspect
                                                :cite[1]
                                            </li>
                                        </ol>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Conditions de victoire</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <h4 className="font-bold text-red-800">🐺 Les Loups-Garous gagnent si :</h4>
                                            <p className="text-red-700 text-sm">Le nombre de loups-garous égale ou
                                                dépasse le nombre de villageois restants :cite[1]:cite[7]</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-bold text-green-800">👨‍🌾 Les Villageois gagnent si
                                                :</h4>
                                            <p className="text-green-700 text-sm">Tous les loups-garous sont identifiés
                                                et éliminés :cite[1]:cite[7]</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                    <h4 className="font-bold text-yellow-800 mb-2">💡 Conseil du modérateur</h4>
                                    <p className="text-yellow-700 text-sm">
                                        Pour garder le jeu dynamique, imposez une limite de temps de 5 minutes pour
                                        chaque phase de jour :cite[1].
                                        Appelez toujours les rôles dans le même ordre chaque nuit pour éviter la
                                        confusion :cite[7].
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Répartition recommandée</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700">7-10 joueurs :</h4>
                                    <p className="text-sm text-gray-600">2 Loups, 1 Voyante, 1 Docteur, 3-6
                                        Villageois</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700">11-15 joueurs :</h4>
                                    <p className="text-sm text-gray-600">3 Loups, 1 Voyante, 1 Docteur, 1 Sorcière, 5-9
                                        Villageois</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700">16+ joueurs :</h4>
                                    <p className="text-sm text-gray-600">4+ Loups, tous les rôles spéciaux, reste en
                                        Villageois</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">⏱️ Durée de jeu</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600"><strong>7-10 joueurs :</strong> 15-20 minutes
                                        :cite[7]</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600"><strong>10-15 joueurs :</strong> 30-40 minutes
                                        :cite[7]</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎴 Tous les Rôles</h2>
                        <p className="text-gray-600">Découvrez les pouvoirs et stratégies de chaque rôle</p>
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                        {filters.map(f => {
                            let colorClass = "";
                            if (f.value === "village") colorClass = "btn-success";
                            else if (f.value === "wolves") colorClass = "btn-error";
                            else if (f.value === "special") colorClass = "btn-warning";
                            else colorClass = "btn-primary";

                            return (
                                <button
                                    key={f.value}
                                    className={`btn ${activeFilter === f.value ? "btn-active" : "btn-outline"} ${colorClass}`}
                                    onClick={() => setActiveFilter(f.value)}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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


                <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">🎲 Types de parties & configuration</h2>
                    <div className="space-y-4 text-gray-700">
                        <p>
                            Sur cette plateforme, vous pouvez créer deux types de parties :
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>
                                <strong>Partie Classique</strong> : La composition des rôles est automatiquement adaptée au nombre de joueurs, selon les recommandations officielles du jeu. Idéal pour une expérience équilibrée et rapide à mettre en place.
                            </li>
                            <li>
                                <strong>Partie Personnalisée</strong> : Vous choisissez librement la répartition des rôles parmi tous ceux disponibles. Parfait pour expérimenter de nouvelles stratégies ou jouer avec des variantes maison.
                            </li>
                        </ul>
                        <p>
                            <span className="font-semibold text-purple-700">En mode classique</span>, la configuration est optimisée pour garantir l’équilibre entre les Loups-Garous et les Villageois, avec l’ajout automatique des rôles spéciaux selon le nombre de participants.
                        </p>
                        <p>
                            <span className="font-semibold text-blue-700">En mode personnalisé</span>, vous pouvez ajuster chaque rôle à votre convenance, dans la limite du nombre de joueurs maximum. Attention à bien équilibrer la partie pour garder tout l’intérêt du jeu !
                        </p>
                        <p>
                            Retrouvez ci-dessous les règles générales, les conseils de configuration et la liste complète des rôles pour vous aider à préparer votre partie idéale.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RulesPage;