import { NODES_API_URL } from "../config";
import { AUTH_COOKIE_FIELDNAME } from "../constants";

/**
 * Forwards the local cookie created in dev environments, incase the cross-domain
 * cookie from the backend is discarded. (no SSL env, lax sameSite)
 */
export function forwardCrossDomainCookie(): Record<string, string> {
  if (
    process.env.NEXT_PUBLIC_LOCAL_AUTH_COOKIE !== "true" ||
    typeof window === "undefined"
  )
    return {};

  const cookieName = AUTH_COOKIE_FIELDNAME;

  console.log("[forwardCrossDomainCookie]:: ", document.cookie, cookieName);
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return { authorization: `Bearer ${value}` };
    }
  }
  return {};
}

/**
 * Centralized helper to apply dev cookies when working in
 * cross domain local -> dev environments.
 * Shouldn't be used in PROD!
 * @param authToken - JWT returned from auth endpoints when requested in DEV environments. (dev=true in req body.)
 * This is needed for SSR proxied authenticated calls to work correctly.
 */
export function applyDevCookies(authToken: string) {
  if (typeof window === "undefined") return; // Only run on the client

  const fullDomain = window.location.hostname;

  // Extract root domain (e.g., journals.desci.com -> desci.com)
  const domainParts = fullDomain.split(".");
  const rootDomain =
    domainParts.length >= 2 ? domainParts.slice(-2).join(".") : fullDomain;

  if (!NODES_API_URL.includes(rootDomain)) {
    const isVercel = fullDomain.includes("vercel.app");
    const domain = isVercel ? fullDomain : `.${rootDomain}`;
    if (isVercel) console.log("[Dev Cookie] Vercel scoped cookie applied");

    // Manually set the cookie for cross-domain scenarios
    const cookieParams = {
      name: AUTH_COOKIE_FIELDNAME,
      value: authToken,
      path: "/",
      domain: rootDomain === "localhost" ? undefined : domain,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
    };
    const cookieString = `${cookieParams.name}=${cookieParams.value}; path=${
      cookieParams.path
    }${cookieParams.domain ? `; domain=${cookieParams.domain}` : ""}; ${
      cookieParams.secure ? "secure" : ""
    }; samesite=${cookieParams.sameSite}; max-age=${cookieParams.maxAge}`;
    document.cookie = cookieString;

    const apiUrlParts = NODES_API_URL.split("://")[1].split(".");
    const apiDomain =
      apiUrlParts.length >= 2
        ? `.${apiUrlParts.slice(-2).join(".")}`
        : apiUrlParts[0];

    console.log(
      `[DEV COOKIES]Cross-domain API cookie set for SSR forwarding ${rootDomain} -> ${apiDomain}`
    );
  }
}

/**
 * Removes the dev auth cookies
 */
export function removeDevCookies() {
  if (typeof window === "undefined") return; // Only run on the client

  const fullDomain = window.location.hostname;

  const domainParts = fullDomain.split(".");
  const rootDomain =
    domainParts.length >= 2 ? domainParts.slice(-2).join(".") : fullDomain;

  document.cookie = `${AUTH_COOKIE_FIELDNAME}=; path=/; domain=${rootDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=none; secure`;
}
