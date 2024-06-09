import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const authRoutes = ["/auth/sign-in", "/auth/sign-up", "/auth/error"];

  const isPublicRoute = nextUrl.pathname === "/";
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return;

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    let redirectUrl = nextUrl.pathname;
    if (nextUrl.search) {
      redirectUrl += nextUrl.search;
    }

    const encodedRedirectUrl = encodeURIComponent(redirectUrl);

    return Response.redirect(new URL(`/auth/sign-in?redirectTo=${encodedRedirectUrl}`, nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
