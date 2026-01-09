import {PatchNotes} from "@/utils/PatchNotes.js";
import PatchNotesDetailPage from "@/components/patchNotes/PatchNotesDetailPage.jsx";

export function generateStaticParams() {
    return PatchNotes.map((patch) => ({
        version: patch.version,
    }));
}

export async function generateMetadata({params}) {
    const { version } = await params;
    const patch = PatchNotes.find(p => p.version === version);

    if (!patch) {
        return {
            title: 'Patch Note Introuvable - Werewolf',
        };
    }

    return {
        title: `${patch.version} - ${patch.title}`,
        description: patch.description || patch.changes[0]?.changes[0]?.description || `Détails de la mise à jour ${patch.version}`,
        openGraph: {
            title: `${patch.version} - ${patch.title}`,
            description: patch.description || patch.changes[0]?.changes[0]?.description,
            images: patch.image ? [patch.image] : [],
            type: 'article',
            publishedTime: patch.date,
        },
    };
}

const PatchNotePage = ({params}) => {
    return <PatchNotesDetailPage params={params} />;
};

export default PatchNotePage;