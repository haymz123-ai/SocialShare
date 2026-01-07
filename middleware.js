import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY
);

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/role-selection(.*)',
  '/dashboard(.*)',
  '/dashboard/profile(.*)',
  '/foodtruck(.*)',
  '/add-truck(.*)',
  '/my-trucks(.*)',
  '/events(.*)',
  '/book-trucks(.*)',
  '/settings(.*)'
]);

// Role-specific route matchers
const isGeneralUserRoute = createRouteMatcher([
  '/foodtruck(.*)',
  '/dashboard/profile(.*)',
  '/dashboard/general(.*)'
]);

const isFoodVendorRoute = createRouteMatcher([
  '/dashboard/profile(.*)',
  '/foodtruck(.*)',
  '/dashboard/add-truck(.*)',
  '/dashboard/my-trucks(.*)',
  '/dashboard/vendor(.*)'
]);

const isEventPlannerRoute = createRouteMatcher([
  '/dashboard/profile(.*)',
  '/settings(.*)',
  '/find-trucks(.*)',
  '/events(.*)',
  '/book-trucks(.*)',
  '/dashboard/planner(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();
  
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  if (userId && isProtectedRoute(req)) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('role, status')
        .eq('clerk_user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user:', error);
      }

      // If user hasn't selected role, redirect to role selection
      if (!user && !req.nextUrl.pathname.startsWith('/role-selection')) {
        return NextResponse.redirect(new URL('/role-selection', req.url));
      }

      // If user has selected role, check role-based access
      if (user && user.status === 'active') {
        const userRole = user.role;

        // Check General User routes
        if (isGeneralUserRoute(req) && userRole !== 'general_user') {
          // Allow all roles to access find-trucks and profile
          if (!req.nextUrl.pathname.startsWith('/foodtruck') && 
              !req.nextUrl.pathname.startsWith('/dashboard/profile')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }

        // Check Food Vendor routes
        if (isFoodVendorRoute(req) && userRole !== 'food_vendor') {
          // Allow general access to find-trucks and profile
          if (req.nextUrl.pathname.startsWith('/add-truck') || 
              req.nextUrl.pathname.startsWith('/my-trucks') ||
              req.nextUrl.pathname.startsWith('/dashboard/vendor')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }

        // Check Event Planner routes
        if (isEventPlannerRoute(req) && userRole !== 'event_planner') {
          // Allow general access to find-trucks and profile
          if (req.nextUrl.pathname.startsWith('/events') || 
              req.nextUrl.pathname.startsWith('/book-trucks') ||
              req.nextUrl.pathname.startsWith('/settings') ||
              req.nextUrl.pathname.startsWith('/dashboard/planner')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }

        // If user is on role-selection but already has a role, redirect to dashboard
        if (req.nextUrl.pathname.startsWith('/role-selection')) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      }
    } catch (error) {
      console.error('Middleware error:', error);
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};