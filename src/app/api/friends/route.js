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
        const friends = await prisma.friendship.findMany({
            where: {
                AND: [
                    {status: "accepted"},
                    {
                        OR: [
                            {userId},
                            {friendId: userId}
                        ]
                    }
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
                },
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
            orderBy: {updatedAt: "desc"}
        });

        const mappedFriends = friends.map(friendship => {
            const friendData = friendship.userId === userId ? friendship.friend : friendship.user;
            return {
                id: String(friendData.id),
                name: friendData.name || null,
                nickname: friendData.nickname || null,
                avatar: friendData.avatar ?? null,
                verified: !!friendData.verified,
                bio: friendData.bio ?? '',
            };
        });

        return NextResponse.json({friends: mappedFriends}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}