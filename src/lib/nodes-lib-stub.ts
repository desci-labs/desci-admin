// Stub implementation for @desci-labs/nodes-lib to resolve build issues
// This provides the minimal interface needed by the config.ts file

export enum NodesEnv {
  LOCAL = "local",
  DEV = "dev",
  STAGING = "staging",
  PROD = "prod",
}

export const NODESLIB_CONFIGS = {
  local: {
    apiUrl: "http://localhost:5420",
  },
  dev: {
    apiUrl: "https://nodes-api-dev.desci.com",
  },
  staging: {
    apiUrl: "https://nodes-api-staging.desci.com",
  },
  prod: {
    apiUrl: "https://nodes-api.desci.com",
  },
};
// Default config to dev environment
let config = NODESLIB_CONFIGS[NodesEnv.DEV];
console.log(
  `[nodes-lib::config] initialising with nodes-dev config. Use setConfig and setApiKey to change this: \n${JSON.stringify(
    NODESLIB_CONFIGS.dev,
    undefined,
    2
  )}`
);
console.log(
  "[nodes-lib::config] config.apiKey is unset; non-public API requests WILL fail unless running in browser with auth cookies!"
);
/**
 * Set API key in config. Note that it needs to be created in the correct environment:
 * if apiUrl is `nodes-api-dev.desci.com`, generate the API key at
 * `https://nodes-dev.desci.com`.
 */
export const setApiKey = (apiKey: string) => {
  console.log(
    `[nodes-lib::config] setting new apiKey: \n${apiKey.slice(0, 5) + "..."}`
  );
};
/**
 * Set a new configuration. You likely want a preset from the `CONFIGS` object.
 */
export const setNodesLibConfig = (
  newConfig: (typeof NODESLIB_CONFIGS)[NodesEnv]
) => {
  config = newConfig;
};
/**
 * Get the current config. Note that apiKey may be undefined, something that is
 * masked by the type to allow browser auth cookie override.
 */
export const getNodesLibInternalConfig = () => {
  return config;
};
