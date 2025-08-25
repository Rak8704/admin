import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/"].includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isPublicRoute) {
    return;
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }
  
  const { role } = req.auth.user;

  // Restrict sub-admins from making changes
  if (role === "SUBADMIN") {
    // Allow sub-admins to view pages but not make changes
    // Check if the request is a POST, PUT, DELETE request
    if (req.method !== "GET" && nextUrl.pathname.startsWith("/api")) {
      // Allow GET requests to the root API endpoint
      if (nextUrl.pathname !== "/api") {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }
    
    // Restrict access to certain admin-only pages
    const adminOnlyPaths = [
      "/sub-admins", // Can't manage other sub-admins
    ];
    
    for (const path of adminOnlyPaths) {
      if (nextUrl.pathname.startsWith(path)) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }
  }

  // Existing restrictions
  if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (nextUrl.pathname.startsWith("/support") && role !== "SUBADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};