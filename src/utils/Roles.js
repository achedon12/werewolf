export const roles = [
    {
        id: 1,
        name: "Loup-Garou",
        team: "Équipe des Loups",
        description: "Chaque nuit, vous vous réveillez avec les autres loups pour choisir une victime à éliminer. Pendant le jour, vous devez mentir et vous faire passer pour un villageois.",
        image: "/cards/loup.jpeg",
        nightAction: "Choisit une victime avec les autres loups-garous",
        strategy: "Restez calme et mélangez-vous aux villageois. Ne soyez pas trop agressif dans vos accusations."
    }, // loup-garou
    {
        id: 2,
        name: "Voyante",
        team: "Équipe du Village",
        description: "Chaque nuit, vous pouvez découvrir si un joueur est un loup-garou ou non. Utilisez cette information avec sagesse pour guider le village.",
        image: "/cards/voyante.jpeg",
        nightAction: "Désigne un joueur pour découvrir son affiliation",
        strategy: "Ne révélez pas votre identité trop tôt. Vérifiez les joueurs suspects ou ceux qui parlent beaucoup."
    }, // voyante
    {
        id: 3,
        name: "Villageois",
        team: "Équipe du Village",
        description: "Vous n'avez aucun pouvoir spécial. Utilisez votre sens de l'observation et de la déduction pour identifier les loups-garous pendant les débats.",
        image: "/cards/villageois.jpeg",
        nightAction: "Aucune action nocturne",
        strategy: "Soyez attentif aux contradictions et aux comportements suspects. Votez avec sagesse."
    }, // villageois
    {
        id: 5,
        name: "Sorciere",
        team: "Équipe du Village",
        description: "Vous disposez d'une potion de vie pour sauver une victime et d'une potion de mort pour éliminer un joueur. Vous ne pouvez utiliser chaque potion qu'une seule fois.",
        image: "/cards/sorciere.jpeg",
        nightAction: "Peut sauver ou empoisonner un joueur",
        strategy: "Utilisez vos potions au moment optimal. Sauvez la Voyante ou éliminez un loup confirmé."
    }, // sorcière
    {
        id: 6,
        name: "Chasseur",
        team: "Équipe du Village",
        description: "Lorsque vous êtes éliminé, vous avez le pouvoir d'emporter un autre joueur avec vous dans la mort. Choisissez judicieusement !",
        image: "/cards/chasseur.jpeg",
        nightAction: "Aucune action nocturne",
        strategy: "Si vous êtes sur le point d'être éliminé, essayez de prendre un loup-garou avec vous."
    }, // chasseur
    {
        id: 7,
        name: "Cupidon",
        team: "Spécial",
        description: "La première nuit, vous créez un lien d'amour entre deux joueurs. Si l'un des deux meurt, l'autre meurt de chagrin.",
        image: "/cards/cupidon.jpeg",
        nightAction: "Crée un lien entre deux joueurs (première nuit seulement)",
        strategy: "Choisissez des joueurs qui ne se suspectent pas mutuellement pour créer des alliances intéressantes."
    }, // cupidon
    {
        id: 8,
        name: "Loup-Garou Blanc",
        team: "Équipe des Loups",
        description: "Vous êtes un loup-garou solitaire avec le pouvoir de tuer un autre loup-garou une nuit sur deux. Votre objectif est de rester le dernier loup debout.",
        image: "/cards/loupGarouBlanc.jpeg",
        nightAction: "Peut tuer un autre loup-garou chaque nuit",
        strategy: "Restez discret et évitez d'attirer l'attention. Tuez les loups-garous les plus menaçants."
    }, // loup-garou blanc
    {
        id: 9,
        name: "Petite Fille",
        team: "Équipe du Village",
        description: "Peut voir un mot sur deux dans le chat des loups-garous pendant la nuit, mais si elle est découverte, elle est éliminée immédiatement.",
        image: "/cards/petiteFille.jpeg",
        nightAction: "Peut espionner les loups-garous (risque d'élimination)",
        strategy: "Soyez très discrète lorsque vous espionnez. Ne vous faites pas remarquer par les loups-garous."
    }, // petite fille
    {
        id: 10,
        name: "Sœur",
        team: "Équipe du Village",
        description: "Vous êtes deux et vous connaissez l'identité de l'autre. Vous pouvez discuter constamment à l'aide d'un canal privé.",
        image: "/cards/soeur.jpeg",
        nightAction: "Aucune action nocturne",
        strategy: "Utilisez votre connaissance mutuelle pour guider les décisions du village."
    }, // soeur
    {
        id: 11,
        name: "Voleur",
        team: "Spécial",
        description: "Au début du jeu, vous pouvez échanger une carte d'un joueur avec un autre, vous inclu. Choisissez judicieusement pour maximiser vos chances de gagner.",
        image: "/cards/voleur.jpeg",
        nightAction: "Peut échanger sa carte avec un autre joueur au début du jeu",
        strategy: "Observez les cartes non distribuées et choisissez celle qui vous donne le meilleur avantage."
    }, // voleur
    {
        id: 12,
        name: "Salvateur",
        team: "Équipe du Village",
        description: "Vous pouvez protéger un joueur chaque nuit, le rendant immunisé contre les attaques des loups-garous. Vous ne pouvez pas protéger 2 fois d'affilé la même personne.",
        image: "/cards/salvateur.jpeg",
        nightAction: "Peut protéger un joueur chaque nuit",
        strategy: "Protégez les joueurs clés comme la Voyante ou le Docteur pour maximiser votre impact."
    }, // salvateur
    {
        id: 13,
        name: "Servante Dévouée",
        team: "Équipe du Village",
        description: "Vous pouvez choisir de prendre récupérer la carte d'un autre joueur si celui-ci est éliminé. Vous devenez alors ce rôle.",
        image: "/cards/servanteDevouee.jpeg",
        nightAction: "Peut prendre la carte d'un joueur éliminé",
        strategy: "Choisissez judicieusement le joueur dont vous prenez la carte pour maximiser vos chances de gagner."
    }, // servante dévouée
    {
        id: 14,
        name: "Enfant Sauvage",
        team: "Équipe du Village",
        description: "Vous débutez le jeu en en choisissant un modèle parmi les autres joueurs. Si ce joueur est éliminé, vous devenez un loup-garou.",
        image: "/cards/enfantSauvage.jpeg",
        nightAction: "Aucune action nocturne",
        strategy: "Choisissez un joueur qui a de bonnes chances de survie pour éviter de devenir un loup-garou trop tôt."
    }, // enfant sauvage
    {
        id: 15,
        name: "Renard",
        team: "Équipe du Village",
        description: "Chaque nuit, vous pouvez choisir un joueur. Si ce joueur est un loup-garou, vous le découvrez. Si ce n'est pas un loup-garou, vous perdez votre capacité de détection pour la nuit suivante.",
        image: "/cards/renard.jpeg",
        nightAction: "Peut détecter si un joueur est un loup-garou",
        strategy: "Utilisez votre capacité avec prudence pour maximiser vos chances de découvrir les loups-garous."
    }, // renard
    {
        id: 16,
        name: "Montreur d'Ours",
        team: "Spécial",
        description: "A l'aube, si l'ours est en vie, il grogne si au moins un loup-garou se trouve autour de lui. Il ne sait pas qui sont les loups-garous, seulement s'il y en a à proximité.",
        image: "/cards/montreurOurs.jpeg",
        nightAction: "Grognement si un loup-garou est proche à l'aube",
        strategy: "Utilisez les informations de l'ours pour guider vos décisions, mais soyez prudent car il ne sait pas qui sont les loups-garous."
    } // montreur d'ours
];

