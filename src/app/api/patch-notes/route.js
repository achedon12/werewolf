import {NextResponse} from "next/server";
import {PatchNotes} from "@/utils/PatchNotes.js";

export async function GET(req) {
    return NextResponse.json(PatchNotes)
}