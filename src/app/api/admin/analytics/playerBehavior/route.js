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
    const durationMs = parseTimeRange(rawTimeRange);
    const since = new Date(Date.now() - durationMs);

    try {
        const totalGamesInPeriod = await prisma.game.count({where: {createdAt: {gte: since}}});

        const finishedGames = await prisma.game.findMany({
            where: {createdAt: {gte: since}, startedAt: {not: null}, endedAt: {not: null}},
            select: {startedAt: true, endedAt: true}
        });

        const finishedCount = finishedGames.length;

        const playerRows = await prisma.player.findMany({
            where: {userId: {not: null}, game: {createdAt: {gte: since}}},
            select: {userId: true}
        });
        const totalParticipations = playerRows.length;
        const uniqueUsersSet = new Set(playerRows.map(p => p.userId));
        const uniqueUsersCount = uniqueUsersSet.size;

        const gamesWithWinners = await prisma.game.findMany({
            where: {createdAt: {gte: since}},
            select: {winners: {select: {id: true}}}
        });
        const totalWins = gamesWithWinners.reduce((acc, g) => acc + (g.winners?.length || 0), 0);

        const partiesParJoueur = uniqueUsersCount > 0 ? Math.round((totalParticipations / uniqueUsersCount) * 10) / 10 : 0;
        const victoiresParJoueur = uniqueUsersCount > 0 ? Math.round((totalWins / uniqueUsersCount) * 10) / 10 : 0;

        let avgDurationMin = 0;
        if (finishedCount > 0) {
            const totalMs = finishedGames.reduce((acc, g) => {
                const s = new Date(g.startedAt).getTime();
                const e = new Date(g.endedAt).getTime();
                return acc + Math.max(0, e - s);
            }, 0);
            avgDurationMin = Math.round((totalMs / finishedCount) / 6000) / 10;
        }

        const completionRate = totalGamesInPeriod > 0 ? Math.round((finishedCount / totalGamesInPeriod) * 1000) / 10 : 0;

        const playerBehavior = [
            {metric: "Parties/joueur", value: partiesParJoueur},
            {metric: "Victoires/joueur", value: victoiresParJoueur},
            {metric: "Temps moyen/partie", value: avgDurationMin},
            {metric: "Taux de complétion", value: completionRate}
        ];

        return NextResponse.json({playerBehavior}, {status: 200});
    } catch (e) {
        return NextResponse.json({error: e?.message || "Erreur"}, {status: 500});
    } finally {
        try {
            await prisma.$disconnect();
        } catch (_) {
        }
    }
}