import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import {parseTimeRange} from "@/utils/Date.js";

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

    if (!payload.role || (payload.role !== "admin" && payload.role !== "moderator")) {
        return NextResponse.json({error: "Accès admin requis"}, {status: 403});
    }

    const rawTimeRange = req.nextUrl?.searchParams?.get("timeRange") || "7";
    const since = new Date(Date.now() - parseTimeRange(rawTimeRange));

    const palette = [
        "#ef4444", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899",
        "#10b981", "#06b6d4", "#f97316", "#a78bfa", "#ef9a9a"
    ];

    try {
        const players = await prisma.player.findMany({
            where: {
                game: { createdAt: { gte: since } }
            },
            select: { role: true }
        });

        const counts = {};
        for (const p of players) {
            const role = (p.role || "Inconnu").trim() || "Inconnu";
            counts[role] = (counts[role] || 0) + 1;
        }

        const popularRoles = Object.entries(counts)
            .map(([role, count], idx) => ({ role, count }))
            .sort((a, b) => b.count - a.count)
            .map((item, i) => ({
                role: item.role,
                count: item.count,
                color: palette[i % palette.length]
            }));

        return NextResponse.json({ popularRoles }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: e?.message || "Erreur" }, { status: 500 });
    } finally {
        try { await prisma.$disconnect(); } catch (_) {}
    }
}