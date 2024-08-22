import NextAuth from 'next-auth';
import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id?: string;
    bio?: string
  }

  interface Session {
    user: User;
  }
}

export type SubmitButtonState = 'Succeeded'|'Failed'|'Processing'|''

export type RateLimitObject = {
  windowStart: any,
  windowDuration: number, 
  maxRequests: number,
} 
export type Like = {
  _id:string,
  user:User,
  post:Post,
}
export type User = {
  _id:string,
  email?:string,
  username?:string,
  image?:string,
  bio?:string,
}
export type Post = {
    _id?: string,
    creator: User,
    title: string,
    description: string,
    categories: Category[],
    image: string,
    likes?:number,
}
export type Category = {
    _id: string,
    name:string,
}

