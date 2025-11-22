import jwt from "jsonwebtoken";
import {NextResponse} from "next/server";
import {PrismaClient} from "@/generated/prisma";
import {mailer} from "@/utils/mailer.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req) {
    try {
        const auth = req.headers.get('authorization') || '';
        if (!auth.startsWith('Bearer ')) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }
        const token = auth.split(' ')[1];
        let payload;
        try {
            payload = jwt.verify(token, JWT_SECRET);
            if (!payload || !payload.id) return NextResponse.json({error: "Token invalide"}, {status: 401});
        } catch {
            return NextResponse.json({error: "Token invalide"}, {status: 401});
        }


        if (!payload.role || (payload.role !== 'admin' && payload.role !== 'moderator')) {
            return NextResponse.json({error: "Accès admin requis"}, {status: 403});
        }

        const body = await req.json();
        const {subject, message, recipientType, role, emails} = body;

        if (!subject || !message) {
            return NextResponse.json({error: 'Champs manquants'}, {status: 400});
        }

        let recipients = [];
        if (recipientType === 'all') {
            recipients = await prisma.user.findMany({select: {email: true}}).then(users => users.map(u => u.email));
        } else if (recipientType === 'role') {
            recipients = await prisma.user.findMany({
                where: {role: role || 'user'},
                select: {email: true}
            }).then(users => users.map(u => u.email));
        } else if (recipientType === 'custom' && Array.isArray(emails)) {
            recipients = emails;
        } else {
            return NextResponse.json({error: 'Type de destinataire invalide'}, {status: 400});
        }

        for (const email of recipients) {
            await mailer({
                to: email,
                subject: subject,
                html: message
            });
        }

        return NextResponse.json({message: 'Envoi simulé', sent: recipients.length});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: 'Erreur interne'}, {status: 500});
    }
}