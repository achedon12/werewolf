import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import {parseTimeRange} from "@/utils/Date.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const pad = (n) => String(n).padStart(2, '0');
const formatDateLocal = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

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

    const rawTimeRange = req.nextUrl?.searchParams?.get("timeRange") || "7";
    const durationMs = parseTimeRange(rawTimeRange);

    const MS_DAY = 24 * 60 * 60 * 1000;

    const startDate = new Date(Date.now() - durationMs);
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Math.max(1, Math.floor((endDate - startDate) / MS_DAY) + 1);

    try {
        const users = await prisma.user.findMany({
            where: {createdAt: {gte: startDate}},
            select: {id: true, createdAt: true}
        });

        const baselineCount = await prisma.user.count({
            where: {createdAt: {lt: startDate}}
        });

        const map = {};
        for (const u of users) {
            const dateStr = formatDateLocal(u.createdAt);
            map[dateStr] = (map[dateStr] || 0) + 1;
        }

        const userGrowth = [];
        let running = 0;
        for (let i = 0; i < days; i++) {
            const day = new Date(startDate.getTime() + i * MS_DAY);
            const dateStr = formatDateLocal(day);
            const newUsers = map[dateStr] || 0;
            running += newUsers;
            const cumulative = baselineCount + running;
            userGrowth.push({
                date: dateStr,
                users: cumulative,
                newUsers
            });
        }

        return NextResponse.json({userGrowth}, {status: 200});
    } catch (e) {
        return NextResponse.json({error: e?.message || "Erreur"}, {status: 500});
    } finally {
        try {
            await prisma.$disconnect();
        } catch (_) {
        }
    }
}