"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDownload,
  faHeart,
  faPaperPlane,
  faPen,
  faShare,
  faSmile,
  faTrash,
  faUser,
  faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { Category, Like, Post, User } from "@lib/types";
import { removeImage } from "@lib/upload";
import { deletePost } from "@actions/postActions";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import CustomImage from "./Image";
import { useSession } from "next-auth/react";
import UserProfileIcon from "./UserProfileIcon";
import ButtonWithTimeOut from "@components/Input/ButtonWithTimeOut";
import DropDownButton from "@components/Input/DropDownButton";
import { SearchContext } from "./Nav";
import { CommentSection } from "./Comment";
import { confirm } from "@components/Notification/Toaster";
import { formatTimeAgo, formatTimeAgoWithoutAgo } from "@lib/dateFormat";
import ReactionButton from "@components/Input/ReactionInput";
import { Reaction } from "@enum/reactionEnum";
import { renderReaction } from "@lib/Emoji/render";
import LikedUserTab from "./LikedUserTab";
import PopupButton from "@components/Input/PopupButton";
import PostImageSlider from "./PostImageSlider";
import { fetchPostLikedUser, handleLike } from "@actions/likesAction";

export default function PostDetail({
  isLoading,
  post,
}: {
  isLoading?: boolean;
  post: Post;
}) {
  const { handleSetCategory } = useContext(SearchContext);
  const router = useRouter();
  const { data: session } = useSession();
  const [postLikes, setPostLikes] = useState<number>(post.likes || 0);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState<boolean>(true);

  const handleCategoryCLick = (category: Category) => {
    handleSetCategory(category);
    router.push("/");
  };

  useEffect(() => {
    setIsLoadingLikes(true);
    fetchLikesUsers();
    setPostLikes(post.likes || 0);
    setIsLoadingLikes(false);
  }, [post]);

  const fetchLikesUsers = async () => {
    if (!post._id) return;
    try {
      const response = await fetchPostLikedUser(post._id);
      setLikes(response);
      const myReaction = response.find(
        (like: any) => like.user._id === session?.user.id
      );
      setReaction(myReaction ? myReaction.reaction : null);
    } catch (error) {
      console.error("Failed to fetch users that has liked post", error);
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
    <div className={`Form`}>
      {isLoading ? (<>
          <div className="size-full bg-secondary-2 animate-pulse relative sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden"></div>
          <div className="w-full p-4 flex flex-col gap-0 ">
            <div className="flex-row py-2 h-fit z-20 flex sticky bg-secondary-1 items-center top-[59px] gap-2">
              <div className="flex justify-start items-center gap-1">
                <button className="Icon_small animate-pulse bg-secondary-2">
                  <FontAwesomeIcon icon={faSmile} className="text-accent/70" />
                </button>
                <div className="bg-secondary-2 animate-pulse w-20 h-5 rounded-xl"></div>
              </div>
              <ul className="flex-row flex ml-auto justify-end p-1 bg-primary rounded-full gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={index}
                    className="Icon_smaller animate-pulse bg-secondary-2"
                  ></li>
                ))}
              </ul>
            </div>
            <div className="grow flex-col flex gap-2">
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <label className="grid grid-cols-[auto_1fr] items-center gap-2">
                  <div className="Icon_small animate-pulse bg-accent/70" />
                  <h2 className="bg-accent animate-pulse w-24 h-6 rounded-xl"></h2>
                </label>
                <div className="ml-auto animate-pulse w-16 h-4 rounded-xl bg-secondary-2/50"></div>
              </div>
              <h1 className="bg-accent/70 animate-pulse w-40 h-9 rounded-xl"></h1>
              <ul className="flex gap-2 text-xl flex-wrap">
                {Array.from({ length: 10 }).map((_, index) => (
                  <li
                    key={index}
                    className="bg-secondary-2 animate-pulse h-5 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 81) + 80}px` }}
                  ></li>
                ))}
              </ul>
              <div className="bg-accent/70 animate-pulse w-full h-24 rounded-xl"></div>
            </div>
          </div>
      </>
      ) : (
        <>
          <div className="flex items-center size-full relative sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden bg-secondary-2">
            {post.image && <PostImageSlider images={post.image} />}
          </div>
          <div className="w-full p-4 flex flex-col gap-0 ">
            <div className="flex-row py-2 h-fit z-20 flex sticky bg-secondary-1 items-center top-[59px] gap-2">
              {isLoadingLikes ? (
                <div className="flex justify-start items-center gap-1">
                  <button className="Icon_small animate-pulse bg-secondary-2">
                    <FontAwesomeIcon
                      icon={faSmile}
                      className="text-accent/70"
                    />
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
                    <span className="hover:underline">
                      {postLikes} interactions
                    </span>
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
            <div className="grow flex-col flex gap-2">
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <label className="grid grid-cols-[auto_1fr] items-center gap-2">
                  {session?.user?.id === post?.creator._id ? (
                    <UserProfileIcon currentUser={true} />
                  ) : (
                    <UserProfileIcon
                      currentUser={false}
                      user={post?.creator || { _id: "" }}
                    />
                  )}
                  <h2 className="text-sm cursor-pointer font-bold whitespace-normal break-all">
                    {post?.creator.username}
                  </h2>
                </label>
                <div className="ml-auto text-accent/40">
                  {post.createdAt
                    ? formatTimeAgo(post.createdAt.toString())
                    : ""}
                </div>
              </div>
              <h1 className="text-3xl font-bold">{post?.title}</h1>
              <ul className="flex gap-2 text-xl flex-wrap">
                {post?.categories.map((category) => (
                  <li
                    key={category._id}
                    className="text-sm Category hover:font-bold cursor-pointer bg-secondary-2/40 size-fit px-2 py-1 rounded-xl"
                    onClick={() => handleCategoryCLick(category)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
              <p className="italic">{post?.description}</p>
            </div>
            <div className="mt-auto">
              {post._id && <CommentSection postId={post._id} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
