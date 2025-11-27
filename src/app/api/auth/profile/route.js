import {NextResponse} from "next/server";
import {PrismaClient} from "@/generated/prisma";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

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

    const user = await prisma.user.findUnique({
        where: {id: payload.id},
        include: {
            games: true,
            wins: true
        }
    });

    if (!user) {
        return NextResponse.json({error: "Utilisateur introuvable"}, {status: 404});
    }

    return NextResponse.json(user);
}

export async function PUT(req) {
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

    const user = await prisma.user.findUnique({
        where: {id: payload.id},
    });

    if (!user) {
        return NextResponse.json({error: "Utilisateur introuvable"}, {status: 404});
    }

    const body = await req.json();
    let avatarPath = user.avatar;

    if (body.avatar && body.avatar.startsWith("data:image/")) {
        const matches = body.avatar.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
            const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
            const buffer = Buffer.from(matches[2], "base64");
            const uploadDir = path.join(process.cwd(), "public", "uploads", "user");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, {recursive: true});
            }
            const fileName = `${user.id}.${ext}`;
            const filePath = path.join(uploadDir, fileName);
            try {
                fs.writeFileSync(filePath, buffer);
                const stats = fs.statSync(filePath);
            } catch (error) {
                console.error("Erreur lors de l'écriture du fichier avatar :", error);
                return NextResponse.json({error: "Erreur lors de l'upload de l'avatar"}, {status: 500});
            }
            avatarPath = `/uploads/user/${fileName}`;
        }
    }

    try {
        const updatedUser = await prisma.user.update({
            where: {id: payload.id},
            data: {
                name: body.name ?? user.name,
                nickname: body.nickname ?? user.nickname,
                email: body.email ?? user.email,
                bio: body.bio ?? user.bio,
                avatar: avatarPath,
                ambientSoundsEnabled: body.ambientSoundsEnabled ?? user.ambientSoundsEnabled,
                ambientThemeEnabled: body.ambientThemeEnabled ?? user.ambientThemeEnabled,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        return NextResponse.json({error: "Erreur lors de la mise à jour"}, {status: 500});
    }
}
