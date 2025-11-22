import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import {formatDurationMs, parseTimeRange} from "@/utils/Date.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const pctChange = (curr, prev) => {
    if (prev === 0) return curr === 0 ? 0 : 100.0;
    return Math.round(((curr - prev) / prev) * 100 * 10) / 10;
}

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
    const durationMs = parseTimeRange(rawTimeRange);
    const now = new Date();
    const since = new Date(Date.now() - durationMs);
    const prevStart = new Date(Date.now() - 2 * durationMs);
    const prevEnd = new Date(Date.now() - durationMs);
    const olderStart = new Date(Date.now() - 3 * durationMs);
    const olderEnd = new Date(Date.now() - 2 * durationMs);

    try {
        const [totalUsers, totalGames] = await Promise.all([
            prisma.user.count(),
            prisma.game.count()
        ]);

        const [totalUsersBeforeCurrent, currPeriodGamesCount, prevPeriodGamesCount] = await Promise.all([
            prisma.user.count({ where: { createdAt: { lt: since } } }), // total users avant la période courante
            prisma.game.count({ where: { createdAt: { gte: since, lt: now } } }), // jeux créés dans la période courante
            prisma.game.count({ where: { createdAt: { gte: prevStart, lt: prevEnd } } }) // jeux créés période précédente
        ]);

        const recentPlayers = await prisma.player.findMany({
            where: {
                userId: { not: null },
                game: { createdAt: { gte: since, lt: now } }
            },
            select: { userId: true }
        });
        const activeUsersSet = new Set(recentPlayers.map(p => p.userId));
        const activeUsers = activeUsersSet.size;

        const prevPlayers = await prisma.player.findMany({
            where: {
                userId: { not: null },
                game: { createdAt: { gte: prevStart, lt: prevEnd } }
            },
            select: { userId: true }
        });
        const prevSet = new Set(prevPlayers.map(p => p.userId));

        const olderPlayers = await prisma.player.findMany({
            where: {
                userId: { not: null },
                game: { createdAt: { gte: olderStart, lt: olderEnd } }
            },
            select: { userId: true }
        });
        const olderSet = new Set(olderPlayers.map(p => p.userId));

        const activeGames = await prisma.game.count({
            where: {
                createdAt: { gte: since, lt: now },
                endedAt: null
            }
        });

        const finishedGames = await prisma.game.findMany({
            where: {
                startedAt: { not: null },
                endedAt: { not: null, gte: since, lt: now }
            },
            select: { startedAt: true, endedAt: true }
        });

        let avgSessionDurationMs = 0;
        if (finishedGames.length > 0) {
            const totalMs = finishedGames.reduce((acc, g) => {
                const s = new Date(g.startedAt).getTime();
                const e = new Date(g.endedAt).getTime();
                return acc + Math.max(0, e - s);
            }, 0);
            avgSessionDurationMs = Math.round(totalMs / finishedGames.length);
        }

        let retentionRate = 0;
        if (prevSet.size > 0) {
            let returning = 0;
            for (const id of prevSet) {
                if (activeUsersSet.has(id)) returning++;
            }
            retentionRate = Math.round((returning / prevSet.size) * 100 * 10) / 10; // 1 décimale
        }

        let prevRetentionRate = 0;
        if (olderSet.size > 0) {
            let returningPrev = 0;
            for (const id of olderSet) {
                if (prevSet.has(id)) returningPrev++;
            }
            prevRetentionRate = Math.round((returningPrev / olderSet.size) * 100 * 10) / 10;
        }

        const totalUsersChange = pctChange(totalUsers, totalUsersBeforeCurrent);
        const activeUsersChange = pctChange(activeUsers, prevSet.size);
        const totalGamesChange = pctChange(currPeriodGamesCount, prevPeriodGamesCount);
        const retentionRateChange = Math.round((retentionRate - prevRetentionRate) * 10) / 10; // points %

        const overview = {
            totalUsers,
            totalUsersChange,
            activeUsers,
            activeUsersChange,
            totalGames,
            totalGamesChange,
            activeGames,
            avgSessionDuration: formatDurationMs(avgSessionDurationMs),
            retentionRate,
            retentionRateChange
        };

        return NextResponse.json({overview}, {status: 200});
    } catch (e) {
        return NextResponse.json({error: e?.message || "Erreur"}, {status: 500});
    } finally {
        try { await prisma.$disconnect(); } catch (_) {}
    }
}