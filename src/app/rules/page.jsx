"use client";
import RoleCard from "@/components/role/RoleCard";
import {useState} from "react";

const roles = [
    {
        id: 1,
        name: "Loup-Garou",
        team: "Équipe des Loups",
        description: "Chaque nuit, vous vous réveillez avec les autres loups pour choisir une victime à éliminer. Pendant le jour, vous devez mentir et vous faire passer pour un villageois.",
        image: "/cards/loup.jpeg",
        nightAction: "Choisit une victime avec les autres loups-garous",
        strategy: "Restez calme et mélangez-vous aux villageois. Ne soyez pas trop agressif dans vos accusations."
    },
    {
        id: 2,
        name: "Voyante",
        team: "Équipe du Village",
        description: "Chaque nuit, vous pouvez découvrir si un joueur est un loup-garou ou non. Utilisez cette information avec sagesse pour guider le village.",
        image: "/cards/voyante.webp",
        nightAction: "Désigne un joueur pour découvrir son affiliation",
        strategy: "Ne révélez pas votre identité trop tôt. Vérifiez les joueurs suspects ou ceux qui parlent beaucoup."
    },
    {
        id: 3,
        name: "Villageois",
        team: "Équipe du Village",
        description: "Vous n'avez aucun pouvoir spécial. Utilisez votre sens de l'observation et de la déduction pour identifier les loups-garous pendant les débats.",
        image: "/cards/villageois.jpeg",
        nightAction: "Aucune action nocturne",
        strategy: "Soyez attentif aux contradictions et aux comportements suspects. Votez avec sagesse."
    },
    {
        id: 5,
        name: "Sorcière",
        team: "Équipe du Village",
        description: "Vous disposez d'une potion de vie pour sauver une victime et d'une potion de mort pour éliminer un joueur. Vous ne pouvez utiliser chaque potion qu'une seule fois.",
        image: "/cards/sorciere.jpeg",
        nightAction: "Peut sauver ou empoisonner un joueur",
        strategy: "Utilisez vos potions au moment optimal. Sauvez la Voyante ou éliminez un loup confirmé."
    },
    {
        id: 6,
        name: "Chasseur",
        team: "Équipe du Village",
        description: "Lorsque vous êtes éliminé, vous avez le pouvoir d'emporter un autre joueur avec vous dans la mort. Choisissez judicieusement !",
        image: "/cards/chasseur.jpeg",
        nightAction: "Aucune action nocturne",
        strategy: "Si vous êtes sur le point d'être éliminé, essayez de prendre un loup-garou avec vous."
    },
    {
        id: 7,
        name: "Cupidon",
        team: "Spécial",
        description: "La première nuit, vous créez un lien d'amour entre deux joueurs. Si l'un des deux meurt, l'autre meurt de chagrin.",
        image: "/cards/cupidon.jpeg",
        nightAction: "Crée un lien entre deux joueurs (première nuit seulement)",
        strategy: "Choisissez des joueurs qui ne se suspectent pas mutuellement pour créer des alliances intéressantes."
    },
    {
        id: 8,
        name: "Loup-Garou Blanc",
        team: "Équipe des Loups",
        description: "Vous êtes un loup-garou solitaire avec le pouvoir de tuer un autre loup-garou une nuit sur deux. Votre objectif est de rester le dernier loup debout.",
        image: "/cards/loupGarouBlanc.jpeg",
        nightAction: "Peut tuer un autre loup-garou chaque nuit",
        strategy: "Restez discret et évitez d'attirer l'attention. Tuez les loups-garous les plus menaçants."
    },
    {
        id: 9,
        name: "Petite Fille",
        team: "Équipe du Village",
        description: "Peut voir un mot sur deux dans le chat des loups-garous pendant la nuit, mais si elle est découverte, elle est éliminée immédiatement.",
        image: "/cards/petiteFille.jpeg",
        nightAction: "Peut espionner les loups-garous (risque d'élimination)",
        strategy: "Soyez très discrète lorsque vous espionnez. Ne vous faites pas remarquer par les loups-garous."
    },
    {
        id: 10,
        name: "Sœur",
        team: "Équipe du Village",
        description: "Vous êtes deux et vous connaissez l'identité de l'autre. Vous pouvez discuter constamment à l'aide d'un canal privé.",
        image: "/cards/soeur.jpeg",
        nightAction: "Aucune action nocturne",
        strategy: "Utilisez votre connaissance mutuelle pour guider les décisions du village."
    },
    {
        id: 11,
        name: "Voleur",
        team: "Spécial",
        description: "Au début du jeu, vous pouvez échanger une carte d'un joueur avec un autre, vous inclu. Choisissez judicieusement pour maximiser vos chances de gagner.",
        image: "/cards/voleur.jpeg",
        nightAction: "Peut échanger sa carte avec un autre joueur au début du jeu",
        strategy: "Observez les cartes non distribuées et choisissez celle qui vous donne le meilleur avantage."
    },
    {
        id: 12,
        name: "Garde",
        team: "Équipe du Village",
        description: "Vous pouvez protéger un joueur chaque nuit, le rendant immunisé contre les attaques des loups-garous. Vous ne pouvez pas protéger 2 fois d'affilé la même personne.",
        image: "/cards/garde.jpeg",
        nightAction: "Peut protéger un joueur chaque nuit",
        strategy: "Protégez les joueurs clés comme la Voyante ou le Docteur pour maximiser votre impact."
    },
    {
        id: 13,
        name: "Servante Dévouée",
        team: "Équipe du Village",
        description: "Vous pouvez choisir de prendre récupérer la carte d'un autre joueur si celui-ci est éliminé. Vous devenez alors ce rôle.",
        image: "/cards/servanteDevouee.jpeg",
        nightAction: "Peut prendre la carte d'un joueur éliminé",
        strategy: "Choisissez judicieusement le joueur dont vous prenez la carte pour maximiser vos chances de gagner."
    },
    {
        id: 14,
        name: "Enfant Sauvage",
        team: "Équipe du Village",
        description: "Vous débutez le jeu en en choisissant un modèle parmi les autres joueurs. Si ce joueur est éliminé, vous devenez un loup-garou.",
        image: "/cards/enfantSauvage.jpeg",
        nightAction: "Aucune action nocturne",
        strategy: "Choisissez un joueur qui a de bonnes chances de survie pour éviter de devenir un loup-garou trop tôt."
    },
    // renard
    {
        id: 15,
        name: "Renard",
        team: "Équipe du Village",
        description: "Chaque nuit, vous pouvez choisir un joueur. Si ce joueur est un loup-garou, vous le découvrez. Si ce n'est pas un loup-garou, vous perdez votre capacité de détection pour la nuit suivante.",
        image: "/cards/renard.jpeg",
        nightAction: "Peut détecter si un joueur est un loup-garou",
        strategy: "Utilisez votre capacité avec prudence pour maximiser vos chances de découvrir les loups-garous."
    },
    {
        id: 16,
        name: "Montreur d'Ours",
        team: "Spécial",
        description: "A l'aube, si l'ours est en vie, il grogne si au moins un loup-garou se trouve autour de lui. Il ne sait pas qui sont les loups-garous, seulement s'il y en a à proximité.",
        image: "/cards/montreurOurs.jpeg",
        nightAction: "Grognement si un loup-garou est proche à l'aube",
        strategy: "Utilisez les informations de l'ours pour guider vos décisions, mais soyez prudent car il ne sait pas qui sont les loups-garous."
    }
];

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
                                <div>
                                    <p className="text-sm text-gray-600"><strong>15-20+ joueurs :</strong> 45-60 minutes
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Configuration Rapide</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Pour débutants :</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                <li>1 Modérateur</li>
                                <li>2 Loups-Garous</li>
                                <li>1 Voyante</li>
                                <li>1 Docteur</li>
                                <li>3+ Villageois</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Pour experts :</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                <li>Ajoutez la Sorcière et le Chasseur</li>
                                <li>Incluez Cupidon pour des alliances complexes</li>
                                <li>Ajoutez le Loup-Garou Alpha pour plus de défi</li>
                                <li>Expérimentez avec des rôles neutres</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RulesPage;