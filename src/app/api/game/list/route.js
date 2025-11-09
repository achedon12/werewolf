import {PrismaClient} from '@/generated/prisma';
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function GET(request) {
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

    return NextResponse.json({games, playersOnline});
}