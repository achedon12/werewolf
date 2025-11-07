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

    if (!payload.role || payload.role !== "admin") {
        return NextResponse.json({error: "Accès admin requis"}, {status: 403});
    }

    const timeRange = (req.nextUrl?.searchParams?.get("timeRange") || "7").toLowerCase();
    const since = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);

    const slots = {};
    for (let h = 0; h < 24; h += 2) {
        slots[h] = {games: 0, usersSet: new Set()};
    }

    try {
        const games = await prisma.game.findMany({
            where: {
                createdAt: {gte: since}
            },
            select: {
                id: true,
                createdAt: true,
                startedAt: true,
                players: {select: {userId: true}}
            }
        });

        for (const g of games) {
            const date = new Date(g.startedAt || g.createdAt);
            const hour = date.getHours();
            const slot = Math.floor(hour / 2) * 2;
            if (!(slot in slots)) continue;
            slots[slot].games += 1;
            for (const p of g.players || []) {
                if (p.userId) slots[slot].usersSet.add(p.userId);
            }
        }

        const activityByHour = Object.keys(slots)
            .map(k => parseInt(k, 10))
            .sort((a, b) => a - b)
            .map(h => ({
                hour: String(h).padStart(2, '0') + 'h',
                games: slots[h].games,
                users: slots[h].usersSet.size
            }));

        return NextResponse.json({activityByHour}, {status: 200});
    } catch (e) {
        return NextResponse.json({error: e.message || 'Erreur'}, {status: 500});
    } finally {
        try {
            await prisma.$disconnect();
        } catch (_) {
        }
    }
}