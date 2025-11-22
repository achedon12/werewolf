import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

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

    if (!payload.role || (payload.role !== "admin" && payload.role !== "moderator")) {
        return NextResponse.json({error: "Accès admin requis"}, {status: 403});
    }

    try {
        const {searchParams} = new URL(req.url);
        const pageRaw = parseInt(searchParams.get("page") || "1", 10);
        const pageSizeRaw = parseInt(searchParams.get("pageSize") || "20", 10);
        const search = (searchParams.get("search") || "").trim();

        const page = Math.max(1, isNaN(pageRaw) ? 1 : pageRaw);
        const pageSize = Math.min(100, Math.max(1, isNaN(pageSizeRaw) ? 20 : pageSizeRaw)); // limite à 100

        const where = {};
        if (search) {
            where.OR = [
                {email: {contains: search, mode: "insensitive"}},
                {name: {contains: search, mode: "insensitive"}},
                {nickname: {contains: search, mode: "insensitive"}},
            ];
        }

        const total = await prisma.user.count({where});
        const users = await prisma.user.findMany({
            where,
            orderBy: {createdAt: "desc"},
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                email: true,
                name: true,
                nickname: true,
                avatar: true,
                bio: true,
                victories: true,
                verified: true,
                role: true,
                createdAt: true,
                ambientSoundsEnabled: true,
                ambientThemeEnabled: true,
                _count: {
                    select: {
                        games: true,
                        wins: true
                    }
                }
            },
        });

        const mappedUsers = users.map(u => ({
            id: String(u.id),
            email: u.email,
            name: u.name || null,
            nickname: u.nickname || null,
            avatar: u.avatar ?? null,
            bio: u.bio ?? '',
            victories: typeof u.victories === 'number' ? u.victories : (u._count?.wins ?? 0),
            verified: !!u.verified,
            role: u.role || 'user',
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
            ambientSoundsEnabled: !!u.ambientSoundsEnabled,
            ambientThemeEnabled: !!u.ambientThemeEnabled,
            gamesPlayed: typeof u._count?.games === 'number' ? u._count.games : 0,
        }));

        const totalPages = Math.ceil(total / pageSize);

        return NextResponse.json({
            users: mappedUsers,
            total,
            page,
            pageSize,
            totalPages
        }, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}