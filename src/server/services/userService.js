// 📁 /server/Services/userService.js
import User from "@/server/models/userModal";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import Role from "@/server/models/roleModel";

export const getStaffByNameService = async (organizationId, name) => {
  if (!organizationId || !name) {
    throw new Error("Missing organizationId or name");
  }

  const hotelOwnerRole = await Role.findOne({ roleName: "hotel-owner" });
  const hotelOwnerRoleId = hotelOwnerRole?._id;

  const regex = new RegExp(name, "i"); // case-insensitive partial match

  const query = {
    organizationId,
    roleId: { $ne: hotelOwnerRoleId }, // exclude hotel-owner
    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
  };

  const users = await User.find(query)
    .select("_id firstName lastName email profileImageUrl") // ✅ select only needed fields
    .populate({
      path: "roleId",
      select: "roleName" // ✅ only roleName from role
    });

  return users;
};

export const createUserByPmsAdminService = async (data) => {
  const {
    email,
    password,
    roleId,
    organizationId,
    firstName = "",
    lastName = "",
    phoneNumber = "",
    profileImageUrl = "",
    createdBy = null
  } = data;

  if (!email || !password || !roleId || !organizationId) {
    throw new Error("Missing required fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    passwordHash,
    firstName,
    lastName,
    phoneNumber,
    profileImageUrl,
    roleId,
    organizationId,
    createdBy
  });

  await newUser.save();
  const userResponse = newUser.toObject();
  delete userResponse.passwordHash;
  return userResponse;
};

export const getAllUsersService = async (sessionUserId) => {
  return await User.find({ createdBy: sessionUserId })
    .select("-passwordHash")
    .populate("roleId");
};

export const getAllStaffsForHotelOwnerService = async (organizationId) => {
  if (!organizationId) {
    throw new Error("Missing organizationId for hotel-owner");
  }
  // Find the ObjectId for the 'hotel-owner' role
  const hotelOwnerRole = await Role.findOne({ roleName: "hotel-owner" });
  const hotelOwnerRoleId = hotelOwnerRole ? hotelOwnerRole._id : null;
  // Exclude users with the hotel-owner role
  const query = {
    organizationId,
    ...(hotelOwnerRoleId && { roleId: { $ne: hotelOwnerRoleId } })
  };
  return await User.find(query).select("-passwordHash").populate("roleId");
};

export const createStaffForHotelOwnerService = async (
  data,
  organizationId,
  createdBy
) => {
  const {
    email,
    password,
    roleId,
    firstName = "",
    lastName = "",
    phoneNumber = "",
    profileImageUrl = ""
  } = data;

  if (!email || !password || !roleId) {
    throw new Error("Missing required fields");
  }
  if (!organizationId) {
    throw new Error("Missing organizationId for hotel-owner");
  }

  // Prevent assigning hotel-owner role
  const Role = (await import("@/server/models/roleModel")).default;
  const hotelOwnerRole = await Role.findOne({ roleName: "hotel-owner" });
  if (hotelOwnerRole && String(roleId) === String(hotelOwnerRole._id)) {
    throw new Error("Cannot assign hotel-owner role to staff");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    passwordHash,
    firstName,
    lastName,
    phoneNumber,
    profileImageUrl,
    roleId,
    organizationId, // always set from session
    createdBy // always set from session
  });

  await newUser.save();
  const userResponse = newUser.toObject();
  delete userResponse.passwordHash;
  return userResponse;
};

export const getUserByIdService = async (id) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid user ID");
  const user = await User.findById(id)
    .select("-passwordHash")
    .populate("roleId");
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserService = async (data) => {
  const { id, updatedBy, ...updateData } = data;
  if (!id || !Types.ObjectId.isValid(id))
    throw new Error("Invalid or missing user ID");

  if (updateData.email) {
    const exists = await User.findOne({
      email: updateData.email,
      _id: { $ne: id }
    });
    if (exists) throw new Error("Email already exists");
  }

  if (updateData.password) {
    updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
    delete updateData.password;
  }

  if (updatedBy) updateData.updatedBy = updatedBy;

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true
  }).select("-passwordHash");
  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};

export const softDeleteUserService = async (id, deletedBy) => {
  if (!id || !Types.ObjectId.isValid(id))
    throw new Error("Invalid or missing user ID");
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  return await User.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: deletedBy || null
    },
    { new: true }
  );
};

export const restoreUserService = async (id, restoredBy) => {
  if (!Types.ObjectId.isValid(id))
    throw new Error("Invalid or missing user ID");
  const restored = await User.restoreUser(id, restoredBy);
  if (!restored) throw new Error("Deleted user not found");
  return restored;
};

export const getDeletedUsersService = async (organizationId) => {
  const query = { isDeleted: true };
  if (organizationId) query.organizationId = organizationId;
  return await User.find(query).select("-passwordHash").populate("roleId");
};

export const hardDeleteUserService = async (id) => {
  if (!Types.ObjectId.isValid(id))
    throw new Error("Invalid or missing user ID");
  const deleted = await User.hardDelete(id);
  if (!deleted) throw new Error("User not found");
  return true;
};

export const userManagementSoftDeleteUserService = async (id, deletedBy) => {
  if (!id || !Types.ObjectId.isValid(id))
    throw new Error("Invalid or missing user ID");

  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  return await User.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: deletedBy || null
    },
    { new: true }
  );
};

export const userManagementRestoreUserService = async (id, restoredBy) => {
  if (!Types.ObjectId.isValid(id))
    throw new Error("Invalid or missing user ID");

  const restored = await User.restoreUser(id, restoredBy);
  if (!restored) throw new Error("Deleted user not found");

  return restored;
};

export const userManagementGetDeletedUsersService = async () => {
  return await User.find({ isDeleted: true })
    .select("-passwordHash")
    .populate("roleId");
};

export const userManagementHardDeleteUserService = async (id) => {
  if (!Types.ObjectId.isValid(id))
    throw new Error("Invalid or missing user ID");

  const deleted = await User.hardDelete(id);
  if (!deleted) throw new Error("User not found");

  return true;
};
