"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type Post } from "@lib/types";
import CustomImage from "../Image/Image";
import { useSession } from "next-auth/react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faCameraRetro,
  faHammer,
  faHeart,
  faImage,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import {
  formatDate,
  formatTimeAgo,
  formatTimeAgoWithoutAgo,
} from "@lib/dateFormat";
import { UserRole } from "@enum/userRolesEnum";

type PostCardProps = {
  post?: Post;
  isLoading: boolean;
  adminPage?: boolean;
};

const getRandomColor = () => {
  const colors = [
    "bg-gradient-to-t from-red-500 to-yellow-300",
    "bg-gradient-to-br from-blue-500 to-indigo-300",
    "bg-gradient-to-tl from-green-500 to-teal-300",
    "bg-gradient-to-t from-purple-500 to-pink-300",
    "bg-gradient-to-t from-yellow-500 to-orange-300",
    "bg-gradient-to-r from-gray-500 to-gray-300",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function PostCard({
  post,
  isLoading,
  adminPage = false,
}: PostCardProps) {
  const { data: session } = useSession();

  const [bgColor, setBgColor] = useState<string | null>(null);
  const [minHeight, setMinHeight] = useState<number | null>(null);

  useEffect(() => {
    setBgColor(getRandomColor());
    setMinHeight(Math.floor(Math.random() * 201) + 150);
  }, []);

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
      </div>
    );
  else
    return (
      <Link
        href={
          adminPage ? `/admin/reports/posts/${post._id}` : `/post/${post._id}`
        }
        onClick={handlePostCardClick}
        className={`w-full h-fit relative `}
      >
        {post.creator.role?.includes(UserRole.ADMIN) ? (
          <div className="absolute -top-1 right-2 bg-red-600/70  p-1 rounded text-white z-40">
            <FontAwesomeIcon icon={faHammer}/>
          </div>
        ) : post.creator.role?.includes(UserRole.CREATOR) ? (
          <div className="absolute -top-1 right-2 bg-blue-600/70  p-1 rounded text-white z-40">
             <FontAwesomeIcon icon={faCameraRetro}/>
          </div>
        ) : null}
        {post.image.length > 1 && (
          <div className="size-full bg-accent/50 absolute bottom-1 left-1 rounded-md "></div>
        )}
        <div
          className={`${
            post.creator.role?.includes(UserRole.ADMIN)
              ? "border-4 border-white"
              : ""
          } relative w-full h-fit grid grid-cols-1 gap-2 rounded-md overflow-hidden cursor-pointer  shadow-sm transition-all duration-300 ease-out`}
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

          <div
            className={`flex flex-col justify-between hover:opacity-100 ${
              post.creator.role?.includes(UserRole.ADMIN)
                ? "opacity-100"
                : "opacity-0"
            } absolute p-2 bottom-0 left-0 bg-gradient-to-t from-black to-transparent text-white size-full`}
          >
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row gap-1 items-center bg-secondary-2/70 px-1 rounded-full text-sm">
                <FontAwesomeIcon icon={faHeart} />
                <p>{post.likes}</p>
              </div>
            </div>
            {post.image.length > 1 && (
              <div className="text-2xl text-center">
                +{post.image.length} <FontAwesomeIcon icon={faImage} />
              </div>
            )}
            <div className="h-fit w-full flex flex-row gap-2 items-center justify-start">
              <div className="transition-transform duration-200 hover:scale-110">
                <UserProfileIcon user={post.creator} size={"Icon_small"} />
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