export const gameRoleCallOrder = [
    "Cupidon",
    "Voyante",
    "Salvateur",
    "Renard",
    "Enfant Sauvage",
    "Loup-Garou Blanc",
    "Loup-Garou",
    "Sorciere",
    "Voleur"
]

export const RoleSelectionCount = {
    "Cupidon": 2,
    "Voyante": 1,
    "Salvateur": 1,
    "Renard": 2,
    "Enfant Sauvage": 1,
    "Loup Garou Blanc": 1,
    "Loup Garou": 1,
    "Sorciere": 1,
    "Voleur": 1
}

export const RoleActionDescriptions = {
    "Loup-Garou": "Choisissez une victime à éliminer.",
    "Voyante": "Découvrez le rôle d'un joueur.",
    "Salvateur": "Protégez un joueur contre les attaques des loups-garous.",
    "Renard": "Détectez si un joueur est un loup-garou.",
    "Enfant Sauvage": "Choisissez un modèle parmi les autres joueurs.",
    "Loup-Garou Blanc": "Tuez un autre loup-garou.",
    "Sorciere": "Utilisez une potion de vie ou de mort.",
    "Voleur": "Échangez une avec celle d'un autre joueur au début du jeu."
}

export const defaultGameConfig = {
    day: 0,
    night: 1,
    roles: roles,
    lovers: {
        exists: false,
        players: []
    },
    wildChild: {
        transformed: false,
        model: null,
    },
    saving: {
        target: null,
        prevTarget: null
    },
    wolves: {
        targets: {},
        whiteTarget: null
    },
    thief: {
        choices: [],
        swapped: false
    }
}

