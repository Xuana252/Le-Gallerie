"use server";
import { Category, Comment, type Post } from "@lib/types";
import { checkLikeRateLimit } from "./checkRateLimit";
import { headers,cookies } from "next/headers";


export const fetchAllPost = async (currentPage: number, limit:number,searchText:string, categoryFilter:Category[]) => {
  const categoryIds = categoryFilter.map(category => category._id).join(',');
  
  const response = await fetch(`${process.env.DOMAIN_NAME}/api/posts?page=${currentPage}&limit=${limit}&searchText=${searchText}&categoryIds=${categoryIds}` ,{
    headers: headers()
  });
  if (response.ok) {
    const data = await response.json();
    return {posts:data.posts,counts:data.counts};
  }
  return {posts:[],counts:0};
};
export const fetchUserPost = async (user: string,currentPage: number, limit:number) => {
  const response = await fetch(
    `${process.env.DOMAIN_NAME}/api/users/${user}/posts?page=${currentPage}&limit=${limit}`,{
      headers: headers()
    }
  );
  if (response.ok) {
    const data = await response.json();
    return {posts:data.posts,counts:data.counts};
  }
  return {posts:[],counts:0};
};

export const fetchUserLikedPost = async (user: string,currentPage: number, limit:number) => {
  const response = await fetch(
    `${process.env.DOMAIN_NAME}/api/users/${user}/posts/liked-posts?page=${currentPage}&limit=${limit}`,{
      headers: headers()
    }
  );
  if (response.ok) {
    const data = await response.json();
    return {posts:data.posts,counts:data.counts};
  }
  return {posts:[],counts:0};
};

export const fetchPostWithId = async (post: string) => {
  const response = await fetch(`${process.env.DOMAIN_NAME}/api/posts/${post}`,{
    headers: headers()
  });
  const data = await response.json();

  if (response.ok) return data;
  return null;
};

export const createPost = async (post: Post, user: string) => {
  const response = await fetch(`${process.env.DOMAIN_NAME}/api/posts/new`, {
    method: "POST",
    body: JSON.stringify({ ...post, creator: user }),
  });
  if (response.ok) return true;
  return false;
};

export const updatePost = async (post: Post) => {
  const response = await fetch(
    `${process.env.DOMAIN_NAME}/api/posts/${post._id}`,
    {
      method: "PATCH",
      body: JSON.stringify(post),
    }
  );
  if (response.ok) return true;
  return false;
};



export const checkUserHasLiked = async (user: string, id: string,type:"comment"|"post") => {
  try {
    const response = await fetch(
      `${process.env.DOMAIN_NAME}/api/users/${user}/has-liked/${id}/${type}`
    );
    const data = await response.json();
    if (response.ok) {
      return data.liked ?? false;
    }
  } catch (error) {
    console.log("Failed to check user has liked");
    return false;
  }
};

export const handleLike = async (user: string, post: string) => {
  const isRateLimited = await checkLikeRateLimit();
  if (isRateLimited) return;
  try {
    await fetch(`${process.env.DOMAIN_NAME}/api/posts/${post}/likes`, {
      method: "PATCH",
      body: JSON.stringify({
        userId: user,
      }),
    });
  } catch (error) {
    console.error("Failed to update post likes", error);
  }
};

export const fetchPostLikedUser = async (post: string) => {
  try {
    const response = await fetch(
      `${process.env.DOMAIN_NAME}/api/posts/${post}/likes`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update post likes", error);
    return [];
  }
};

export const deletePost = async (post: string) => {
  await fetch(`${process.env.DOMAIN_NAME}/api/posts/${post}`, {
    method: "DELETE",
  });
};

export const fetchPostComment = async (post: string) => {
  try {
    const response = await fetch(
      `${process.env.DOMAIN_NAME}/api/posts/${post}/comments`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch for post comments", error);
    return [];
  }
};
export const fetchCommentReplies = async (comment: string) => {
  try {
    const response = await fetch(
      `${process.env.DOMAIN_NAME}/api/comments/${comment}/replies`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch for comment replies", error);
    return [];
  }
};

export const handleComment = async (
  post: string,
  user: string,
  parent: string,
  content: string
) => {
  try {
    await fetch(`${process.env.DOMAIN_NAME}/api/posts/${post}/comments/new`, {
      method: "POST",
      body: JSON.stringify({
        post,
        user,
        parent,
        content,
      }),
    });
  } catch (error) {
    console.error("Failed to post comments", error);
  }
};

export const handleLikeComment = async (
  comment:string,
  user:string
) => {
  //add rate limiting if you want
  try {
    await fetch(`${process.env.DOMAIN_NAME}/api/comments/${comment}/likes`, {
      method: "PATCH",
      body: JSON.stringify({
        userId: user,
      }),
    });
  } catch (error) {
    console.error("Failed to update comment likes", error);
  }
}