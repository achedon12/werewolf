import {NextResponse} from "next/server";
import {PrismaClient} from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req, {params}) {
    const {id, userId} = await params;

    const gameId = id;
    if (!gameId) {
        return NextResponse.json({error: "ID manquant"}, {status: 400});
    }

    const game = await prisma.game.findUnique({
        where: {id: gameId},
        include: {players: true}
    });

    const user = await prisma.user.findUnique({where: {id: userId}});

    if (!game) {
        return NextResponse.json({error: "Partie non trouvée"}, {status: 404});
    }

    if (!user) {
        return NextResponse.json({error: "Utilisateur non trouvé"}, {status: 404});
    }

    const player = game.players.find(p => p.userId === userId);
    if (!player) {
        return NextResponse.json({error: "Le joueur n'est pas dans la partie"}, {status: 400});
    }

    if (game.state === "En attente") {
        await prisma.player.delete({
            where: {id: player.id}
        });

        game.players = game.players.filter(p => p.userId !== userId);

        if (game.players.length === 0) {
            await prisma.game.delete({
                where: {id: gameId}
            });
            return NextResponse.json({message: "Partie supprimée car aucun joueur restant"});
        }
    } else {
        await prisma.player.update({
            where: {id: player.id},
            data: {isAlive: false}
        });

        if (game.players.every(p => !p.isAlive || p.userId === userId)) {
            await prisma.game.update({
                where: {id: gameId},
                data: {state: "Terminée"}
            });
            return NextResponse.json({message: "Le joueur est mort. La partie est terminée car aucun joueur vivant restant."});
        }
    }

    if (player.isAdmin && game.players.length > 0) {
        const newAdmin = game.players[0];
        await prisma.player.update({
            where: {id: newAdmin.id},
            data: {isAdmin: true}
        });
    }

    return NextResponse.json({message: "Joueur a quitté la partie"});
}