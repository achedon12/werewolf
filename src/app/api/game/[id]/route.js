import {PrismaClient} from '@/generated/prisma';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(request, context) {
    const {id} = await context.params;

    const game = await prisma.game.findFirst({
        where: {id: id},
        include: {
            admin: true,
            players: {
                include: {
                    user: true
                }
            },
        }
    });

    if (!game) {
        return NextResponse.json({error: 'Game not found'}, {status: 404});
    }

    return NextResponse.json(game);
}

export async function POST(request, context) {
    const {id} = await context.params;
    let body;
    try {
        body = await request.json();
    } catch (err) {
        body = {};
    }

    const data = {};

    if (body.name) data.name = body.name;
    if (body.phase) data.phase = body.phase;
    if (body.state) data.state = body.state;
    if (body.adminId) data.adminId = body.adminId;
    if (body.type) data.type = body.type;
    if (body.configuration) data.configuration = body.configuration;
    if (body.startedAt) data.startedAt = body.startedAt;
    if (body.endedAt) data.endedAt = body.endedAt;

    const playerIdsToConnect = [];
    const userIdsToConnect = [];

    if (body.players) {
        for (const player of body.players) {
            try {
                const isBot = !!player.isBot;
                const isAlive = typeof player.isAlive === 'undefined' ? true : player.isAlive;
                const isAdmin = !!player.isAdmin;
                const role = player.role || null;

                const upserted = await prisma.player.upsert({
                    where: {id: player.id},
                    update: {
                        role,
                        isAlive,
                        isAdmin,
                        gameId: id,
                        isBot: isBot,
                        botName: isBot ? (player.nickname || player.botName) : null,
                        botType: isBot ? player.botType : null,
                        userId: isBot ? null : (player.id || null)
                    },
                    create: {
                        id: player.id,
                        role,
                        gameId: id,
                        isAlive,
                        isAdmin,
                        isBot: isBot,
                        botName: isBot ? (player.nickname || player.botName) : null,
                        botType: isBot ? player.botType : null,
                        userId: isBot ? null : (player.id || null)
                    }
                });

                if (upserted && upserted.id) {
                    playerIdsToConnect.push(upserted.id);
                }
                if (upserted && upserted.userId) {
                    userIdsToConnect.push(upserted.userId);
                }
            } catch (err) {
                console.error('Erreur lors de la persistence d\'un player:', err);
            }
        }

        if (playerIdsToConnect.length) {
            data.players = {
                connect: playerIdsToConnect.map(pid => ({id: pid}))
            };
        }

        if (userIdsToConnect.length) {
            const uniqueUserIds = Array.from(new Set(userIdsToConnect));
            data.users = {
                connect: uniqueUserIds.map(uid => ({id: uid}))
            };
        }
    }

    if (body.winners) {
        const winnersConnect = body.winners;
        if (winnersConnect.length) {
            data.winners = {connect: winnersConnect};
        }

        for (const winnerId of body.winners) {
            try {
                await prisma.user.update({
                    where: {id: winnerId},
                    data: {
                        victories: {
                            increment: 1
                        }
                    }
                });
            } catch (err) {
                console.error('Erreur lors de l\'incrément des victoires:', err);
            }
        }
    }

    try {
        await prisma.game.update({
            where: {id: id},
            data: data
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la game:', err);
        return NextResponse.json({error: 'Failed to update game'}, {status: 500});
    }

    const result = await prisma.game.findFirst({
        where: {id},
        include: {
            admin: true,
            players: {include: {user: true}},
            users: true,
            winners: true
        }
    });

    return NextResponse.json(result);
}