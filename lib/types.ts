import { PostPrivacy } from '@enum/postPrivacyEnum';
import { Reaction } from '@enum/reactionEnum';
import { UserRole } from '@enum/userRolesEnum';
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
    createdAt?:Date,
    fullname?:string,
    birthdate?:string,
  }

  interface Session {
    user: User;
  }
}



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
  reaction: Reaction,
}

export type User = {
  _id:string,
  email?:string,
  username?:string,
  fullname?:string,
  birthdate?:string,
  image?:string,
  bio?:string,
  follower?:number,
  following?:number,
  followed?:boolean,
  blocked?:string[],
  role?:UserRole,
}
export type UploadUser = {
  _id:string,
  email?:string,
  username?:string,
  fullname?:string,
  birthdate?:string,
  image?: UploadImage,
  bio?:string,
}

export type UploadImage = {
  file:File|null,
  url:string,
}

export type SignUpCredentials = {
  email: string;
  username: string;
  password: string;
  repeatedPassword: string;
  image: UploadImage;
};

export type Post = {
    _id?: string,
    creator: User,
    title: string,
    description: string,
    categories: Category[],
    image: string[],
    privacy: PostPrivacy,
    likes?:number,
    createdAt?: Date,
}
export type UploadPost = {
    _id?: string,
    creator: User,
    title: string,
    description: string,
    categories: Category[],
    image:UploadImage[],
    likes?:number,
    privacy:PostPrivacy,
}
export type Category = {
    _id: string,
    name:string,
}

