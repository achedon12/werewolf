import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import {siteUrl} from "@/utils/publicEmail.js";

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://werewolf.leoderoin.fr';

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href={`${SITE_URL}/logo.png`}/>
            <link rel="shortcut icon" href={`${SITE_URL}/logo.png`}/>
            <link rel="apple-touch-icon" href={`${SITE_URL}/logo.png`}/>
            <meta name="theme-color" content="#ffffff"/>
            <link rel="canonical" href={SITE_URL}/>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
        </body>
        </html>
    );
}

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Jouez au Loup-Garou en ligne',
    description: 'Jouez au Loup-Garou en ligne avec vos amis, gratuitement et immersivement.',
    keywords: [
        'Loup-Garou',
        'jeu de société',
        'jeu en ligne',
        'werewolf',
        'multijoueur',
        'plateforme',
        'amis',
        'online',
        'werewolf',
        'gratuit',
        'friends'
    ],
    authors: [{name: 'Achedon12 - leo deroin', url: 'https://leoderoin.fr'}],
    openGraph: {
        title: 'Online Werewolf - Jouez au Loup-Garou en ligne',
        description: 'Jouez au Loup-Garou en ligne avec vos amis, gratuitement et sans inscription.',
        url: siteUrl,
        siteName: 'Online Werewolf',
        images: [
            {
                url: `${siteUrl}/logo.png`,
                width: 1200,
                height: 630,
                alt: 'Online Werewolf - Loup-Garou en ligne',
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
    icons: {
        icon: `${siteUrl}/logo.png`,
        shortcut: `${siteUrl}/logo.png`,
        apple: `${siteUrl}/logo.png`,
    },
};