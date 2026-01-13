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
    if (!token) {
        return NextResponse.json({error: "Non authentifié"}, {status: 401});
    }

    let userId;
    if (token !== process.env.NEXT_PUBLIC_API_KEY) {
        let payload;
        try {
            payload = jwt.verify(token, JWT_SECRET);
            if (!payload || !payload.id) {
                return NextResponse.json({error: "Token invalide"}, {status: 401});
            }
            userId = payload.id;
        } catch {
            return NextResponse.json({error: "Token invalide"}, {status: 401});
        }
    }

    try {
        const {searchParams} = new URL(req.url);
        const search = (searchParams.get("search") || "").trim();

        if (!search || search.length < 2) {
            return NextResponse.json({users: []}, {status: 200});
        }

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {nickname: {contains: search, mode: "insensitive"}},
                            {name: {contains: search, mode: "insensitive"}},
                        ]
                    },
                    userId ? {NOT: {id: userId}} : {},
                ]
            },
            select: {
                id: true,
                name: true,
                nickname: true,
                avatar: true,
                verified: true,
                createdAt: true,
            },
            take: 20,
        });

        const mappedUsers = users.map(u => ({
            id: String(u.id),
            name: u.name || null,
            nickname: u.nickname || null,
            avatar: u.avatar ?? null,
            verified: !!u.verified,
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
        }));

        return NextResponse.json({users: mappedUsers}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}

export async function DELETE(req, {params}) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({error: "Non authentifié"}, {status: 401});
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return NextResponse.json({error: "Non authentifié"}, {status: 401});
    }

    let userId;
    if (token !== process.env.NEXT_PUBLIC_API_KEY) {
        let payload;
        try {
            payload = jwt.verify(token, JWT_SECRET);
            if (!payload || !payload.id) {
                return NextResponse.json({error: "Token invalide"}, {status: 401});
            }
            userId = payload.id;
        } catch {
            return NextResponse.json({error: "Token invalide"}, {status: 401});
        }
    }

    try {
        const {id: friendId} = await params;

        if (!friendId) {
            return NextResponse.json({error: "friendId requis"}, {status: 400});
        }

        const friendship = await prisma.friendship.findFirst({
            where: {
                AND: [
                    {status: "accepted"},
                    {
                        OR: [
                            {userId, friendId},
                            {userId: friendId, friendId: userId}
                        ]
                    }
                ]
            }
        });

        if (!friendship) {
            return NextResponse.json({error: "Amitié non trouvée"}, {status: 404});
        }

        await prisma.friendship.delete({
            where: {id: friendship.id}
        });

        return NextResponse.json({message: "Ami supprimé"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}