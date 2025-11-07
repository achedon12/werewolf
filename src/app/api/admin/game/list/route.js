import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
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
        if (!payload || !payload.id) return NextResponse.json({error: "Token invalide"}, {status: 401});
    } catch {
        return NextResponse.json({error: "Token invalide"}, {status: 401});
    }

    if (!payload.role || payload.role !== "admin") {
        return NextResponse.json({error: "Accès admin requis"}, {status: 403});
    }

    try {
        const {searchParams} = new URL(req.url);
        const pageRaw = parseInt(searchParams.get("page") || "1", 10);
        const pageSizeRaw = parseInt(searchParams.get("pageSize") || "20", 10);
        const search = (searchParams.get("search") || "").trim();

        const page = Math.max(1, isNaN(pageRaw) ? 1 : pageRaw);
        const pageSize = Math.min(100, Math.max(1, isNaN(pageSizeRaw) ? 20 : pageSizeRaw));

        const where = {};
        if (search) {
            where.OR = [
                {name: {contains: search, mode: "insensitive"}},
                {configuration: {contains: search, mode: "insensitive"}},
                {admin: {name: {contains: search, mode: "insensitive"}}},
            ];
        }

        const total = await prisma.game.count({where});

        const stateGroups = await prisma.game.groupBy({
            by: ['state'],
            where,
            _count: {_all: true}
        });
        const countsByState = {};
        stateGroups.forEach(g => {
            countsByState[g.state] = (g._count && g._count._all) ? g._count._all : 0;
        });

        const stats = {
            waiting: await prisma.game.count({where: { ...where, state: GAME_STATES.WAITING}}),
            inProgress: await prisma.game.count({where: { ...where, state: GAME_STATES.IN_PROGRESS}}),
            finished: await prisma.game.count({where: { ...where, state: GAME_STATES.FINISHED}}),
        };

        const games = await prisma.game.findMany({
            where,
            orderBy: {createdAt: "desc"},
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                name: true,
                type: true,
                configuration: true,
                phase: true,
                state: true,
                createdAt: true,
                startedAt: true,
                endedAt: true,
                admin: {select: {id: true, name: true, nickname: true}},
                players: {
                    select: {
                        id: true,
                        role: true,
                        isAlive: true,
                        isAdmin: true,
                        user: {select: {id: true, name: true, nickname: true}}
                    }
                },
                winners: {select: {id: true, name: true}},
                _count: {select: {players: true}}
            }
        });

        const mapped = games.map(g => {
            let config = {};
            try {
                config = g.configuration ? JSON.parse(g.configuration) : {};
            } catch (e) {
                config = {};
            }

            const maxPlayers = config.maxPlayers ?? config.max_players ?? null;
            const code = g.id
            const settings = {
                private: !!(config.private || config.isPrivate),
                enableSpectators: !!(config.enableSpectators || config.spectators),
                roles: Array.isArray(config.roles) ? config.roles : (typeof config.roles === 'string' ? config.roles.split(',').map(s => s.trim()).filter(Boolean) : [])
            };

            const currentPlayers = typeof g._count?.players === "number" ? g._count.players : (g.players?.length ?? 0);
            const winner = (g.winners && g.winners.length > 0) ? (g.winners.length === 1 ? g.winners[0].name : g.winners.map(w => w.name).join(", ")) : null;

            const players = (g.players || []).map(p => ({
                id: String(p.user?.id ?? p.id),
                name: p.user?.name ?? null,
                nickname: p.user?.nickname ?? null,
                role: p.role ?? null,
                alive: typeof p.isAlive === "boolean" ? p.isAlive : null,
                isAdmin: !!p.isAdmin
            }));

            return {
                id: String(g.id),
                name: g.name,
                code,
                status: g.state,
                phase: g.phase,
                type: g.type,
                maxPlayers,
                currentPlayers,
                creator: g.admin ? {
                    id: String(g.admin.id),
                    name: g.admin.name,
                    nickname: g.admin.nickname
                } : null,
                winner,
                players,
                createdAt: g.createdAt ? new Date(g.createdAt).toISOString() : null,
                startedAt: g.startedAt ? new Date(g.startedAt).toISOString() : null,
                finishedAt: g.endedAt ? new Date(g.endedAt).toISOString() : null,
                settings
            };
        });

        const totalPages = Math.max(1, Math.ceil(total / pageSize));

        return NextResponse.json({
            games: mapped,
            total,
            page,
            pageSize,
            totalPages,
            countsByState,
            stats
        }, {status: 200});

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}