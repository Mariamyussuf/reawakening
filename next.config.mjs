/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@prisma/adapter-libsql', '@libsql/client', 'pdfkit'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default nextConfig;
