import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function PATCH(req, {params}) {
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
        const {id} = await params;

        const friendship = await prisma.friendship.findUnique({
            where: {id}
        });

        if (!friendship) {
            return NextResponse.json({error: "Demande non trouvée"}, {status: 404});
        }

        if (friendship.friendId !== userId) {
            return NextResponse.json({error: "Non autorisé"}, {status: 403});
        }

        if (friendship.status !== "pending") {
            return NextResponse.json({error: "Cette demande n'est plus en attente"}, {status: 400});
        }

        const updatedFriendship = await prisma.friendship.update({
            where: {id},
            data: {status: "accepted"},
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nickname: true,
                        avatar: true,
                        verified: true,
                    }
                },
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
            id: String(updatedFriendship.id),
            status: updatedFriendship.status,
            createdAt: new Date(updatedFriendship.createdAt).toISOString(),
            updatedAt: new Date(updatedFriendship.updatedAt).toISOString()
        }, {status: 200});
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
        const {id} = await params;

        const friendship = await prisma.friendship.findUnique({
            where: {id}
        });

        if (!friendship) {
            return NextResponse.json({error: "Demande non trouvée"}, {status: 404});
        }

        if (friendship.status !== "pending") {
            return NextResponse.json({error: "Impossible de refuser cette demande"}, {status: 400});
        }

        await prisma.friendship.delete({
            where: {id}
        });

        return NextResponse.json({message: "Demande refusée"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}