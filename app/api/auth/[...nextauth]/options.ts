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

          console.log(user.email, user.password, credentials?.password);

          if (user && user.password) {
            const isMatch = await bcrypt.compare(
              credentials?.password,
              user.password
            );
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
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if(credentials) return true
      try {
        await connectToDB();

        const userExists = await User.findOne({
          email: profile?.email,
        });

        if (!userExists) {
          //create a random string then hash it
          const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          let result = "";
          const charactersLength = 8;
          for (let i = 0; i < charactersLength; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }

          const hashedPassword = await bcrypt.hash(result,10)

          await User.create({
            username: profile?.name,
            email: profile?.email,
            password: hashedPassword,
            image: profile?.image,
          });
        }
        return true;
        
      } catch (error) {
        console.log("Failed to check for user exists",error);
        return false
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`; // Redirect to homepage
      }
      return baseUrl;
    },
    async session({ session, token }) {
      if (session?.user) {
        const sessionUser = await User.findOne({ email: session.user.email });

        session.user.name = sessionUser.username.toString();
      }
      return session;
    },
  },
};
