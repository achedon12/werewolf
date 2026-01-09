import PatchNotesPage from "@/components/patchNotes/PatchNotesPage.jsx";
import {getLatestPatchNote} from "@/utils/PatchNotes.js";

export const metadata = {
    title: 'Patch Notes - Historique des Mises à Jour',
    description: 'Consultez l\'historique complet des mises à jour de werewolf, y compris les nouvelles fonctionnalités, les améliorations et les corrections de bugs.',
    openGraph: {
        title: 'Patch Notes - Historique des Mises à Jour',
        description: 'Historique des mises à jour et nouvelles fonctionnalités du jeu',
        type: 'website',
    },
};

export default function Page() {
    const latestPatch = getLatestPatchNote();

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Patch Notes - Werewolf",
        "description": "Historique des mises à jour du jeu Werewolf",
        "url": `${process.env.NEXT_PUBLIC_APP_URL}/patch-notes`,
        ...(latestPatch && {
            "mainEntity": {
                "@type": "Article",
                "headline": `${latestPatch.version} - ${latestPatch.title}`,
                "datePublished": latestPatch.date,
                "description": latestPatch.description,
            }
        })
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <PatchNotesPage />
        </>
    );
}