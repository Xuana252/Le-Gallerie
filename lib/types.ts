import { Date } from 'mongoose';
import NextAuth from 'next-auth';
import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id?: string;
    bio?: string
    follower?:number,
    following?:number,
    blocked?:string[],
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

export type Comment = {
  _id:string,
  post:Post,
  user:User,
  content:string,
  parent?:Comment,
  likes:number,
  createdAt:Date,
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
  follower?:number,
  following?:number,
  followed?:boolean,
}
export type UploadUser = {
  _id:string,
  email?:string,
  username?:string,
  image?: {
    file:File|null,
    url:string,
  },
  bio?:string,
}

export type SignUpCredentials = {
  email: string;
  username: string;
  password: string;
  repeatedPassword: string;
  image: {
    file: File | null; // file can be a File or null
    url: string;
  };
};

export type Post = {
    _id?: string,
    creator: User,
    title: string,
    description: string,
    categories: Category[],
    image: string,
    likes?:number,
}
export type UploadPost = {
    _id?: string,
    creator: User,
    title: string,
    description: string,
    categories: Category[],
    image: {
      file:File|null,
      url:string,
    },
    likes?:number,
}
export type Category = {
    _id: string,
    name:string,
}

