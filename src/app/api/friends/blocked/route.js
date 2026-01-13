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
        const blockedUsers = await prisma.blockedUser.findMany({
            where: {
                userId
            },
            include: {
                blocked: {
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

        const mappedBlocked = blockedUsers.map(block => ({
            id: String(block.blocked.id),
            name: block.blocked.name || null,
            nickname: block.blocked.nickname || null,
            avatar: block.blocked.avatar ?? null,
            verified: !!block.blocked.verified,
            bio: block.blocked.bio ?? '',
            blockedAt: block.createdAt ? new Date(block.createdAt).toISOString() : null,
        }));

        return NextResponse.json({blockedUsers: mappedBlocked}, {status: 200});
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
        const {blockedId} = body;

        if (!blockedId) {
            return NextResponse.json({error: "blockedId requis"}, {status: 400});
        }

        if (userId === blockedId) {
            return NextResponse.json({error: "Impossible de vous bloquer vous-même"}, {status: 400});
        }

        const targetUser = await prisma.user.findUnique({
            where: {id: blockedId}
        });

        if (!targetUser) {
            return NextResponse.json({error: "Utilisateur non trouvé"}, {status: 404});
        }

        const existingBlock = await prisma.blockedUser.findUnique({
            where: {
                userId_blockedId: {
                    userId,
                    blockedId
                }
            }
        });

        if (existingBlock) {
            return NextResponse.json({error: "Utilisateur déjà bloqué"}, {status: 409});
        }

        const newBlock = await prisma.blockedUser.create({
            data: {
                userId,
                blockedId
            },
            include: {
                blocked: {
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
            id: String(newBlock.blocked.id),
            blockedAt: new Date(newBlock.createdAt).toISOString()
        }, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}