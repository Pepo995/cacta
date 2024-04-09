import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { env } from "./env.mjs";
import { COMPLETE_SIGNUP, HOME, SIGN_IN } from "./utils/constants/routes";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request, secret: env.NEXTAUTH_SECRET });

  if (!token) {
    if (pathname === SIGN_IN) {
      return NextResponse.next();
    }

    const url = new URL(SIGN_IN, request.url);
    return NextResponse.redirect(url);
  }

  if (token.pendingVerification === true) {
    if (pathname === COMPLETE_SIGNUP) {
      return NextResponse.next();
    }

    const url = new URL(COMPLETE_SIGNUP, request.url);
    return NextResponse.redirect(url);
  }

  if (pathname === SIGN_IN || pathname === COMPLETE_SIGNUP) {
    const url = new URL(HOME, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|confirm-invite|icons/.*|images/.*|locales/.*).*)",
  ],
};
