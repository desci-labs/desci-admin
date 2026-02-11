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

/** Allowed hostnames for SciWeave analytics queries (prod filtering) */
export const SCIWEAVE_ALLOWED_HOSTNAMES = [
  "www.sciweave.com",
  "legacy.sciweave.com",
  "xqttmvkzpjfhelao4a7cbsw22a0gzbpg.lambda-url.us-east-2.on.aws",
  "ifvqsr3wq6p56qgw2vunimygli0tsgiq.lambda-url.us-east-2.on.aws",
];

const HOSTNAMES_SQL = SCIWEAVE_ALLOWED_HOSTNAMES.map((h) => `'${h}'`).join(", ");
const PROD_USER_FILTER = `username NOT LIKE '%@desci.com' AND host_name IN (${HOSTNAMES_SQL})`;

/** Prod filter clause prefixed with AND — use after other WHERE conditions */
export const PROD_FILTER_AND = IS_PROD ? `AND ${PROD_USER_FILTER}` : "";

/** Prod filter clause suffixed with AND — use before other WHERE conditions */
export const PROD_FILTER_LEADING = IS_PROD ? `${PROD_USER_FILTER} AND` : "";
