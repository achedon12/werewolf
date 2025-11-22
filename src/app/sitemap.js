import fs from 'fs';
import path from 'path';
import {siteUrl} from "@/utils/publicEmail.js";

const APP_DIR = path.join(process.cwd(), 'src', 'app');
const PAGE_REGEX = /^page\.(js|jsx|ts|tsx)$/;
const SKIP_DIRS = new Set(['api', 'admin']);

const hasPageFile = (dir) => {
    try {
        return fs.readdirSync(dir).some(f => PAGE_REGEX.test(f));
    } catch {
        return false;
    }
}

const walk = (dir, routeBase = '') => {
    const routes = [];
    if (hasPageFile(dir)) {
        routes.push({dir, route: routeBase === '' ? '/' : routeBase});
    }

    const entries = fs.readdirSync(dir, {withFileTypes: true});
    for (const e of entries) {
        if (!e.isDirectory()) continue;
        if (SKIP_DIRS.has(e.name)) continue;
        if (e.name.includes('[')) continue; // skip dynamic segments
        const childDir = path.join(dir, e.name);
        const seg = e.name;
        const childBase = routeBase === '' ? `/${seg}` : `${routeBase}/${seg}`;
        routes.push(...walk(childDir, childBase));
    }
    return routes;
}

export default function sitemap() {
    if (!fs.existsSync(APP_DIR)) return [];

    const found = walk(APP_DIR);
    return found.map(({dir, route}) => {
        let lastModified = new Date();
        try {
            const pageFile = fs.readdirSync(dir).find(f => PAGE_REGEX.test(f));
            if (pageFile) {
                const stat = fs.statSync(path.join(dir, pageFile));
                lastModified = stat.mtime;
            }
        } catch {
        }
        const depth = route === '/' ? 0 : route.split('/').length - 1;
        const priority = route === '/' ? 1.0 : Math.max(0.3, 1 - depth * 0.1);

        return {
            url: new URL(route, siteUrl).toString(),
            lastModified,
            changeFrequency: depth <= 1 ? 'weekly' : 'monthly',
            priority: Number(priority.toFixed(2)),
        };
    });
}