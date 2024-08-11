import NextAuth from 'next-auth';
import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id?: string; // Add `id` field to the `User` type
  }

  interface Session {
    user: User;
  }
}

export type Post = {
    creator: string,
    title: string,
    description: string,
    categories: string[],
    image: string
}

export type Category = {
    _id: string,
    name:string,
}

