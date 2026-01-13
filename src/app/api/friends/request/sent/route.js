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
        const pendingRequests = await prisma.friendship.findMany({
            where: {
                AND: [
                    {status: "pending"},
                    {userId}
                ]
            },
            include: {
                friend: {
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

        const mappedRequests = pendingRequests.map(req => ({
            id: String(req.id),
            friendId: String(req.friend.id),
            name: req.friend.name || null,
            nickname: req.friend.nickname || null,
            avatar: req.friend.avatar ?? null,
            verified: !!req.friend.verified,
            bio: req.friend.bio ?? '',
            createdAt: req.createdAt ? new Date(req.createdAt).toISOString() : null,
        }));

        return NextResponse.json({pendingRequests: mappedRequests}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}
