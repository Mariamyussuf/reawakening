/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@prisma/adapter-libsql', '@libsql/client', 'pdfkit'],
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default nextConfig;
