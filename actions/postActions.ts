"use server";

import { Category, type Post } from "@lib/types";

import { checkLikeRateLimit } from "./checkRateLimit";


import { headers, cookies } from "next/headers";
import { Reaction } from "@enum/reactionEnum";

export const fetchAllPost = async (
  currentPage: number,
  limit: number,
  searchText: string,
  categoryFilter: Category[],
  relatedPostFilter: string
) => {
  const categoryIds = categoryFilter.map((category) => category._id).join(",");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/posts?page=${currentPage}&limit=${limit}&searchText=${searchText}&categoryIds=${categoryIds}&relatedPostId=${relatedPostFilter}`,
    {
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    const data = await response.json();
    return { posts: data.posts, counts: data.counts };
  }
  return { posts: [], counts: 0 };
};

export const fetchUserPost = async (
  user: string,
  currentPage: number,
  limit: number
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/posts?page=${currentPage}&limit=${limit}`,
    {
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    const { posts, counts } = await response.json();
    return { posts, counts };
  }
  return { posts: [], counts: 0 };
};

export const fetchUserLikedPost = async (
  user: string,
  currentPage: number,
  limit: number
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/posts/liked-posts?page=${currentPage}&limit=${limit}`,
    {
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    const data = await response.json();
    return { posts: data.posts, counts: data.counts };
  }
  return { posts: [], counts: 0 };
};

export const fetchUserFollowPost = async (
  user: string,
  currentPage: number,
  limit: number
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/posts/follow-posts?page=${currentPage}&limit=${limit}`,
    {
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    const data = await response.json();
    return { posts: data.posts, counts: data.counts };
  }
  return { posts: [], counts: 0 };
};

export const fetchUserFriendPost = async (
  user: string,
  currentPage: number,
  limit: number
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/posts/friend-posts?page=${currentPage}&limit=${limit}`,
    {
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    const data = await response.json();
    return { posts: data.posts, counts: data.counts };
  }
  return { posts: [], counts: 0 };
};

export const fetchPostWithId = async (post: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/posts/${post}`,
    {
      headers: new Headers(headers()),
    }
  );

  const data = await response.json();

  if (response.ok) return { status: 200, data: data };
  else {
    return { status: response.status, data: null };
  }
};

export const createPost = async (post: Post, user: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/posts/new`,
    {
      method: "POST",
      body: JSON.stringify({ ...post, creator: user }),
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
};

export const updatePost = async (post: Post) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/posts/${post._id}`,
    {
      method: "PATCH",
      body: JSON.stringify(post),
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
};

export const deletePost = async (post: string) => {
  await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/posts/${post}`, {
    method: "DELETE",
  });
};

export const fetchSystemPostData = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/admin/posts`,
    {
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
};
