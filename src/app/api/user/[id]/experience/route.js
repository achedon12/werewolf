import {NextResponse} from "next/server";
import {calculateLevel} from "@/utils/Experience.js";
import {PrismaClient} from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
    const {id} = await params;
    const body = await req.json();
    const xpGained = body.xpGained;

    if (typeof xpGained !== 'number' || xpGained < 0) {
        return NextResponse.json({ error: 'XP invalide' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const oldLevel = user.level || 0;
        let newExperience = (user.experience || 0) + xpGained;
        const newLevel = calculateLevel(newExperience);
        const leveledUp = newLevel > oldLevel;
        if (leveledUp) {
            newExperience = 0;
        }

        await prisma.user.update({
            where: { id },
            data: {
                experience: newExperience,
                level: newLevel
            }
        });

        return NextResponse.json({
            experience: newExperience,
            level: newLevel,
            leveledUp,
            xpGained
        }, { status: 200 });
    } catch (err) {console.error('Erreur mise à jour XP:', err);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}