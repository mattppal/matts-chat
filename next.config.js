const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname),
        };
        return config;
    },
    env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    },
};

module.exports = nextConfig;