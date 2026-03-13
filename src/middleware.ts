import type { NextRequest } from "next/server";
import { AUTH_COOKIE_FIELDNAME } from "./lib/constants";

const UNAUTH_PATHS = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get(AUTH_COOKIE_FIELDNAME)?.value;
  const path = request.nextUrl.pathname;
  const isUnauthPath = UNAUTH_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

  if (currentUser && isUnauthPath) {
    return Response.redirect(new URL("/", request.url));
  }

  if (!currentUser && !isUnauthPath) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
