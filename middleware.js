import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/connection(.*)',
  '/vibeediting',
  '/dashboard(.*)',
  '/pricing(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Exclude /story/[shareId] from protected routes
  if (!req.url.includes('/story/') && isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};