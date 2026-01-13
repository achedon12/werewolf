import {NextResponse} from "next/server";
import {PatchNotes} from "@/utils/PatchNotes.js";

export async function GET(request, context) {
    const {version} = await context.params;

    const note = PatchNotes.find(note => note.version === version);

    if (!note) {
        return NextResponse.json({error: 'Patch note not found'}, {status: 404});
    }

    return NextResponse.json(note);
}