export const PatchNoteTypes = {
    FEATURE: 'feature',
    FIX: 'fix',
    BALANCE: 'balance',
    HOTFIX: 'hotfix',
    MAJOR: 'major',
    LAUNCH: 'launch',
}

export function getPatchNotesByType(type) {
    return PatchNotes.filter(note => note.type === type);
}

export function getLatestPatchNote() {
    return PatchNotes[PatchNotes.length - 1];
}

export function getPatchBadgeClass(type) {
    const badgeClasses = {
        FEATURE: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        FIX: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        BALANCE: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        HOTFIX: "bg-red-500/10 text-red-500 border-red-500/20",
        MAJOR: "bg-green-500/10 text-green-500 border-green-500/20",
        LAUNCH: "bg-white/10 text-white border-white/20",
    };
    return badgeClasses[type];
}

export const PatchNotes = [
    {
        version: '1.0.0',
        title: 'Première Version',
        date: '2026-01-03',
        type: PatchNoteTypes.LAUNCH,
        changes: [
            {
                type: PatchNoteTypes.LAUNCH,
                changes: [
                    {
                        title: 'Première Version',
                        description: 'Lancement initial de l\'application avec les fonctionnalités de base.'
                    },
                    {
                        title: 'Fonctionnalités Utilisateur',
                        description: 'Ajout des fonctionnalités principales pour les utilisateurs, y compris l\'inscription, la connexion et la navigation.'
                    },
                    {
                        title: 'Tableau de Bord',
                        description: 'Mise en place d\'un tableau de bord interactif pour une meilleure expérience utilisateur.'
                    }
                ]
            }
        ],
    },
    {
        version: '1.1.0',
        title: 'Améliorations et Nouvelles Fonctionnalités',
        date: '2026-01-09',
        type: PatchNoteTypes.FEATURE,
        changes: [
            {
                type: PatchNoteTypes.FEATURE,
                changes: [
                    {
                        title: 'Nouvelles Fonctionnalités',
                        description: 'Ajout de nouvelles fonctionnalités pour améliorer l\'expérience utilisateur.'
                    },
                    {
                        title: 'Améliorations de Performance',
                        description: 'Optimisation des performances de l\'application pour une navigation plus fluide.'
                    },
                    {
                        title: 'Ajout de la page de Patch Notes',
                        description: 'Création d\'une page dédiée pour afficher l\'historique des mises à jour et des modifications.'
                    }
                ]
            }
        ],
    },
    {
        version: '1.1.1',
        title: 'Corrections de Bugs Mineurs et Améliorations des interfaces',
        date: '2026-01-11',
        type: PatchNoteTypes.FIX,
        changes: [
            {
                type: PatchNoteTypes.FIX,
                changes: [
                    {
                        title: 'Corrections de Bugs',
                        description: 'Résolution de plusieurs bugs mineurs signalés par les utilisateurs.'
                    },
                    {
                        title: 'Modifications pour la création de partie',
                        description: 'Changement pour "mode de jeu" au lieu de "type de partie" lors de la création d\'une nouvelle partie.'
                    },
                    {
                        title: 'Modification de l\'affichage du dernier patch note',
                        description: 'Le dernier patch note est désormais bien affiché dans les patch notes.'
                    },
                    {
                      title: 'Création d\'une API pour les Patch Notes',
                      description: 'Mise en place d\'une API dédiée pour gérer les Patch Notes de manière plus efficace.'
                    },
                    {
                        title: 'Améliorations des Interfaces Utilisateur',
                        description: 'Ajustements et améliorations des interfaces pour une meilleure ergonomie durant la partie.'
                    },
                    {
                        title: 'Optimisation du Code',
                        description: 'Refactorisation du code pour améliorer la maintenabilité et la performance.'
                    },
                    {
                        title: 'Ajout des channels de chat',
                        description: 'Implémentation de channels de chat spécifiques pour une meilleure communication entre les joueurs en fonction des périodes et des rôles.'
                    },
                    {
                        title: 'Fix rôle voleur',
                        description: 'Correction du bug où le rôle de voleur ne fonctionnait pas correctement (application du changement de chat si besoin).'
                    },
                    {
                        title: 'Ajout du rôle de l\'Enfant Sauvage',
                        description: 'Implémentation du rôle de l\'Enfant Sauvage avec ses fonctionnalités spécifiques.'
                    }
                ]
            }
        ],
    },
    {
        version: '1.2.0',
        title: 'Ajout du système de signalement',
        date: '2026-01-11',
        type: PatchNoteTypes.MAJOR,
        changes: [
            {
                type: PatchNoteTypes.MAJOR,
                changes: [
                    {
                        title: 'Système de Signalement',
                        description: 'Ajout d\'un système permettant aux utilisateurs de signaler des comportements inappropriés ou des bugs.'
                    }
                ]
            }
        ],
    }
];