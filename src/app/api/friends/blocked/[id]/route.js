import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

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
        const {id: blockedId} = await params;

        if (!blockedId) {
            return NextResponse.json({error: "blockedId requis"}, {status: 400});
        }

        const blockedUser = await prisma.blockedUser.findUnique({
            where: {
                userId_blockedId: {
                    userId,
                    blockedId
                }
            }
        });

        if (!blockedUser) {
            return NextResponse.json({error: "Utilisateur non bloqué"}, {status: 404});
        }

        await prisma.blockedUser.delete({
            where: {
                userId_blockedId: {
                    userId,
                    blockedId
                }
            }
        });

        return NextResponse.json({message: "Utilisateur débloqué"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}