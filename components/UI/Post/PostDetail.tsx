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
import CustomImage from "../Image/Image";
import { useSession } from "next-auth/react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import ButtonWithTimeOut from "@components/Input/ButtonWithTimeOut";
import DropDownButton from "@components/Input/DropDownButton";
import { SearchContext } from "../Layout/Nav";
import { CommentSection } from "./Comment/Comment";
import { confirm } from "@components/Notification/Toaster";
import { formatTimeAgo, formatTimeAgoWithoutAgo } from "@lib/dateFormat";
import ReactionButton from "@components/Input/ReactionInput";
import { Reaction } from "@enum/reactionEnum";
import { renderReaction } from "@lib/Emoji/render";
import LikedUserTab from "./PostDetail/LikedUserTab";
import PopupButton from "@components/Input/PopupButton";
import PostImageSlider from "../Image/PostImageSlider";
import { fetchPostLikedUser, handleLike } from "@actions/likesAction";
import PostInteractionBarr from "./PostDetail/PostInteractionBar";
import { renderPrivacy } from "@lib/Post/post";
import ImageSlider from "../Image/ImageSlider";
import CommentSummarize from "./Summarizer/CommentSummarize";
import LikeSummarize from "./Summarizer/LikeSummarize";

export default function PostDetail({
  available = true,
  isLoading,
  post,
  slider = 1,
  interactBar = true,
  commentBar = true,
  commentSummarize = false,
  likeSummarize = false,
}: {
  available?: boolean;
  isLoading?: boolean;
  post: Post | null;
  slider?: 1 | 2;
  interactBar?: boolean;
  commentBar?: boolean;
  commentSummarize?: boolean;
  likeSummarize?: boolean;
}) {
  const { handleSetCategory } = useContext(SearchContext);

  return (
    <>
      {!available ? (
        <div className="rounded-2xl max-w-[1080px] w-full h-[500px] bg-secondary-1 m-auto flex flex-col items-center justify-center ">
          <div className="text-xl">This post is unavailable :/</div>
          <div className="text-base italic opacity-70">
            It may have been removed or is restricted due to privacy settings.
          </div>
        </div>
      ) : (
        <div className={`Form`}>
          {isLoading || !post ? (
            <>
              <div className="size-full bg-secondary-2 animate-pulse relative sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden"></div>
              <div className="w-full p-4 flex flex-col gap-0 ">
                <div className="flex-row py-2 h-fit z-20 flex bg-secondary-1 items-center gap-2">
                  <div className="flex justify-start items-center gap-1">
                    <button className="Icon_small animate-pulse bg-secondary-2">
                      <FontAwesomeIcon
                        icon={faSmile}
                        className="text-accent/70"
                      />
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
                    {Array.from({ length: 5 }).map((_, index) => (
                      <li
                        key={index}
                        className="bg-secondary-2 animate-pulse h-7 rounded-xl w-[70px]"
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
                {post.image ? (
                  slider === 1 ? (
                    <PostImageSlider images={post.image} />
                  ) : (
                    <ImageSlider
                      images={post.image}
                      onClick={() => {}}
                      onChangeIndex={() => {}}
                    />
                  )
                ) : (
                  ""
                )}
              </div>
              <div className="w-full p-4 flex flex-col gap-0  ">
                {interactBar && <PostInteractionBarr post={post} />}
                <div className="grow flex-col flex gap-2">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                    <label className="grid grid-cols-[auto_1fr] items-center gap-2">
                      <UserProfileIcon user={post?.creator || { _id: "" }} />

                      <h2 className="text-sm cursor-pointer font-bold whitespace-normal break-all">
                        {post?.creator.username}
                      </h2>
                    </label>
                    <div className="ml-auto text-accent/40 text-xs flex flex-row gap-1 items-center">
                      {post.createdAt
                        ? formatTimeAgo(post.createdAt.toString())
                        : ""}
                      {renderPrivacy(post.privacy)}
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold">{post?.title}</h1>
                  <ul className="flex gap-2 text-xl flex-wrap">
                    {post?.categories.map((category) => (
                      <li
                        key={category._id}
                        className="text-sm Category hover:font-bold cursor-pointer bg-secondary-2/40 size-fit px-2 py-1 rounded-xl"
                        onClick={() => handleSetCategory(category)}
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm whitespace-pre-wrap bg-secondary-2/40 rounded-lg p-1 overflow-auto max-h-[300px]">
                    {post?.description}
                  </p>
                </div>
                {post._id && likeSummarize && (
                  <LikeSummarize targetId={post._id} type="Post"/>
                )}
                {post._id && commentSummarize && (
                  <CommentSummarize targetId={post._id} type="Comments" />
                )}
                <div className="mt-auto">
                  {post._id && commentBar && (
                    <CommentSection postId={post._id} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
