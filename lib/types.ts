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
export type User = {
  _id:string,
  email?:string,
  username?:string,
  image?:string,
}
export type Post = {
    _id?: string,
    creator: User,
    title: string,
    description: string,
    categories: Category[],
    image: string
}
export type Category = {
    _id: string,
    name:string,
}

