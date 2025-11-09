import {NextResponse} from "next/server";
import {PrismaClient} from "@/generated/prisma";
import jwt from "jsonwebtoken";
import {GAME_STATES} from "@/server/config/constants.js";

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
        if (!payload || !payload.id) {
            return NextResponse.json({error: "Token invalide"}, {status: 401});
        }
    } catch {
        return NextResponse.json({error: "Token invalide"}, {status: 401});
    }

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    try {
        const where = {
            users: {some: {id: payload.id}},
            state: GAME_STATES.FINISHED
        };

        const [total, games] = await Promise.all([
            prisma.game.count({where}),
            prisma.game.findMany({
                where,
                orderBy: {startedAt: "desc"},
                take: limit,
                skip,
                include: {
                    players: {select: {id: true}},
                    users: {select: {id: true, name: true, nickname: true, avatar: true}},
                    winners: {select: {id: true, name: true, nickname: true}}
                }
            })
        ]);

        const mapped = games.map(g => ({
            id: g.id,
            name: g.name,
            type: g.type,
            state: g.state,
            phase: g.phase,
            createdAt: g.createdAt,
            startedAt: g.startedAt,
            endedAt: g.endedAt,
            playersCount: Array.isArray(g.players) ? g.players.length : 0,
            users: g.users || [],
            winners: g.winners || []
        }));

        return NextResponse.json({
            games: mapped,
            total,
            page,
            limit,
            hasMore: skip + mapped.length < total
        });
    } catch (error) {
        console.error("Erreur /api/auth/profile/game/list :", error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    } finally {
        // Ne pas disconnect explicitement si Prisma est partagé entre handlers,
        // mais on peut laisser la connexion ouverte pour reuse.
    }
}