import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/server/utils/authOptions";

/**
 * Middleware to check if the user has the required role
 *
 * @param {string|string[]} allowedRoles - Role or array of roles that are allowed to access this route
 * @returns {Function} - Middleware function that checks the user's role
 */
export function checkRole(allowedRoles) {
  return async (request) => {
    // Get user session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "Authentication required" },
          { status: 401 }
        )
      };
    }

    // Get user role from session
    const userRole = session.user.role || "guest";

    // Convert allowedRoles to array if it's a single string
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Check if user has required role
    if (!roles.includes(userRole)) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "You don't have permission to access this resource" },
          { status: 403 }
        )
      };
    }

    // User is authorized
    return {
      success: true,
      userRole
    };
  };
}

/**
 * Sidebar actions permission configuration
 */
export const SIDEBAR_PERMISSIONS = {
  // Read operations - more permissive
  getAllSidebarItems: ["pmsAdmin", "hotelOwner"],
  getSidebarItemById: ["pmsAdmin", "hotelOwner"],
  getDeletedSidebarItems: ["pmsAdmin"],

  // Write operations - more restrictive
  createSidebarItem: ["pmsAdmin"],
  updateSidebarItem: ["pmsAdmin"],
  softDeleteSidebarItem: ["pmsAdmin"],
  restoreSidebarItem: ["pmsAdmin"],
  hardDeleteSidebarItem: ["pmsAdmin"]
};

/**
 * Role management actions permission configuration
 */
export const ROLE_PERMISSIONS = {
  // Read operations
  getAllRoles: ["pmsAdmin", "hotelOwner"],
  getRoleById: ["pmsAdmin", "hotelOwner"],
  getDeletedRoles: ["pmsAdmin"],

  // Write operations
  createRole: ["pmsAdmin"],
  updateRole: ["pmsAdmin"],
  softDeleteRole: ["pmsAdmin"],
  restoreRole: ["pmsAdmin"],
  hardDeleteRole: ["pmsAdmin"]
};
