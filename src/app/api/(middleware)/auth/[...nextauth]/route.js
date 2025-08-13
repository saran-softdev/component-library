import NextAuth from "next-auth";
import { authOptions } from "@/server/Utils/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
