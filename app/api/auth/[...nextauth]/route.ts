import NextAuth from "next-auth";
import { connectToDB } from "@utils/database";
import { options } from "./options";
import User from "@models/userModel";

const handler = NextAuth(
   options
)

export { handler as GET, handler as POST}