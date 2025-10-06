import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
    const leaderboard = await prisma.user.findMany({
        orderBy: { victories: "desc" },
        select: {
            id: true,
            name: true,
            nickname: true,
            victories: true,
            games: true,
            avatar: true,
        },
        take: 100
    });

    return NextResponse.json(leaderboard);
}