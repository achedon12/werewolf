import {NextResponse} from "next/server";
import {PrismaClient} from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
    const leaderboard = await prisma.user.findMany({
        orderBy: {victories: "desc"},
        select: {
            id: true,
            name: true,
            nickname: true,
            victories: true,
            avatar: true,
            _count: {select: {games: true}}
        },
        take: 10
    });

    const result = leaderboard.map(user => ({
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        victories: user.victories,
        avatar: user.avatar,
        games: user._count?.games ?? 0
    }));

    return NextResponse.json(result);
}