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

    let rangeStart = null;
    let rangeEnd = null;
    if (range === "week") {
        rangeStart = startOfWeek();
        rangeEnd = new Date(rangeStart);
        rangeEnd.setDate(rangeEnd.getDate() + 7);
    } else if (range === "month") {
        rangeStart = startOfMonth();
        rangeEnd = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + 1, 1);
        rangeEnd.setHours(0, 0, 0, 0);
    }

    const games = await prisma.game.findMany({
        where: {
            users: {some: {id: payload.id}},
            ...(rangeStart && rangeEnd ? {startedAt: {gte: rangeStart, lt: rangeEnd}} : {})
        },
        include: {
            winners: true,
            players: true
        }
    });

    console.log(`Found ${games.length} games for user ${payload.id} in range ${range} (${rangeStart} - ${rangeEnd})`);

    const winGames = games.filter(g => Array.isArray(g.winners) && g.winners.some(w => w.id === payload.id)).map(g => g.id);

    const gamesPlayed = games.length;
    const gamesWon = winGames.length;
    const winRate = gamesPlayed > 0 ? Number(((gamesWon / gamesPlayed) * 100).toFixed(1)) : 0;

    // rolesPlayed
    const rolesPlayed = {};
    for (const game of games) {
        const currentPlayer = Array.isArray(game.players) ? game.players.find(p => p.userId === payload.id) : undefined;
        if (!currentPlayer) continue;
        const r = currentPlayer.role || "Inconnu";
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

    // streaks + total play time
    let bestStreak = 0;
    let currentRun = 0;
    let currentStreak = 0;
    let totalPlayTime = 0;
    for (const g of games) {
        const won = winGames.includes(g.id);
        if (g.startedAt && g.endedAt) {
            const started = new Date(g.startedAt).getTime();
            const ended = new Date(g.endedAt).getTime();
            if (!isNaN(started) && !isNaN(ended) && ended >= started) {
                totalPlayTime += (ended - started) / 1000;
            }
        }

        if (won) {
            currentRun += 1;
            if (currentRun > bestStreak) bestStreak = currentRun;
        } else {
            currentRun = 0;
        }
    }
    // currentStreak: count wins from most recent game backwards
    for (let i = games.length - 1; i >= 0; i--) {
        const g = games[i];
        if (winGames.includes(g.id)) currentStreak += 1;
        else break;
    }

    let prevGamesPlayed = null;
    if (rangeStart && rangeEnd) {
        let prevStart = null;
        let prevEnd = rangeStart;
        if (range === "week") prevStart = startOfWeekAgo();
        else if (range === "month") prevStart = startOfPrevMonth();

        if (prevStart) {
            prevGamesPlayed = await prisma.game.count({
                where: {
                    users: {some: {id: payload.id}},
                    startedAt: {gte: prevStart, lt: prevEnd}
                }
            });
        }
    }

    const gamesDelta = prevGamesPlayed === null ? null : (gamesPlayed - prevGamesPlayed);

    const recentPlayers = Array.from(games)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(g => ({
            date: new Date(g.createdAt).toISOString().slice(0, 10),
            result: winGames.includes(g.id) ? "win" : "loss",
            role: (() => {
                const p = Array.isArray(g.players) ? g.players.find(pl => pl.userId === payload.id) : undefined;
                return p ? (p.role || "Inconnu") : "Inconnu";
            })()
        }));

    const monthStart = startOfMonth();
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
    monthEnd.setHours(0, 0, 0, 0);
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();

    const playedPerDay = Array(daysInMonth).fill(0);
    const winsPerDay = Array(daysInMonth).fill(0);

    for (const g of games) {
        if (!g.createdAt) continue;
        const d = new Date(g.createdAt);
        if (isNaN(d.getTime())) continue;
        const day = d.getDate();
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
        where: {
            victories: {gt: userRecord.victories || 0}
        }
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