import dbConnect from "@/server/lib/dbConnect";
import { getServerSession } from "next-auth";
import AccessMatrix from "@/server/models/Dashboard/accessMatrixModel";
import SidebarItem from "@/server/models/Dashboard/sidebarModel";
import DynamicComponents from "@/server/models/Dashboard/dynamicComponentsModel";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { authOptions } from "@/server/Utils/authOptions";

export async function getComponentAccessForPathname(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { pathname } = await request.json();

    if (!pathname) {
      return NextResponse.json(
        { message: "Pathname is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const roleId = session.user.roleId;
    const organizationId = session.user.organizationId;

    if (
      !userId ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(roleId) ||
      !Types.ObjectId.isValid(organizationId)
    ) {
      return NextResponse.json(
        { message: "Valid userId, roleId and organizationId are required" },
        { status: 400 }
      );
    }

    // Find the sidebar/module for this pathname
    const moduleDoc = await SidebarItem.findOne({
      href: pathname,
      isDeleted: { $ne: true }
    });
    if (!moduleDoc) {
      return NextResponse.json(
        { message: "No module found for this pathname" },
        { status: 404 }
      );
    }

    // Try ABAC (user-specific)
    let accessMatrix = await AccessMatrix.findOne({
      userId: new Types.ObjectId(userId),
      isDeleted: { $ne: true }
    });

    // Fallback to RBAC (role + org)
    if (!accessMatrix) {
      accessMatrix = await AccessMatrix.findOne({
        userId: null,
        roleId: new Types.ObjectId(roleId),
        organizationId: new Types.ObjectId(organizationId),
        isDeleted: { $ne: true }
      });

      // Fallback to RBAC (role only)
      if (!accessMatrix) {
        accessMatrix = await AccessMatrix.findOne({
          userId: null,
          roleId: new Types.ObjectId(roleId),
          isDeleted: { $ne: true }
        });
      }
    }

    if (!accessMatrix) {
      return NextResponse.json(
        { message: "No access matrix found for user" },
        { status: 404 }
      );
    }

    // Check if the user has permission for this module
    const permission = accessMatrix.permissions.find(
      (perm) => perm.module.toString() === moduleDoc._id.toString()
    );

    if (!permission) {
      return NextResponse.json(
        { message: "Forbidden: No access to this module" },
        { status: 403 }
      );
    }

    // Fetch the full DynamicComponents documents for the component IDs
    let componentsData = [];
    if (permission.components && permission.components.length > 0) {
      componentsData = await DynamicComponents.find({
        _id: { $in: permission.components },
        isDeleted: { $ne: true }
      });
    }
    // Map to only the required fields
    const filteredComponents = componentsData.map((comp) => ({
      componentName: comp.componentName,
      description: comp.description,
      status: comp.status
    }));
    return NextResponse.json(
      {
        message: "Access granted",
        components: filteredComponents
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error checking component access",
        error: error.message
      },
      { status: 500 }
    );
  }
}
