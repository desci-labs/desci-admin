import { NODES_API_URL } from "@/lib/config";

/**
 * To enable a wildcard auth cookie that works across all subdomains, we need to modify the auth cookie name for each domain.
 */
const AUTH_COOKIE_DOMAIN_MAPPING: { [key: string]: string } = {
    "https://nodes-api.desci.com": "auth",
    "https://nodes-api-dev.desci.com": "auth-dev",
    "https://nodes-api-staging.desci.com": "auth-stage",
    "https://nodes.desci.com": "auth",
    "https://nodes-dev.desci.com": "auth-dev",
    "https://nodes-staging.desci.com": "auth-stage",
    "http://localhost:5420": "auth",
};

export const AUTH_COOKIE_FIELDNAME = AUTH_COOKIE_DOMAIN_MAPPING[NODES_API_URL] || "auth";