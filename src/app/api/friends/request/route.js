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
        const friendRequests = await prisma.friendship.findMany({
            where: {
                AND: [
                    {status: "pending"},
                    {friendId: userId}
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nickname: true,
                        avatar: true,
                        verified: true,
                        bio: true,
                    }
                }
            },
            orderBy: {createdAt: "desc"}
        });

        const mappedRequests = friendRequests.map(req => ({
            id: String(req.id),
            userId: String(req.user.id),
            name: req.user.name || null,
            nickname: req.user.nickname || null,
            avatar: req.user.avatar ?? null,
            verified: !!req.user.verified,
            bio: req.user.bio ?? '',
            createdAt: req.createdAt ? new Date(req.createdAt).toISOString() : null,
        }));

        return NextResponse.json({friendRequests: mappedRequests}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}

export async function POST(req) {
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
        const body = await req.json();
        const {friendId} = body;

        if (!friendId) {
            return NextResponse.json({error: "friendId requis"}, {status: 400});
        }

        if (userId === friendId) {
            return NextResponse.json({error: "Impossible de vous ajouter vous-même"}, {status: 400});
        }

        const targetUser = await prisma.user.findUnique({
            where: {id: friendId}
        });

        if (!targetUser) {
            return NextResponse.json({error: "Utilisateur non trouvé"}, {status: 404});
        }

        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    {userId, friendId},
                    {userId: friendId, friendId: userId}
                ]
            }
        });

        if (existingFriendship) {
            return NextResponse.json({error: "Une demande existe déjà"}, {status: 409});
        }

        const newRequest = await prisma.friendship.create({
            data: {
                userId,
                friendId,
                status: "pending"
            },
            include: {
                friend: {
                    select: {
                        id: true,
                        name: true,
                        nickname: true,
                        avatar: true,
                        verified: true,
                    }
                }
            }
        });

        return NextResponse.json({
            id: String(newRequest.id),
            friendId: String(newRequest.friendId),
            status: newRequest.status,
            createdAt: new Date(newRequest.createdAt).toISOString()
        }, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}