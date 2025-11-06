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
}

const startOfMonth = () => {
    const d = new Date();
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    first.setHours(0, 0, 0, 0);
    return first;
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
        if (!payload || !payload.id) {
            return NextResponse.json({error: "Token invalide"}, {status: 401});
        }
    } catch {
        return NextResponse.json({error: "Token invalide"}, {status: 401});
    }

    const userRecord = await prisma.user.findUnique({
        where: {id: payload.id},
        select: {
            id: true,
            victories: true,
        }
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

    // basic stats
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

    // streaks (best and current) based on filtered gamesList
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

    // global rank (unchanged)
    const higherCount = await prisma.user.count({
        where: {
            victories: {gt: userRecord.victories || 0}
        }
    });
    const globalRank = higherCount + 1;

    // monthly / weekly wins (kept global regardless of selected range)
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
        totalPlayTime: null,
        currentStreak,
        bestStreak,
        rolesPlayed,
        recentActivity: recentPlayers,
        rankings: {
            global: globalRank,
            monthly: monthlyWins,
            weekly: weeklyWins
        },
        timeRange: range
    };

    return NextResponse.json(stats, {
        status: 200,
        headers: {"content-type": "application/json"}
    });
}