"use server";
import { Reaction } from "@enum/reactionEnum";

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
    commentId: string,
    userId: string,
    reaction: Reaction | null
  ) => {
    //add rate limiting if you want
    try {
      await fetch(`${process.env.DOMAIN_NAME}/api/comments/${commentId}/likes`, {
        method: "PATCH",
        body: JSON.stringify({
          userId: userId,
          reaction: reaction,
        }),
      });
    } catch (error) {
      console.error("Failed to update comment likes", error);
    }
  };
  
  export const fetchCommentLikes = async (commentId: string, postId: string) => {
    try {
      const response = await fetch(
        `${process.env.DOMAIN_NAME}/api/comments/${commentId}/likes`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch comment likes", error);
      return [];
    }
  };
  