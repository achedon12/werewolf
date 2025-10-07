import {PrismaClient} from '@/generated/prisma';
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
export async function GET() {
    const games = await prisma.game.findMany({
        include: {
            players: true,
        }
    })

    return NextResponse.json({games});
}

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);

        if (!payload || !payload.id) {
            return NextResponse.json({ error: "Token invalide" }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const {name, configuration, type} = await request.json();

    if (!name) {
        return NextResponse.json({error: 'Name and Room ID are required'}, {status: 400});
    }

    const newGame = await prisma.game.create({
        data: {
            configuration: JSON.stringify(configuration),
            state: 'En attente',
            phase: 'Jour',
            name,
            type
        }
    });

    const newPlayer = await prisma.player.create({
        data: {
            userId: jwt.decode(token).id,
            gameId: newGame.id,
            isAdmin: true,
            role: '',
            isAlive: true
        }
    });

    return NextResponse.json({playerId: newPlayer.id, gameId: newGame.id});
}

export async function PUT(request) {
    const {gameId, newState} = await request.json();

    if (!gameId || !newState) {
        return NextResponse.json({error: 'Game ID and new state are required'}, {status: 400});
    }

    const validStates = ['En attente', 'En cours', 'Terminé'];

    if (!validStates.includes(newState)) {
        return NextResponse.json({error: 'Invalid game state'}, {status: 400});
    }

    const updatedGame = await prisma.game.update({
        where: {id: gameId},
        data: {state: newState}
    });

    return NextResponse.json({game: updatedGame});
}

export async function DELETE(request) {
    const {gameId} = await request.json();

    if (!gameId) {
        return NextResponse.json({error: 'Game ID is required'}, {status: 400});
    }

    const existingGame = await prisma.game.findUnique({
        where: {id: gameId},
        include: {players: true}
    });

    if (!existingGame) {
        return NextResponse.json({error: 'Game not found'}, {status: 404});
    }

    await prisma.player.deleteMany({
        where: {gameId: gameId}
    });

    await prisma.game.delete({
        where: {id: gameId}
    });

    return NextResponse.json({message: 'Game and associated players deleted'});
}
