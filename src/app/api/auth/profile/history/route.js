import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function GET(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({error: "Non authentifié"}, {status: 401});
    }

    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);
        if (!payload || !payload.id) return NextResponse.json({error: "Token invalide"}, {status: 401});
    } catch {
        return NextResponse.json({error: "Token invalide"}, {status: 401});
    }

    const url = new URL(req.url);
    const limitParam = Number(url.searchParams.get("limit") || 10);
    const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(limitParam, 100)) : 10;

    const records = await prisma.player.findMany({
        where: {userId: payload.id},
        include: {
            game: {
                include: {winners: {select: {id: true}}},
            },
        },
        orderBy: {game: {createdAt: "desc"}},
        take: limit,
    });

    const activities = records.map((p) => {
        const g = p.game || {};
        const dateIso = g.createdAt ? new Date(g.createdAt).toISOString() : (g.startedAt ? new Date(g.startedAt).toISOString() : null);
        const date = dateIso ? dateIso.slice(0, 16).replace("T", " ") : null;
        const won = Array.isArray(g.winners) && g.winners.some((w) => w.id === payload.id);
        const role = p.role || "Inconnu";
        const action = won ? `Victoire en tant que ${role}` : `Partie jouée (${role})`;
        const type = won ? "victory" : "play";
        return {
            id: g.id || null,
            date,
            action,
            type,
            role,
        };
    });

    return NextResponse.json({activities}, {status: 200});
}