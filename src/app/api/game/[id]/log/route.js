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
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const body = await req.json();
    const logs = Array.isArray(body.logs) ? body.logs : [];

    if (logs.length === 0) {
        return NextResponse.json({ inserted: 0 });
    }

    const data = logs.map(l => ({
        gameId: id,
        message: l.message || "",
        createdAt: l.createdAt ? new Date(l.createdAt) : new Date(),
    }));

    try {
        const result = await prisma.gameLog.createMany({
            data,
            skipDuplicates: true
        });
        return NextResponse.json({ inserted: result.count || data.length });
    } catch (err) {
        console.error("❌ Erreur batch logs:", err);
        return NextResponse.json({ error: "Erreur lors de l'insertion des logs" }, { status: 500 });
    }
}
