import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { connectToDB } from "@utils/database";
import User from "@models/userModel";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENTID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "email...",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password...",
        },
      },
      async authorize(credentials) {
        try {
          
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await connectToDB();


          const user = await User.findOne({ email: credentials?.email });

          console.log(user.email,user.password,credentials?.password)

          if (user && user.password) {
            const isMatch = await bcrypt.compare(credentials?.password, user.password);
            if (isMatch) {
              return user;
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in", // Use your custom sign-in page
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Here you can determine if the user should be allowed to sign in
      // You can also set session or token properties if needed
      return true; // Return true to allow sign-in, or false to deny
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`; // Redirect to homepage
      }
      return baseUrl;
    },
    async session({ session, token }) {
      // You can modify session here if needed
      return session;
    },
  },
};
