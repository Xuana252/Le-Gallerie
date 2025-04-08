import { NextAuthOptions, Session } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { connectToDB } from "@utils/database";
import User from "@models/userModel";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { knock } from "@lib/knock";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENTID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENTID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
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
            throw new Error("Email and password are required.");
          }

          await connectToDB();

          const user = await User.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error("Account not found.");
          }

          if (user && user.password) {
            const isMatch = await bcrypt.compare(
              credentials?.password,
              user.password
            );
            if (isMatch) {
              return user;
            } else {
              throw new Error("Wrong password.");
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(
              error.message || "An error occurred during authentication."
            );
          } else {
            throw new Error("An unknown error occurred.");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/home`;
    },

    async signIn({ user, account, profile, email, credentials }) {
      if (credentials) {
        if (credentials?.error) return false;
        return true;
      }
      try {
        await connectToDB();

        const userExists = await User.findOne({
          email: user.email,
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

          const hashedPassword = await bcrypt.hash(result, 10);

          const newUser = await User.create({
            username: user.name ?? "unknown",
            fullname: "",
            birthdate: "",
            email: user.email,
            password: hashedPassword,
            image: "",
            bio: "",
            follower: 0,
            following: 0,
            blocked: [],
          });

          const knockUser = await knock.users.identify(newUser._id.toString(), {
            name: user.name || "",
            email: user.email || "",
          });

          await setDoc(doc(db, "usersChat", newUser._id.toString()), {
            chat: [],
          });
        }
        return true;
      } catch (error) {
        console.log("Failed to check for user exists", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // If user logs in, store user data in token
      if (user) {
        token.id = user.id;
        token.name = user.name || "";
        token.image = user.image || "";
        token.email = user.email ||"";
        token.bio = user.bio || "";
        token.follower = user.follower || 0;
        token.following = user.following || 0;
        token.blocked = user.blocked?.map((u: any) => u.toString()) || [];
        token.createdAt = user.createdAt || null;
        token.fullname = user.fullname || "";
        token.birthdate = user.birthdate || "";
      }

      // If token already contains user data, avoid DB query
      if (token.id) {
        try {
          const sessionUser = await User.findOne({ email: token.email });
          if (sessionUser) {
            token.id = sessionUser._id.toString();
            token.name = sessionUser.username || "";
            token.email = sessionUser.email ||"";
            token.image = sessionUser.image || "";
            token.bio = sessionUser.bio || "";
            token.follower = sessionUser.follower || 0;
            token.following = sessionUser.following || 0;
            token.blocked =
              sessionUser.blocked.map((u: any) => u.toString()) || [];
            token.createdAt = sessionUser.createdAt || null;
            token.fullname = sessionUser.fullname || "";
            token.birthdate = sessionUser.birthdate || "";
            token.role  = sessionUser.role;
          }
        } catch (error) {
          console.error("Error fetching user for JWT:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email:token.email as string,
        image: token.image as string,
        bio: token.bio as string,
        follower: token.follower as number,
        following: token.following as number,
        blocked: token.blocked as any,
        createdAt: token.createdAt as any,
        fullname: token.fullname as string,
        birthdate: token.birthdate as string,
      };
      return session;
    },
  },
};
