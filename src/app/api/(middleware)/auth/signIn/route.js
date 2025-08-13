import { NextResponse } from "next/server";
import dbConnect from "@/server/lib/dbConnect";
import UserModal from "@/server/models/userModal";
import Role from "@/server/models/roleModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password, organizationId } = await request.json();

    await dbConnect();

    const user = await UserModal.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Update organizationId if provided
    if (organizationId) {
      await UserModal.findByIdAndUpdate(user._id, { organizationId });
    }

    // Get role name from Role model
    const role = await Role.findById(user.roleId);
    const roleName = role ? role.roleName : null;

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        role: user.roleId,
        roleName: roleName,
        profile: user.profileImageUrl,
        organizationId: organizationId || user.organizationId
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json(
      {
        message: "Logged in successfully",
        token
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
