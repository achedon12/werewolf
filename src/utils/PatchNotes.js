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
    }
];