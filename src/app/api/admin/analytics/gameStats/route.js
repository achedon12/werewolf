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
        const [totalGamesInPeriod, finishedCount, ongoingCount] = await Promise.all([
            prisma.game.count({where: {createdAt: {gte: since}}}),
            prisma.game.count({where: {createdAt: {gte: since}, endedAt: {not: null}}}),
            prisma.game.count({where: {createdAt: {gte: since}, startedAt: {not: null}, endedAt: null}})
        ]);

        const cancelledCount = Math.max(0, totalGamesInPeriod - finishedCount - ongoingCount);

        const pct = (n) => {
            if (!totalGamesInPeriod) return 0;
            return Math.round((n / totalGamesInPeriod) * 1000) / 10; // 1 décimale
        };

        const gameStats = [
            {status: "Terminées", count: finishedCount, percentage: pct(finishedCount)},
            {status: "En cours", count: ongoingCount, percentage: pct(ongoingCount)},
            {status: "Annulées", count: cancelledCount, percentage: pct(cancelledCount)}
        ];

        return NextResponse.json({gameStats}, {status: 200});
    } catch (e) {
        return NextResponse.json({error: e?.message || "Erreur"}, {status: 500});
    } finally {
        try {
            await prisma.$disconnect();
        } catch (_) {
        }
    }
}