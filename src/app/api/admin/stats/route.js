import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const startOfDay = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};
const startOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
};
const startOfPrevMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() - 1, 1, 0, 0, 0, 0);
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
        if (!payload || !payload.id) {
            return NextResponse.json({error: "Token invalide"}, {status: 401});
        }
    } catch {
        return NextResponse.json({error: "Token invalide"}, {status: 401});
    }

    if (payload.role && (payload.role !== "admin" && payload.role !== "moderator")) {
        return NextResponse.json({error: "Accès admin requis"}, {status: 403});
    }

    try {
        const totalUsers = await prisma.user.count();
        const activeGames = await prisma.game.count({where: {endedAt: null}});
        const gamesToday = await prisma.game.count({where: {createdAt: {gte: startOfDay()}}});

        let onlinePlayers = 0;
        try {
            onlinePlayers = await prisma.player.count({where: {game: {endedAt: null}}});
        } catch {
            onlinePlayers = 0;
        }

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const newRegistrations = await prisma.user.count({where: {createdAt: {gte: thirtyDaysAgo}}});

        let activeSessions = null;
        try {
            activeSessions = await prisma.session.count({where: {expires: {gt: new Date()}}});
        } catch {
            activeSessions = null;
        }

        let reports = 0;
        try {
            reports = await prisma.report.count();
        } catch {
            reports = 0;
        }

        let systemHealth = 0;
        try {
            await prisma.$queryRaw`SELECT 1`;
            systemHealth = 100;
        } catch {
            systemHealth = 50;
        }

        const monthStart = startOfMonth();
        const prevMonthStart = startOfPrevMonth();

        const prevTotalUsers = await prisma.user.count({where: {createdAt: {lt: monthStart}}});

        let totalUsersTrend = null;
        if (prevTotalUsers > 0) {
            const diff = totalUsers - prevTotalUsers;
            totalUsersTrend = Number(((diff / prevTotalUsers) * 100).toFixed(1));
        } else {
            totalUsersTrend = null;
        }

        let recentActivity = [];
        try {
            const act = await prisma.activity.findMany({
                orderBy: {createdAt: "desc"},
                take: 10,
                select: {id: true, type: true, action: true, userId: true, createdAt: true, status: true}
            });
            recentActivity = act.map(a => ({
                id: a.id,
                type: a.type,
                action: a.action,
                user: a.userId || "system",
                time: a.createdAt ? new Date(a.createdAt).toISOString() : null,
                status: a.status || "info"
            }));
        } catch {
            const [recentUsers, recentGames] = await Promise.all([
                prisma.user.findMany({
                    orderBy: {createdAt: "desc"},
                    take: 5,
                    select: {id: true, nickname: true, createdAt: true}
                }),
                prisma.game.findMany({
                    orderBy: {createdAt: "desc"},
                    take: 5,
                    select: {id: true, createdAt: true, admin: true},
                })
            ]);

            recentActivity = [
                ...recentUsers.map(u => ({
                    id: `user-${u.id}`,
                    type: "user",
                    action: "Nouvelle inscription",
                    user: u.nickname || `user:${u.id}`,
                    time: u.createdAt ? new Date(u.createdAt).toISOString() : null,
                    status: "success"
                })),
                ...recentGames.map(g => ({
                    id: `game-${g.id}`,
                    type: "game",
                    action: "Partie créée",
                    user: g.admin && g.admin.nickname ? `user:${g.admin.nickname}` : "system",
                    time: g.createdAt ? new Date(g.createdAt).toISOString() : null,
                    status: "info"
                }))
            ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
        }

        const stats = {
            totalUsers,
            totalUsersTrend,
            activeGames,
            gamesToday,
            onlinePlayers,
            systemHealth,
            newRegistrations,
            activeSessions,
            reports
        };

        return NextResponse.json({stats, recentActivity}, {status: 200, headers: {"content-type": "application/json"}});
    } catch (err) {
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}