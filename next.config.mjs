/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      fs: "./src/utils/stubFs.ts",
    },
  },

  webpack: (config, { isServer }) => {
    // Handle fallbacks for both server and client
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // nodes-lib uses fs to stream files in direct uploads (unused in webapp)
      "rdf-canonize-native": false, // disabled by transient dep in browser setting
      bufferutil: false, // optional peer dep nextjs doesn't include
      "utf-8-validate": false, // optional peer dep nextjs doesn't include
    };

    return config;
  },
};

export default nextConfig;
