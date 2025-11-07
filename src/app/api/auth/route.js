import {NextResponse} from "next/server";
import {PrismaClient} from "@/generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {mailer} from "@/lib/mailer";
import crypto from "crypto";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req) {
    const {action, email, password, name, nickname} = await req.json();

    if (action === "register") {
        const existing = await prisma.user.findUnique({where: {email}});
        if (existing) return NextResponse.json({error: "Email déjà utilisé"}, {status: 400});
        const hash = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const user = await prisma.user.create({
            data: {email, password: hash, name, verificationToken, nickname}
        });

        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify/${verificationToken}`;
        await mailer({
            to: email,
            subject: "Bienvenue sur Werewolf.app !",
            html: `
                <p>Merci pour votre inscription, ${name} !</p>
                <p>Veuillez vérifier votre compte en cliquant sur ce lien : <a href="${verifyUrl}">Vérifier mon compte</a></p>
            `
        });

        const token = jwt.sign({id: user.id, role: user.role || "user"}, JWT_SECRET, {expiresIn: "7d"});
        return NextResponse.json({user: {id: user.id, email: user.email, name: user.name}, token});
    }

    if (action === "login") {
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) return NextResponse.json({error: "Identifiants invalides"}, {status: 401});
        if (!user || !(await bcrypt.compare(password, user.password)))
            return NextResponse.json({error: "Identifiants invalides"}, {status: 401});
        const token = jwt.sign({id: user.id, role: user.role || "user"}, JWT_SECRET, {expiresIn: "7d"});
        return NextResponse.json({user, token});
    }

    return NextResponse.json({error: "Action inconnue"}, {status: 400});
}