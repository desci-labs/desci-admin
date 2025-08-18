import {
  setNodesLibConfig,
  NodesEnv,
  NODESLIB_CONFIGS,
  getNodesLibInternalConfig,
} from "@desci-labs/nodes-lib";

export const DPID_RESOLVER_URL =
  process.env.NEXT_PUBLIC_DPID_URL_OVERRIDE || "https://dev-beta.dpid.org";

export const configureNodesLib = () => {
  const env = process.env.NEXT_PUBLIC_NODESLIB_ENV;
  const allowed = env && Object.keys(NODESLIB_CONFIGS).includes(env);
  if (!allowed) {
    throw new Error(`Invalid NODESLIB_ENV: ${env}`);
  }
  setNodesLibConfig(NODESLIB_CONFIGS[env as NodesEnv]);
};

let appConfigLoaded = false;
/**
 * Use this function to get infrastructure related configuration values.
 */
export const getNodesConfig = () => {
  if (!appConfigLoaded) {
    configureNodesLib();
    appConfigLoaded = true;
  }
  return getNodesLibInternalConfig();
};

export const NODES_API_URL = getNodesConfig().apiUrl;
export const RETURN_DEV_TOKEN =
  process.env.NEXT_PUBLIC_LOCAL_AUTH_COOKIE === "true" || false;

export const IS_DEV = process.env.NEXT_ENV === "development";
export const IS_PROD = process.env.NEXT_ENV === "production";
console.log("CONFIG NEXT_ENV", { IS_DEV, IS_PROD });