export const getRoleById = (id) => {
    return roles.find(role => role.id === id);
}

export const getRoleByName = (name) => {
    return roles.find(role => role.name === name);
}

export const playerIsWolf = (role) => role === 'Loup-Garou' || role === 'Loup-Garou Blanc';

export const getRoleTeam = (role) => {
    const foundRole = getRoleByName(role);
    return foundRole ? foundRole.team : null;
}
export const classicRoles = {
    8: {
        1: 2,  // Loup-Garou
        2: 1,  // Voyante
        3: 1,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 0,  // Loup-Garou Blanc
        9: 0,  // Petite Fille
        10: 0, // Soeur
        11: 1, // Voleur
        12: 0, // Salvateur
        13: 0, // Servante Dévouée
        14: 0, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    9: {
        1: 2,  // Loup-Garou
        2: 1,  // Voyante
        3: 2,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 0,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 0, // Soeur
        11: 0, // Voleur
        12: 0, // Salvateur
        13: 0, // Servante Dévouée
        14: 0, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    10: {
        1: 3,  // Loup-Garou
        2: 1,  // Voyante
        3: 1,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 0,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 0, // Soeur
        11: 1, // Voleur
        12: 0, // Salvateur
        13: 0, // Servante Dévouée
        14: 0, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    11: {
        1: 3,  // Loup-Garou
        2: 1,  // Voyante
        3: 1,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 1,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 0, // Soeur
        11: 1, // Voleur
        12: 0, // Salvateur
        13: 0, // Servante Dévouée
        14: 0, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    12: {
        1: 3,  // Loup-Garou
        2: 1,  // Voyante
        3: 0,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 1,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 2, // Soeur
        11: 1, // Voleur
        12: 0, // Salvateur
        13: 0, // Servante Dévouée
        14: 0, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    13: {
        1: 4,  // Loup-Garou
        2: 1,  // Voyante
        3: 1,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 1,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 2, // Soeur
        11: 0, // Voleur
        12: 0, // Salvateur
        13: 0, // Servante Dévouée
        14: 0, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    14: {
        1: 4,  // Loup-Garou
        2: 1,  // Voyante
        3: 0,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 1,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 2, // Soeur
        11: 0, // Voleur
        12: 1, // Salvateur
        13: 0, // Servante Dévouée
        14: 1, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    15: {
        1: 4,  // Loup-Garou
        2: 1,  // Voyante
        3: 0,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 1,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 1, // Soeur
        11: 1, // Voleur
        12: 1, // Salvateur
        13: 1, // Servante Dévouée
        14: 1, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    16: {
        1: 5,  // Loup-Garou
        2: 1,  // Voyante
        3: 0,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 1,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 2, // Soeur
        11: 1, // Voleur
        12: 1, // Salvateur
        13: 1, // Servante Dévouée
        14: 0, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    17: {
        1: 5,  // Loup-Garou
        2: 1,  // Voyante
        3: 0,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 1,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 2, // Soeur
        11: 1, // Voleur
        12: 1, // Salvateur
        13: 1, // Servante Dévouée
        14: 1, // Enfant Sauvage
        15: 0, // Renard
        16: 0  // Montreur d'Ours
    },
    18: {
        1: 6,  // Loup-Garou
        2: 1,  // Voyante
        3: 0,  // Villageois
        5: 1,  // Sorcière
        6: 1,  // Chasseur
        7: 1,  // Cupidon
        8: 1,  // Loup-Garou Blanc
        9: 1,  // Petite Fille
        10: 0, // Soeur
        11: 1, // Voleur
        12: 1, // Salvateur
        13: 1, // Servante Dévouée
        14: 1, // Enfant Sauvage
        15: 1, // Renard
        16: 1  // Montreur d'Ours
    }
};
