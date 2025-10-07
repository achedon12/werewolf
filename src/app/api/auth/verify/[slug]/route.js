import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const slug = params.slug;

    if (!slug || slug.length < 10) {
        return new Response(JSON.stringify({
            success: false,
            message: "Token de vérification invalide."
        }), {
            status: 400,
            headers: {"Content-Type": "application/json"}
        });
    }

    const user = await prisma.user.findFirst({
        where: {verificationToken: slug}
    });

    if (!user) {
        return new Response(JSON.stringify({
            success: false,
            message: "Token non trouvé ou déjà utilisé."
        }), {
            status: 404,
            headers: {"Content-Type": "application/json"}
        });
    }

    await prisma.user.update({
        where: {id: user.id},
        data: {
            verified: true,
            verificationToken: null
        }
    });

    return new Response(JSON.stringify({
        success: true,
        message: "Compte vérifié avec succès."
    }), {
        status: 200,
        headers: {"Content-Type": "application/json"}
    });
}