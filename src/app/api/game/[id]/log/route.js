import {NextResponse} from "next/server";
import {PrismaClient} from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, {params}) {
    const {id} = await params;

    const gameId = id;
    if (!gameId) {
        return NextResponse.json({error: "ID manquant"}, {status: 400});
    }

    const logs = await prisma.gameLog.findMany({
        where: {gameId: gameId},
        orderBy: {createdAt: 'asc'}
    });

    return NextResponse.json({logs});
}

export async function POST(req, {params}) {
    const {id} = await params;

    const gameId = id;
    if (!gameId) {
        return NextResponse.json({error: "ID manquant"}, {status: 400});
    }

    const game = await prisma.game.findUnique({
        where: {id: gameId},
        include: {players: true}
    });

    if (!game) {
        return NextResponse.json({error: "Partie non trouvée"}, {status: 404});
    }

    const body = await req.json();
    const message = body.message;

    if (!message) {
        return NextResponse.json({error: "Message manquant"}, {status: 400});
    }

    await prisma.gameLog.create({
        data: {
            gameId: gameId,
            message
        }
    });

    return NextResponse.json({message: "Log ajouté"});
}
