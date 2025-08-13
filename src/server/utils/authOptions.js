import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/server/lib/dbConnect";
import UserModal from "@/server/models/userModal";
import Role from "@/server/models/roleModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Organization from "../models/organizationModal";

export const authOptions = {
  providers: [
    // ➤ Email & Password Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        organizationId: { label: "Organization ID", type: "text" }
      },
      async authorize(credentials) {
        console.log("credentials", credentials);

        await dbConnect();

        // Find organization by string organizationId
        const organization = await Organization.findOne({
          organizationId: credentials.organizationId
        });
        console.log("[authorize] organization:", organization);
        if (!organization) {
          throw new Error("Organization not found");
        }

        // Use the organization's _id (ObjectId)
        const orgObjectId = organization._id;
        console.log("[authorize] orgObjectId:", orgObjectId);

        const user = await UserModal.findOne({ email: credentials.email });
        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        // Update user's organizationId to the found org's _id
        await UserModal.findByIdAndUpdate(user._id, {
          organizationId: orgObjectId
        });

        // Get role name
        const role = await Role.findById(user.roleId);
        const roleName = role ? role.roleName : null;

        return {
          id: user._id.toString(),
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          role: user.roleId,
          roleName: roleName,
          image: user.profileImageUrl,
          organizationId: orgObjectId
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.firstName = user.firstName || "";
        // token.lastName = user.lastName || "";
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = user.role;
        token.roleName = user.roleName;
        token.organizationId = user.organizationId;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        // session.user.firstName = token.firstName;
        // session.user.lastName = token.lastName;
        session.user.name = token.name; // already combined
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.roleId = token.role;
        session.user.roleName = token.roleName;
        session.user.organizationId = token.organizationId;
      }
      return session;
    }
  },

  pages: {
    signIn: "/auth",
    error: "/auth"
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 // 1 day
  },

  secret: process.env.NEXTAUTH_SECRET
};
