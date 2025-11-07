import {PrismaClient} from "@/generated/prisma";
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
    const startConnect = Date.now();
    try {
        await prisma.$connect();
    } catch (e) {
        return NextResponse.json({ db: { status: "down", message: e.message } }, { status: 500 });
    }
    const connectMs = Date.now() - startConnect;

    const startQuery = Date.now();
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
        await prisma.$disconnect();
        return NextResponse.json({ db: { status: "down", connectMs, message: e.message } }, { status: 500 });
    }
    const queryMs = Date.now() - startQuery;

    await prisma.$disconnect();
    return NextResponse.json({ db: { status: "ok", connectMs, queryMs } }, { status: 200 });
}