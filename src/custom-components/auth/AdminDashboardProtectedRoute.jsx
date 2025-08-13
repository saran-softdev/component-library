"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * AdminDashboardProtectedRoute - Component that handles authentication and role-based access control
 *
 * This component ensures that:
 * 1. The user is authenticated
 * 2. The user has the required role(s) to access the protected route
 * 3. Shows appropriate loading state and redirect behavior
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authentication passes
 * @param {boolean} props.requireAuth - Whether authentication is required
 * @param {string[]} props.requiredRoles - Array of roles that have access to this route
 */
function AdminDashboardProtectedRoute({
  children,
  requireAuth = true,
  requiredRoles = []
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't do anything while session is loading
    if (status === "loading") {
      return;
    }

    // Authentication check
    if (requireAuth && !session) {
      // Redirect to login page if not authenticated
      router.push("/auth/login");
      return;
    }

    // Role-based access check
    if (session && requiredRoles.length > 0) {
      const userRole = session.user?.role || "viewer";
      const hasRequiredRole = requiredRoles.includes(userRole);

      if (!hasRequiredRole) {
        // Redirect to access denied page if not authorized
        router.push("/access-denied");
        return;
      }
    }

    // If we get here, user is authorized
    setAuthorized(true);
    setLoading(false);
  }, [session, status, requireAuth, requiredRoles, router]);

  // Show loading state
  if (loading || status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied message if not authorized (this is a fallback,
  // normally the router.push above should navigate away)
  if (!authorized) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You don&apos;t have permission to access this page.
        </p>
        <button
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => router.push("/")}
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Render children if authorized
  return <>{children}</>;
}

export default AdminDashboardProtectedRoute;
