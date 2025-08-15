import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove turbopack as it's not supported in Next.js 14
  // turbopack: {
  //   resolveAlias: {
  //     fs: "./src/utils/stubFs.ts",
  //   },
  // },

  webpack: (config, { isServer }) => {
    // Handle fallbacks for both server and client
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // nodes-lib uses fs to stream files in direct uploads (unused in webapp)
      "rdf-canonize-native": false, // disabled by transient dep in browser setting
      bufferutil: false, // optional peer dep nextjs doesn't include
      "utf-8-validate": false, // optional peer dep nextjs doesn't include
    };

    // Add externals to prevent problematic packages from being bundled
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        ky: "ky",
        "ky-universal": "ky-universal",
      });
    }

    // Use alias to redirect problematic imports to stubs
    config.resolve.alias = {
      ...config.resolve.alias,
      "@desci-labs/nodes-lib": path.resolve(
        __dirname,
        "src/lib/nodes-lib-stub.ts"
      ),
    };

    return config;
  },
};

export default nextConfig;
