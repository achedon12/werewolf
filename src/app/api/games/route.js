import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
    const games = await prisma.game.findMany({
        where: {
            state: {
                in: ['En attente', 'En cours'],
            },
        },
        include: {
            players: true
        }
    });

    const playersOnline = games.reduce((acc, game) => acc + game.players.length, 0);

    return Response.json({games, playersOnline});
}