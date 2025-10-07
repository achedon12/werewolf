import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function GET(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);

        if (!payload || !payload.id) {
            return NextResponse.json({ error: "Token invalide" }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
        orderBy: { victories: "desc" },
        select: { id: true, victories: true }
    });

    const rank = users.findIndex(u => u.id === payload.id) + 1;

    return NextResponse.json({ rank });
}