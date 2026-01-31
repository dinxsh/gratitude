/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        // Suppress warnings for Stellar SDK dependencies
        config.ignoreWarnings = [
            { module: /node_modules\/sodium-native/ },
            { module: /node_modules\/require-addon/ },
        ];
        return config;
    },
};

module.exports = nextConfig;
