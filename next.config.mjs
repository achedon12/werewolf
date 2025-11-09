import {createRequire} from 'module';

const require = createRequire(import.meta.url);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizeCss: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'werewolf.leoderoin.fr',
                pathname: '/**',
            },
        ],
    },
};

export default withBundleAnalyzer(nextConfig);