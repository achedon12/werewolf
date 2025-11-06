import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const startOfWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
};
const startOfWeekAgo = () => {
    const s = startOfWeek();
    s.setDate(s.getDate() - 7);
    return s;
};

const startOfMonth = () => {
    const d = new Date();
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    first.setHours(0, 0, 0, 0);
    return first;
};
const startOfPrevMonth = () => {
    const d = new Date();
    const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    prev.setHours(0, 0, 0, 0);
    return prev;
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

    const userRecord = await prisma.user.findUnique({
        where: {id: payload.id},
        select: {id: true, victories: true}
    });
    if (!userRecord) {
        return NextResponse.json({error: "Utilisateur introuvable"}, {status: 404});
    }

    const url = new URL(req.url);
    const rangeParam = url.searchParams.get("timeRange") || url.searchParams.get("range") || "all";
    const range = rangeParam.toLowerCase();

    let cutoff = null;
    if (range === "week") cutoff = startOfWeek();
    else if (range === "month") cutoff = startOfMonth();

    const gameDateFilter = cutoff ? {createdAt: {gte: cutoff}} : undefined;

    const players = await prisma.player.findMany({
        where: {
            userId: payload.id,
            ...(gameDateFilter ? {game: gameDateFilter} : {})
        },
        include: {game: true}
    });

    const winGames = await prisma.game.findMany({
        where: {
            winners: {some: {id: payload.id}},
            ...(gameDateFilter ? {createdAt: {gte: cutoff}} : {})
        },
        select: {id: true}
    });

    const winsSet = new Set(winGames.map(g => g.id));

    const gamesMap = new Map();
    for (const p of players) {
        if (!p.game || !p.game.id) continue;
        if (gamesMap.has(p.game.id)) continue;
        const dateVal = p.game.createdAt || p.game.startedAt || new Date();
        gamesMap.set(p.game.id, {
            id: p.game.id,
            date: new Date(dateVal),
            won: winsSet.has(p.game.id)
        });
    }
    const gamesList = Array.from(gamesMap.values()).sort((a, b) => a.date - b.date);

    const gamesPlayed = gamesList.length;
    const gamesWon = winGames.length;
    const winRate = gamesPlayed > 0 ? Number(((gamesWon / gamesPlayed) * 100).toFixed(1)) : 0;

    // rolesPlayed
    const rolesPlayed = {};
    for (const p of players) {
        const r = p.role || "Inconnu";
        rolesPlayed[r] = (rolesPlayed[r] || 0) + 1;
    }

    // favorite role
    let favoriteRole = null;
    let maxRoleCount = 0;
    for (const [r, c] of Object.entries(rolesPlayed)) {
        if (c > maxRoleCount) {
            maxRoleCount = c;
            favoriteRole = r;
        }
    }

    // streaks
    let bestStreak = 0;
    let currentRun = 0;
    for (const g of gamesList) {
        if (g.won) {
            currentRun += 1;
            if (currentRun > bestStreak) bestStreak = currentRun;
        } else {
            currentRun = 0;
        }
    }
    let currentStreak = 0;
    for (let i = gamesList.length - 1; i >= 0; i--) {
        if (gamesList[i].won) currentStreak += 1;
        else break;
    }

    // total play time (seconds)
    let totalPlayTime = 0;
    for (const p of players) {
        if (p.game && p.game.endedAt && p.game.startedAt) {
            const duration = (p.game.endedAt.getTime() - p.game.startedAt.getTime()) / 1000;
            totalPlayTime += duration;
        }
    }

    let prevGamesPlayed = null;
    if (cutoff) {
        let prevStart = null;
        if (range === "week") prevStart = startOfWeekAgo();
        else if (range === "month") prevStart = startOfPrevMonth();

        if (prevStart) {
            prevGamesPlayed = await prisma.player.count({
                where: {
                    userId: payload.id,
                    game: {createdAt: {gte: prevStart, lt: cutoff}}
                }
            });
        }
    }

    const gamesDelta = prevGamesPlayed === null ? null : (gamesPlayed - prevGamesPlayed);

    const recentPlayers = Array.from(gamesList)
        .sort((a, b) => b.date - a.date)
        .slice(0, 5)
        .map(g => ({
            date: g.date.toISOString().slice(0, 10),
            result: g.won ? "win" : "loss",
            role: (() => {
                const p = players.find(pp => pp.game && pp.game.id === g.id);
                return p ? (p.role || "Inconnu") : "Inconnu";
            })()
        }));

    const monthStart = startOfMonth();
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();

    const monthPlayers = await prisma.player.findMany({
        where: {
            userId: payload.id,
            game: { createdAt: { gte: monthStart } }
        },
        include: {
            game: { select: { id: true, createdAt: true, winners: { select: { id: true } } } }
        }
    });

    const playedPerDay = Array(daysInMonth).fill(0);
    const winsPerDay = Array(daysInMonth).fill(0);

    for (const p of monthPlayers) {
        const g = p.game;
        if (!g || !g.createdAt) continue;
        const d = new Date(g.createdAt);
        const day = d.getDate(); // 1..daysInMonth
        playedPerDay[day - 1] += 1;
        if (Array.isArray(g.winners) && g.winners.some(w => w.id === payload.id)) {
            winsPerDay[day - 1] += 1;
        }
    }

    const labels = [];
    for (let i = 1; i <= daysInMonth; i++) {
        labels.push(i.toString().padStart(2, '0'));
    }

    const higherCount = await prisma.user.count({
        where: {victories: {gt: userRecord.victories || 0}}
    });
    const globalRank = higherCount + 1;

    const monthlyWins = await prisma.game.count({
        where: {
            winners: {some: {id: payload.id}},
            createdAt: {gte: startOfMonth()}
        }
    });
    const weeklyWins = await prisma.game.count({
        where: {
            winners: {some: {id: payload.id}},
            createdAt: {gte: startOfWeek()}
        }
    });

    const stats = {
        gamesPlayed,
        gamesWon,
        winRate,
        favoriteRole,
        totalPlayTime,
        currentStreak,
        bestStreak,
        rolesPlayed,
        recentActivity: recentPlayers,
        rankings: {
            global: globalRank,
            monthly: monthlyWins,
            weekly: weeklyWins
        },
        timeRange: range,
        previousPeriodGames: prevGamesPlayed,
        gamesDelta,
        monthlyProgress: {
            labels,
            played: playedPerDay,
            wins: winsPerDay
        }
    };

    return NextResponse.json(stats, {
        status: 200,
        headers: {"content-type": "application/json"}
    });
}