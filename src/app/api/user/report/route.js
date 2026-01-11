import {NextResponse} from "next/server";
import {PrismaClient} from "@/generated/prisma";

const prisma = new PrismaClient();

async function sendDiscordWebhook(report, reportedUser, reporterUser) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_REPORT_URL;

    if (!webhookUrl) {
        console.warn('Discord webhook URL not configured');
        return;
    }

    const embed = {
        title: '🚨 Nouveau Signalement',
        color: 0xFF4444,
        fields: [
            {
                name: 'Joueur signalé',
                value: reportedUser?.nickname || 'Inconnu',
                inline: true
            },
            {
                name: 'Signalé par',
                value: reporterUser?.nickname || 'Inconnu',
                inline: true
            },
            {
                name: 'Motif',
                value: report.reason,
                inline: false
            },
            {
                name: 'Détails',
                value: report.details || 'Aucun détail fourni',
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Werewolf Report System'
        }
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({embeds: [embed]})
        });

        if (!response.ok) {
            console.error('Discord webhook error:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending Discord webhook:', error);
    }
}

export async function POST(req) {
    try {
        const {reportedUserId, reporterUserId, reason, details} = await req.json();

        if (!reportedUserId || !reporterUserId || !reason) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        if (reportedUserId === reporterUserId) {
            return NextResponse.json({error: "You cannot report yourself"}, {status: 400});
        }

        const report = await prisma.report.create({
            data: {
                reportedId: reportedUserId,
                reporterId: reporterUserId,
                reason,
                details,
            },
        });

        const reportedUser = await prisma.user.findUnique({where: {id: reportedUserId}});
        const reporterUser = await prisma.user.findUnique({where: {id: reporterUserId}});

        await sendDiscordWebhook(report, reportedUser, reporterUser);

        return NextResponse.json({message: "Report submitted successfully"}, {status: 200});
    } catch (error) {
        console.error("Error processing report:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}