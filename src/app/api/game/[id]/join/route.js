import {NextResponse} from "next/server";
import {PrismaClient} from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req, {params}) {
    const {id} = await params;

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({error: "Non authentifié"}, {status: 401});
    }

    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);
        if (!payload || !payload.id) {
            return NextResponse.json({error: "Token invalide"}, {status: 401});
        }
    } catch {
        return NextResponse.json({error: "Token invalide"}, {status: 401});
    }

    const gameId = id;
    if (!gameId) {
        return NextResponse.json({error: "ID manquant"}, {status: 400});
    }

    const userId = payload.id;

    const user = await prisma.user.findUnique({where: {id: userId}});
    if (!user) {
        return NextResponse.json({error: "Utilisateur non trouvé"}, {status: 404});
    }

    const game = await prisma.game.findUnique({
        where: {id: gameId},
        include: {players: true}
    });

    if (!game) {
        return NextResponse.json({error: "Partie non trouvée"}, {status: 404});
    }

    const alreadyInGame = game.players.some(p => p.userId === userId);
    if (!alreadyInGame) {
        await prisma.player.create({
            data: {
                userId: userId,
                gameId: gameId,
                isAlive: true,
                isAdmin: false,
                role: ''
            }
        });
    }

    return NextResponse.json({success: true, gameId});
}