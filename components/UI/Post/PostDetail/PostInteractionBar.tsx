import { fetchPostLikedUser, handleLike } from "@actions/likesAction";
import { deletePost } from "@actions/postActions";
import PopupButton from "@components/Input/PopupButton";
import ReactionButton from "@components/Input/ReactionInput";
import { Reaction } from "@enum/reactionEnum";
import { Like, Post, User } from "@lib/types";
import { removeImage } from "@lib/upload";
import {
  faSmile,
  faTrash,
  faPen,
  faShare,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import React, { useEffect, useState } from "react";
import LikedUserTab from "./LikedUserTab";
import { useRouter } from "@node_modules/next/navigation";
import { confirm } from "@components/Notification/Toaster";

export default function PostInteractionBarr({ post }: { post: Post }) {
  const { data: session } = useSession();
  const router= useRouter();
  const [postLikes, setPostLikes] = useState<number>(post.likes || 0);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState<boolean>(true);

  useEffect(() => {
    fetchLikesUsers();
    setPostLikes(post.likes || 0);
  }, [post]);

  const fetchLikesUsers = async () => {
    if (!post._id) return;
    setIsLoadingLikes(true);
    try {
      const response = await fetchPostLikedUser(post._id);
      setLikes(response);
      const myReaction = response.find(
        (like: any) => like.user._id === session?.user.id
      );
      setReaction(myReaction ? myReaction.reaction : null);
    } catch (error) {
      console.error("Failed to fetch users that has liked post", error);
    } finally {
      setIsLoadingLikes(false);
    }
  };

  const handleSetLikedState = async (newReaction: Reaction | null) => {
    // Determine if a reaction already exists
    const hasReacted = reaction !== null;

    let likeAdjustment = 0;
    if (!hasReacted && newReaction !== null) {
      // User is adding a reaction
      likeAdjustment = 1;
    } else if (hasReacted && newReaction === null) {
      // User is removing their reaction
      likeAdjustment = -1;
    }
    // If the user is changing their reaction (from one type to another), we don't adjust the like count

    // Update the like count accordingly
    setPostLikes((prevLikes) => prevLikes + likeAdjustment);
    setReaction(newReaction);
    if (session?.user.id && post._id) {
      await handleLike(session.user.id, post._id, newReaction);
      const existingLike = likes.find(
        (like) => like.user._id === session.user.id
      );

      if (existingLike) {
        if (newReaction) {
          // Update the reaction if it's different from the current one
          setLikes((prev) =>
            prev.map((like) =>
              like.user._id === session.user.id
                ? { ...like, reaction: newReaction }
                : like
            )
          );
        } else {
          // Remove the like if no reaction is provided
          setLikes((prev) =>
            prev.filter((like) => like.user._id !== session.user.id)
          );
        }
      } else {
        // Add a new like if none exists
        setLikes((prev) => [
          ...prev,
          {
            _id: "", // Replace with appropriate id handling if necessary
            reaction: newReaction,
            post: post,
            user: {
              _id: session.user.id,
              username: session.user.name,
              image: session.user.image,
              bio: session.user.bio,
            } as User,
          } as Like,
        ]);
      }
    }
  };

  const handleShare = () => {
    if (!post._id) return;
    // if (navigator.share) {
    //   // Use the Web Share API if available
    //   navigator
    //     .share({
    //       title: post.title,
    //       text: "check out this photo",
    //       url: post.image,
    //     })
    //     .catch((error) => console.error("Error sharing:", error));
    // } else {
    //   // Fallback for browsers that do not support the Web Share API
    //   const shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20this%20photo!&url=${encodeURIComponent(
    //     post.image
    //   )}`;
    //   window.open(shareUrl, "_blank");
    // }
  };

  const handleDeletePost = async () => {
    const hasConfirmed = await confirm(
      "Are you sure you want to delete this post?"
    );

    if (hasConfirmed && post._id) {
      try {
        await Promise.all(
          post.image.map(async (img: string) => await removeImage(img))
        );
        await deletePost(post._id);
        router.back();
        console.log("Post deleted");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditButtonClick = () => {
    localStorage.setItem("post", JSON.stringify(post));
    router.push(`edit?id=${post?._id}`);
  };

  return (
    <div className="flex-row py-2 h-fit z-20 flex sticky bg-secondary-1 items-center top-[59px] gap-2">
      {isLoadingLikes ? (
        <div className="flex justify-start items-center gap-1">
          <button className="Icon_small animate-pulse bg-secondary-2">
            <FontAwesomeIcon icon={faSmile} className="text-accent/70" />
          </button>
          <div className="bg-secondary-2 animate-pulse w-20 h-5 rounded-xl"></div>
        </div>
      ) : (
        <div className="flex gap-2 justify-start items-center">
          <ReactionButton
            type="Icon_small"
            drop="left"
            reaction={reaction}
            action={handleSetLikedState}
          />
          <PopupButton popupItem={<LikedUserTab likes={likes} />}>
            <span className="hover:underline">{postLikes} interactions</span>
          </PopupButton>
        </div>
      )}
      <div className="flex-row flex ml-auto justify-end rounded-full gap-2 bg-primary h-fit p-1">
        {session?.user && session?.user.id === post?.creator._id && (
          <>
            <button
              className="hover:bg-secondary-2 Icon_smaller "
              onClick={() => handleDeletePost()}
            >
              <FontAwesomeIcon icon={faTrash} title="Delete Post" />
            </button>
            <button
              className="hover:bg-secondary-2 Icon_smaller"
              onClick={handleEditButtonClick}
            >
              <FontAwesomeIcon icon={faPen} title="Edit Post" />
            </button>
          </>
        )}
        <button
          className="hover:bg-secondary-2 Icon_smaller "
          onClick={handleShare}
        >
          <FontAwesomeIcon icon={faShare} title="Share Image" />
        </button>
      </div>
    </div>
  );
}
