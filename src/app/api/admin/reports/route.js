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
        const {searchParams} = new URL(req.url);
        const pageRaw = parseInt(searchParams.get("page") || "1", 10);
        const pageSizeRaw = parseInt(searchParams.get("pageSize") || "20", 10);
        const search = (searchParams.get("search") || "").trim();

        const page = Math.max(1, isNaN(pageRaw) ? 1 : pageRaw);
        const pageSize = Math.min(100, Math.max(1, isNaN(pageSizeRaw) ? 20 : pageSizeRaw));

        const where = {};
        if (search) {
            where.OR = [
                {reporter: {email: {contains: search, mode: "insensitive"}}},
                {reported: {email: {contains: search, mode: "insensitive"}}},
                {reason: {contains: search, mode: "insensitive"}},
            ];
        }

        const total = await prisma.report.count({where});
        const reports = await prisma.report.findMany({
            where,
            orderBy: {createdAt: "desc"},
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                reason: true,
                details: true,
                createdAt: true,
                reporter: {
                    select: {
                        id: true,
                        email: true,
                        nickname: true,
                    }
                },
                reported: {
                    select: {
                        id: true,
                        email: true,
                        nickname: true,
                    }
                }
            },
        });

        const mappedReports = reports.map(r => ({
            id: String(r.id),
            reason: r.reason,
            details: r.details || null,
            createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
            reporter: {
                id: String(r.reporter.id),
                email: r.reporter.email,
                nickname: r.reporter.nickname || null,
            },
            reported: {
                id: String(r.reported.id),
                email: r.reported.email,
                nickname: r.reported.nickname || null,
            }
        }));

        const totalPages = Math.ceil(total / pageSize);

        return NextResponse.json({
            reports: mappedReports,
            total,
            page,
            pageSize,
            totalPages
        }, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}