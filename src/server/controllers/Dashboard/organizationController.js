import dbConnect from "@/server/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/server/utils/authOptions";
import {
  createOrganizationService,
  getAllOrganizationsService,
  getOrganizationByIdService,
  updateOrganizationService,
  softDeleteOrganizationService,
  restoreOrganizationService,
  getDeletedOrganizationsService,
  hardDeleteOrganizationService
} from "@/server/services/organizationService";

// Hardcoded or configurable roleId (based on your context)
const TARGET_ROLE_ID = "68906f5b7d4d0f0b380ea6c8";

export async function createOrganization(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    const result = await createOrganizationService({
      ...body,
      createdBy: session?.user?.id || null
    });

    return NextResponse.json(
      {
        message: "Organization created successfully",
        organization: result.organization,
        accessMatrixUpdated: result.accessMatrixUpdated
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Organization Error:", error);
    return NextResponse.json(
      {
        message: "Error creating organization",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all organizations
export async function getAllOrganizations(request) {
  await dbConnect();

  try {
    const organizations = await getAllOrganizationsService();

    return NextResponse.json(
      {
        message: "Organizations retrieved successfully",
        organizations
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get All Organizations Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving organizations",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get a specific organization by ID
export async function getOrganizationById(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const organization = await getOrganizationByIdService(id);

    return NextResponse.json(
      {
        message: "Organization retrieved successfully",
        organization
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Organization By ID Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving organization",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Update an organization
export async function updateOrganization(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const updatedOrganization = await updateOrganizationService(body);

    return NextResponse.json(
      {
        message: "Organization updated successfully",
        organization: updatedOrganization
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Organization Error:", error);
    return NextResponse.json(
      {
        message: "Error updating organization",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Soft delete an organization
export async function softDeleteOrganization(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id, deletedBy } = body;
    const updatedOrganization = await softDeleteOrganizationService(
      id,
      deletedBy
    );

    return NextResponse.json(
      {
        message: "Organization deleted successfully",
        organization: updatedOrganization
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Soft Delete Organization Error:", error);
    return NextResponse.json(
      {
        message: "Error deleting organization",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Restore a soft deleted organization
export async function restoreOrganization(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id, restoredBy } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid organization ID is required" },
        { status: 400 }
      );
    }

    // Update the restored organization with the restoredBy information
    const updatedData = {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      restoredAt: new Date(),
      restoredBy: restoredBy || null
    };

    // Use the static method from the model
    const restoredOrganization = await Organization.findOneAndUpdate(
      { _id: id, isDeleted: true },
      updatedData,
      { new: true }
    );

    if (!restoredOrganization) {
      return NextResponse.json(
        { message: "Deleted organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Organization restored successfully",
        organization: restoredOrganization
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Restore Organization Error:", error);
    return NextResponse.json(
      {
        message: "Error restoring organization",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Get all deleted organizations
export async function getDeletedOrganizations(request) {
  await dbConnect();

  try {
    // Explicitly query for deleted organizations
    const deletedOrganizations = await Organization.find({ isDeleted: true });

    return NextResponse.json(
      {
        message: "Deleted organizations retrieved successfully",
        organizations: deletedOrganizations
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Deleted Organizations Error:", error);
    return NextResponse.json(
      {
        message: "Error retrieving deleted organizations",
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Hard delete an organization (use with caution)
export async function hardDeleteOrganization(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid organization ID is required" },
        { status: 400 }
      );
    }

    const result = await Organization.hardDelete(id);

    if (!result) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Organization permanently deleted"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Hard Delete Organization Error:", error);
    return NextResponse.json(
      {
        message: "Error permanently deleting organization",
        error: error.message
      },
      { status: 500 }
    );
  }
}
