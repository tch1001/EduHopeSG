/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [],
    },
    i18n: {
        locales: ["en-SG"],
        defaultLocale: "en-SG",
    },
};

module.exports = nextConfig;