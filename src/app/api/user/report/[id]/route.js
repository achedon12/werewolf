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
        const {id} = await params;

        if (!id) {
            return NextResponse.json({error: "ID du signalement manquant"}, {status: 400});
        }

        const report = await prisma.report.findUnique({
            where: {id}
        });

        if (!report) {
            return NextResponse.json({error: "Signalement non trouvé"}, {status: 404});
        }

        await prisma.report.delete({
            where: {id}
        });

        return NextResponse.json({message: "Signalement supprimé avec succès"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}