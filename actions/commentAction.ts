"use server";
import { Reaction } from "@enum/reactionEnum";
import { headers } from "@node_modules/next/headers";

export const fetchPostComment = async (post: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/posts/${post}/comments`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch for post comments", error);
    return [];
  }
};

export const fetchCommentWithId = async (commentId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/comments/${commentId}`
  );
  if (response.ok) {
    const data = await response.json();
    return { status: 200, data: data };
  } else {
    return { status: response.status, data: null };
  }
};
export const fetchCommentReplies = async (comment: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/comments/${comment}/replies`
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
    await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/posts/${post}/comments/new`,
      {
        method: "POST",
        body: JSON.stringify({
          post,
          user,
          parent,
          content,
        }),
      }
    );
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
    await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/comments/${commentId}/likes`,
      {
        method: "PATCH",
        body: JSON.stringify({
          userId: userId,
          reaction: reaction,
        }),
      }
    );
  } catch (error) {
    console.error("Failed to update comment likes", error);
  }
};

export const fetchCommentLikes = async (commentId: string, postId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/comments/${commentId}/likes`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch comment likes", error);
    return [];
  }
};

export const fetchUserComments = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${userId}/comments`
    );

    if (response.ok) {
      const { comments, counts } = await response.json();
      return { comments, counts };
    } else {
      return { comments: [], counts: 0 };
    }
  } catch (error) {
    console.error("Failed to fetch for user comments", error);
    return { comments: [], counts: 0 };
  }
};

export const fetchUserCommentLikes = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${userId}/commentslikes`
    );

    if (response.ok) {
      const { commentLikes, counts } = await response.json();
      return { commentLikes, counts };
    } else {
      return { commentLikes: [], counts: 0 };
    }
  } catch (error) {
    console.error("Failed to fetch for user comments", error);
    return { commentLikes: [], counts: 0 };
  }
};

export const fetchUserPostsComments = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${userId}/posts/comments`
    );

    if (response.ok) {
      const { comments, counts } = await response.json();
      return { comments, counts };
    } else {
      return { comments: [], counts: 0 };
    }
  } catch (error) {
    console.error("Failed to fetch for user posts comments", error);
    return { comments: [], counts: 0 };
  }
};

export const fetchPostCommentSummarize = async (postId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/posts/${postId}/comments/summarize`,
      {
        headers: new Headers(headers()),
      }
    );

    const data = await response.json();
    return { message: data.message, counts: data.counts ?? 0 };
  } catch (error) {
    console.error("Failed to fetch for post comments", error);
    return { message: "Error", counts: 0 };
  }
};

export const fetchCommentRepliesSummarize = async (commentId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/comments/${commentId}/summarize`,
      {
        headers: new Headers(headers()),
      }
    );

    const data = await response.json();
    return { message: data.message, counts: data.counts ?? 0 };
  } catch (error) {
    console.error("Failed to fetch for comments replies", error);
    return { message: "Error", counts: 0 };
  }
};

export const deleteComment = async (commentId:string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/comments/${commentId}/delete`,
    {
      method: "DELETE",
      headers: new Headers(headers()),
    }
  );

  if (response.ok) {
    return true;
  }
  return false;
}