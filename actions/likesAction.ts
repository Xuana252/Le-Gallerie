"use server";
import { Reaction } from "@enum/reactionEnum";
import { checkLikeRateLimit } from "./checkRateLimit";

export const handleLike = async (
  user: string,
  post: string,
  reaction: Reaction | null
) => {
  const isRateLimited = await checkLikeRateLimit();
  if (isRateLimited) return;
  try {
    await fetch(`${process.env.DOMAIN_NAME}/api/posts/${post}/likes`, {
      method: "PATCH",
      body: JSON.stringify({
        userId: user,
        reaction: reaction,
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
    console.error("Failed to fetch post likes", error);
    return [];
  }
};
