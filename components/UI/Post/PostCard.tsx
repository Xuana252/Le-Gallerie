"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type Post } from "@lib/types";
import CustomImage from "../Image/Image";
import { useSession } from "next-auth/react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faHeart,
  faImage,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import {
  formatDate,
  formatTimeAgo,
  formatTimeAgoWithoutAgo,
} from "@lib/dateFormat";
import { getRandomColor } from "@lib/Post/post";
import { UserRole } from "@enum/userRolesEnum";

type PostCardProps = {
  post?: Post;
  isLoading: boolean;
  adminPage?: boolean
};

export default function PostCard({ post, isLoading, adminPage=false }: PostCardProps) {
  const { data: session } = useSession();

  // const getRandomColor = () => {
  //   const colors = [
  //     "bg-gradient-to-t from-red-500 to-yellow-300",
  //     "bg-gradient-to-br from-blue-500 to-indigo-300",
  //     "bg-gradient-to-tl from-green-500 to-teal-300",
  //     "bg-gradient-to-t from-purple-500 to-pink-300",
  //     "bg-gradient-to-t from-yellow-500 to-orange-300",
  //     "bg-gradient-to-r from-gray-500 to-gray-300",
  //   ];
  //   return colors[Math.floor(Math.random() * colors.length)];
  // };

  const minHeight = useMemo(() => Math.floor(Math.random() * 201) + 150, []);
  const bgColor = useMemo(() => getRandomColor(), []);

  const handlePostCardClick = () => {
    if (
      session?.user.id &&
      post &&
      (post.creator.blocked?.includes(session?.user.id) ||
        session?.user.blocked?.includes(post.creator._id))
    )
      return;
    localStorage.setItem("post", JSON.stringify(post));
  };
  if (isLoading || !post)
    return (
      <div className=" relative w-full h-fit grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0  animate-slideUp ease-in-out">
        <div
          className={`animate-pulse w-full  ${bgColor}`}
          style={{
            minHeight: minHeight !== null ? `${minHeight}px` : undefined,
          }}
        ></div>
        <div className="flex flex-col justify-between hover:opacity-100 opacity-0 absolute p-2 bottom-0 left-0 bg-gradient-to-t from-black to-transparent text-white size-full">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row gap-1 items-center bg-secondary-2/70 p-1 rounded-full text-sm">
              <FontAwesomeIcon icon={faHeart} />
              <div className=" animate-pulse w-16 rounded-lg bg-secondary-1 h-4"></div>
            </div>

            <div className=" animate-pulse w-16 rounded-lg bg-secondary-1 h-4"></div>
          </div>
          <div className="h-fit w-full flex flex-row gap-2 items-center justify-start">
            <div className="transition-transform duration-200 hover:scale-110">
              <div className="Icon_small bg-secondary-1 animate-pulse"></div>
            </div>

            <div className="animate-pulse w-16 rounded-lg bg-secondary-1 h-4"></div>
          </div>
        </div>
      </div>
    );
  else
    return (
      <Link
        href={adminPage?`/admin/reports/posts/${post._id}`:`/post/${post._id}`}
        onClick={handlePostCardClick}
        className={`w-full h-fit relative `}
      >
        {post.image.length > 1 && (
          <div className="size-full bg-accent/50 absolute bottom-1 left-1 rounded-xl "></div>
        )}
        <div
          className={`${
            post.creator.role?.includes(UserRole.ADMIN)
              ? "border-4 border-red-500 shadow-xl shadow-white"
              : ""
          } relative w-full h-fit grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer  shadow-sm transition-all duration-300 ease-out`}
        >
          <CustomImage
            src={post.image[0]}
            alt={post.title}
            className="size-full"
            width={0}
            height={0}
            transformation={[{ quality: 50 }]}
            style={{ objectFit: "cover" }}
            loading="lazy"
          />

          <div className="flex flex-col justify-between hover:opacity-100 opacity-0 absolute p-2 bottom-0 left-0 bg-gradient-to-t from-black to-transparent text-white size-full">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row gap-1 items-center bg-secondary-2/70 px-1 rounded-full text-sm">
                <FontAwesomeIcon icon={faHeart} />
                <p>{post.likes}</p>
              </div>
              <p className="text-xs  italic bg-secondary-2/70 px-1 rounded-full">
                {post.createdAt ? formatDate(post.createdAt.toString()) : ""}
              </p>
            </div>
            {post.image.length > 1 && (
              <div className="text-2xl text-center">
                +{post.image.length} <FontAwesomeIcon icon={faImage} />
              </div>
            )}
            <div className="h-fit w-full flex flex-row gap-2 items-center justify-start">
              <div className="transition-transform duration-200 hover:scale-110">
                <UserProfileIcon
                  user={post.creator}
                  size={"Icon_small"}
                />
              </div>
              <div>
                <p className="text-left font-bold text-md h-fit w-full">
                  {post.title}
                </p>
                <ul className="flex overflow-x-scroll no-scrollbar h-fit gap-2 text-lg w-full">
                  {post.categories.map((category) => (
                    <li key={category._id} className="text-sm Category">
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
}
