import {NextResponse} from "next/server";
import packageJson from '../../../../package.json';

export async function GET(req) {
    return NextResponse.json({
        appName: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        author: packageJson.author,
        license: packageJson.license
    }, {status: 200, headers: {"content-type": "application/json"}});
}