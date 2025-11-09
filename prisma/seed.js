import {PrismaClient} from '../src/generated/prisma/index.js';
import {roles} from '../src/utils/Roles.js';
import {ACTION_TYPES, GAME_STATES} from "../src/server/config/constants.js";

const prisma = new PrismaClient();

const randomDateBetween = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const pickRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const makeActorName = (user) => {
    return user?.name || user?.nickname || 'Utilisateur inconnu';
}

const generateLogMessage = (action, actor, target) => {
    const actorName = makeActorName(actor);
    const targetName = target ? makeActorName(target) : null;

    switch (action) {
        case ACTION_TYPES.PLAYER_JOINED:
            return `${actorName} a rejoint la partie.`;
        case ACTION_TYPES.PLAYER_LEFT:
            return `${actorName} a quitté la partie.`;
        case ACTION_TYPES.PLAYER_EXCLUDED:
            return `${actorName} a été exclu.`;
        case ACTION_TYPES.CHAT_MESSAGE:
            return `${actorName} : "Message simulé"`;
        case ACTION_TYPES.PLAYER_VOTE:
            return `${actorName} a voté pour ${targetName}.`;
        case ACTION_TYPES.WEREWOLF_ATTACK:
            return `Attaque des loups‑garous sur ${targetName}.`;
        case ACTION_TYPES.SEER_REVEAL:
            return `${actorName} (voyante) a révélé ${targetName}.`;
        case ACTION_TYPES.DOCTOR_HEAL:
            return `${actorName} (docteur) a soigné ${targetName}.`;
        case ACTION_TYPES.PHASE_CHANGE:
            return `Changement de phase : ${actorName || 'Système'} a déclenché un changement.`;
        case ACTION_TYPES.PLAYER_ELIMINATED:
            return `${targetName} a été éliminé.`;
        case ACTION_TYPES.GAME_EVENT:
            return `Événement : action ${action} par ${actorName}.`;
        case ACTION_TYPES.GAME_HISTORY:
            return `Historique : ${actorName} action ${action}.`;
        case ACTION_TYPES.BOT_ADDED:
            return `Un bot a été ajouté par ${actorName}.`;
        case ACTION_TYPES.SYSTEM:
            return `Système : événement généré.`;
        default:
            return `${actorName || 'Système'} : ${action}`;
    }
}

const main = async () => {
    const achedonNickname = 'achedon12';
    const achedon = await prisma.user.findUnique({
        where: {nickname: achedonNickname}
    });

    const createdUsers = [];
    for (let i = 1; i <= 10; i++) {
        const email = `seeduser${i}@example.com`;
        const nickname = `seeduser${i}`;
        const u = await prisma.user.create({
            data: {
                email,
                password: 'password',
                name: `Seed User ${i}`,
                nickname,
                bio: 'Compte seed'
            }
        });
        createdUsers.push(u);
    }

    // Liste des 11 joueurs (10 créés + achedon)
    const playerUsers = [achedon, ...createdUsers];
    const playerIds = playerUsers.map(u => ({id: u.id}));

    // Paramètres de génération des games
    const totalGames = 100;
    const winsForAchedon = 40; // nombre de victoires pour achedon (modifiez si nécessaire)

    // Plage de dates : derniers 6 mois
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    // compteur de victoires par utilisateur
    const victoryCounts = {};
    for (const u of playerUsers) victoryCounts[u.id] = 0;

    const actionValues = Object.values(ACTION_TYPES);

    // Génère les jeux
    for (let i = 1; i <= totalGames; i++) {
        // Choisit la date aléatoire pour cette partie
        const createdAt = randomDateBetween(startDate, endDate);
        const startedAt = new Date(createdAt.getTime() + 1000 * 60 * 60); // +1h
        const endedAt = new Date(startedAt.getTime() + 1000 * (60 * (30 + Math.floor(Math.random() * 31))));

        // Détermine le gagnant : assurer winsForAchedon victoires pour achedon
        const remainingGames = totalGames - i + 1;
        const remainingWinsNeeded = Math.max(0, winsForAchedon - victoryCounts[achedon.id]);
        let winnerId;
        if (remainingWinsNeeded >= remainingGames) {
            // il faut donner la victoire à achedon pour atteindre le quota
            winnerId = achedon.id;
        } else {
            // sinon, choisissez aléatoirement : donnez la victoire à achedon jusqu'au quota atteint
            const giveWinToAchedon = (victoryCounts[achedon.id] < winsForAchedon) && (Math.random() < (remainingWinsNeeded / remainingGames));
            if (giveWinToAchedon) {
                winnerId = achedon.id;
            } else {
                // choisir un autre gagnant aléatoire parmi les 10 autres
                const others = playerUsers.filter(u => u.id !== achedon.id);
                const pick = others[Math.floor(Math.random() * others.length)];
                winnerId = pick.id;
            }
        }

        // Crée les players (nested creates) pour la game et assigne un rôle aléatoire à chaque player
        const playersCreate = playerUsers.map(u => {
            const chosenRole = roles[Math.floor(Math.random() * roles.length)];
            return {
                user: {connect: {id: u.id}},
                isAlive: true,
                isAdmin: u.id === achedon.id ? true : false,
                role: chosenRole ? chosenRole.name : null
            };
        });

        // Génération aléatoire des game logs
        const minLogs = 10;
        const maxLogs = 80;
        const numLogs = randomInt(minLogs, maxLogs);

        const logs = [];
        for (let l = 0; l < numLogs; l++) {
            const action = pickRandom(actionValues);
            const actor = pickRandom(playerUsers);
            // certain actions nécessitent une cible
            let target = null;
            if ([ACTION_TYPES.PLAYER_VOTE, ACTION_TYPES.WEREWOLF_ATTACK, ACTION_TYPES.SEER_REVEAL, ACTION_TYPES.DOCTOR_HEAL, ACTION_TYPES.PLAYER_ELIMINATED].includes(action)) {
                // choisir une cible différente de l'acteur quand possible
                const possibleTargets = playerUsers.filter(u => u.id !== actor.id);
                target = possibleTargets.length ? pickRandom(possibleTargets) : actor;
            }

            const logCreatedAt = randomDateBetween(startedAt, endedAt);
            const message = generateLogMessage(action, actor, target);

            logs.push({
                message,
                createdAt: logCreatedAt
            });
        }

        // Trier les logs par date avant d'insérer
        logs.sort((a, b) => a.createdAt - b.createdAt);

        // Crée la game avec users connectés, winner connecté, players et game logs
        await prisma.game.create({
            data: {
                name: `Partie #${i}`,
                type: 'classic',
                configuration: '{}',
                phase: 'Nuit',
                state: GAME_STATES.FINISHED,
                createdAt,
                startedAt,
                endedAt,
                admin: {connect: {id: achedon.id}},
                users: {connect: playerIds},
                winners: {connect: [{id: winnerId}]},
                players: {create: playersCreate},
                gameLog: {create: logs}
            }
        });

        // Incrémente compteur de victoires
        victoryCounts[winnerId] = (victoryCounts[winnerId] || 0) + 1;
    }

    // Met à jour le champ victories pour chaque utilisateur
    const updates = [];
    for (const [userId, count] of Object.entries(victoryCounts)) {
        updates.push(prisma.user.update({
            where: {id: userId},
            data: {victories: count}
        }));
    }
    await Promise.all(updates);

    console.log(`Seed terminé — ${totalGames} parties créées sur 6 mois. Victoires par utilisateur :`, victoryCounts);
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });