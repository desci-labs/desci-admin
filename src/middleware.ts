import type { NextRequest } from "next/server";
import { AUTH_COOKIE_FIELDNAME } from "./lib/constants";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get(AUTH_COOKIE_FIELDNAME)?.value;
  console.log(
    "[middleware]",
    request.nextUrl.pathname,
    // request.body,
    AUTH_COOKIE_FIELDNAME,
    currentUser
  );

  if (currentUser && ["/login"].includes(request.nextUrl.pathname)) {
    return Response.redirect(new URL("/", request.url));
  }

  if (!currentUser && !request.nextUrl.pathname.startsWith("/login")) {
    return Response.redirect(new URL("/login", request.url));
  }

}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
