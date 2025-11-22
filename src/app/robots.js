import {siteUrl} from "@/utils/publicEmail.js";

export default function robots() {
    const isProd = process.env.NODE_ENV === "production";

    if (!isProd) {
        return {
            rules: [
                {
                    userAgent: "*",
                    disallow: ["/"],
                },
            ],
            sitemap: `${siteUrl}/sitemap.xml`,
        };
    }

    return {
        rules: [
            {
                userAgent: "*",
                disallow: [
                    "/api/",
                    "/admin/",
                    "/dashboard/",
                    "/_next/",
                    "/node_modules/",
                    "/internal/",
                    "/private/",
                    "/tmp/",
                    "/*.env$",
                    "/*?session=",
                ],
                allow: ["/"],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}