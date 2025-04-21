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
  faFlag,
  faBars,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import React, { useEffect, useState } from "react";
import LikedUserTab from "./LikedUserTab";
import { useRouter } from "@node_modules/next/navigation";
import { confirm, toastMessage } from "@components/Notification/Toaster";
import SharePostForm from "@components/Forms/SharePostFrom";
import ReportForm from "@components/Forms/ReportForm";

export default function PostInteractionBarr({ post }: { post: Post }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [postLikes, setPostLikes] = useState<number>(post.likes || 0);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState<boolean>(true);
  const [isToggle, setIsToggle] = useState<boolean>(false);

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

  const handleDeletePost = async () => {
    const hasConfirmed = await confirm(
      "Are you sure you want to delete this post?"
    );

    if (hasConfirmed && post._id) {
      try {
        const res = await deletePost(post._id);
        if (res) {
          toastMessage("Post deleted");
          router.back();
        } else {
          toastMessage("Failed to delete post");
        }
      } catch (error) {
        toastMessage("Failed to delete post");
        console.log(error);
      }
    }
  };

  const handleEditButtonClick = () => {
    localStorage.setItem("post", JSON.stringify(post));
    router.push(`edit?id=${post?._id}`);
  };

  return (
    <div className="flex flex-row py-2 h-[60px] overflow-y-visible z-20  sticky bg-secondary-1 items-start sm:items-center top-[59px] gap-2">
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
      <div
        className={` flex relative sm:top-auto flex-col-reverse items-center sm:flex-row ml-auto justify-center rounded-full h-fit transition-all duration-150 ease-in-out overflow-hidden w-fit `}
      >
        <div
          className={`flex flex-col-reverse  p-1 sm:flex-row gap-2 rounded-full grow overflow-hidden bg-primary  ${
            isToggle
              ? "translate-y-[0%] sm:translate-y-[0%] sm:translate-x-[0%]  "
              : "translate-y-[-100%] sm:translate-y-[0%] sm:translate-x-[100%] opacity-0"
          } transition-all duration-300 ease-in-out `}
        >
          {session?.user && (
            <>
              {session?.user.id === post?.creator._id && (
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
              <PopupButton
                popupItem={<ReportForm type="Post" content={post} />}
              >
                <button className="hover:bg-secondary-2 Icon_smaller ">
                  <FontAwesomeIcon icon={faFlag} title="Report Post" />
                </button>
              </PopupButton>
            </>
          )}
          <PopupButton popupItem={<SharePostForm post={post} />}>
            <button className="hover:bg-secondary-2 Icon_smaller ">
              <FontAwesomeIcon icon={faShare} title="Share Image" />
            </button>
          </PopupButton>
          <div className="Icon_smaller"></div>
        </div>

        <div
          className={`-p-1 bg-primary absolute rounded-full right-0 top-0 z-20 `}
        >
          <button
            className={`"hover:bg-secondary-2  Icon_smaller  m-1 ${
              isToggle ? "rotate-90" : ""
            } transition-all duration-150 ease-in-out "`}
            onClick={() => setIsToggle((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faBars} className="text-accent/70" />
          </button>
        </div>
      </div>
    </div>
  );
}
