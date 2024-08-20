'use server'
import { type Post } from "@lib/types";
import { Knock } from "@knocklabs/node";

const knock = new Knock(process.env.KNOCK_API_SECRET);

export const fetchAllPost = async () => {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/posts`)
    if(response.ok) {
        const data = await response.json()
        return data
    }
    return []
    
    
}
export const fetchUserPost = async (user:string) => {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/users/${user}/posts`)
    if(response.ok) {
        const data = await response.json()
        return data
    }
    return []
}

export const createPost = async (post:Post,user:string) => {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/posts/new`, {
        method: "POST",
        body: JSON.stringify({ ...post, creator: user}),
    });
    if(response.ok)
        return true
    return false
}

export const updatePost = async (post:Post) => {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/posts/${post._id}`, {
        method: "PATCH",
        body: JSON.stringify(post),
      });
      if(response.ok)
        return true
    return false
}

export const fetchPostWithId = async (post:string) => {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/posts/${post}`);
    const data = await response.json();

    if(response.ok)
        return data
    return null
}


export const checkUserHasLiked = async (user:string,post:string) => {
    try {
        const response = await fetch(
          `${process.env.DOMAIN_NAME}/api/users/${user}/has-liked/${post}`
        );
        const data = await response.json()
        if(response.ok) {
            return data.liked ?? false
        }
      } catch (error) {
        console.log("Failed to check user has liked post");
        return false
      } 
}

export const handleLike = async (user:string,post:string) => {
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
}

export const deletePost = async (post:string) => {
    await fetch(`${process.env.DOMAIN_NAME}/api/posts/${post}`, {
        method: "DELETE",
    });
}

