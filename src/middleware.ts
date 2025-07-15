import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAuthenticatedRequest } from "next-jwt-auth";

// Define public routes that don't require authentication
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/voice-agent",
  "/components",
];

// Function to check if a route should be treated as public
function isPublicRoute(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;

  // Check standard public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Special case for /chat-v2: only public if replay=1 is present
  if (
    pathname === "/chat-v2" ||
    pathname === "/voice-agent" ||
    pathname === "/"
  ) {
    const replayParam = request.nextUrl.searchParams.get("replay");
    return replayParam === "1";
  }

  return false;
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log("Is Authenticated: ", isAuthenticatedRequest(request));

  const isUnprotectedRoute = isPublicRoute(request);

  if (!isUnprotectedRoute && !isAuthenticatedRequest(request)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
