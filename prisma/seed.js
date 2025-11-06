import {PrismaClient} from '../src/generated/prisma/index.js';
import {roles} from '../src/utils/Roles.js';

const prisma = new PrismaClient();

function randomDateBetween(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
    const achedonId = 'cmgfby3e40001vzcs3l9oqmsx';
    const achedon = await prisma.user.findUnique({
        where: {id: achedonId}
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

    // Génère les jeux
    for (let i = 1; i <= totalGames; i++) {
        // Choisit la date aléatoire pour cette partie
        const createdAt = randomDateBetween(startDate, endDate);
        const startedAt = new Date(createdAt.getTime() + 1000 * 60 * 60); // +1h

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

        // Crée la game avec users connectés et winner connecté
        await prisma.game.create({
            data: {
                name: `Partie #${i}`,
                type: 'classic',
                configuration: '{}',
                phase: 'Nuit',
                state: 'Terminé',
                createdAt,
                startedAt,
                admin: {connect: {id: achedon.id}},
                users: {connect: playerIds},
                winners: {connect: [{id: winnerId}]},
                players: {create: playersCreate}
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