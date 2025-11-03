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

    let data = {};

    if (body.name) {
        data.name = body.name;
    }
    if (body.phase) {
        data.phase = body.phase;
    }
    if (body.state) {
        data.state = body.state;
    }
    if (body.adminId) {
        data.adminId = body.adminId;
    }
    if (body.type) {
        data.type = body.type;
    }
    if (body.configuration) {
        data.configuration = body.configuration;
    }
    if (body.startedAt) {
        data.startedAt = body.startedAt;
    }

    const updatedGame = await prisma.game.update({
        where: {id: id},
        data
    });

    if (body.players) {
        for (const player of body.players) {
            if (player.isBot) continue;

            await prisma.player.upsert({
                where: {id: player.id},
                update: {
                    role: player.role,
                    isAlive: player.isAlive,
                    isAdmin: player.isAdmin || false,
                    gameId: id,
                    userId: player.id
                },
                create: {
                    role: player.role,
                    gameId: id,
                    userId: player.id,
                    isAlive: player.isAlive,
                    isAdmin: player.isAdmin || false,
                }
            });
        }
    }

    return NextResponse.json(updatedGame);
}