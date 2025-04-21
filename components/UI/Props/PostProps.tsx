"use client";

import { Post } from "@lib/types";
import {
  faHeart,
  faImage,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import CustomImage from "../Image/Image";
import { formatDate } from "@lib/dateFormat";
import UserProfileIcon from "../Profile/UserProfileIcon";

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

export default function PostProps({ post }: { post?: Post | null }) {
  const [bgColor, setBgColor] = useState<string | null>(null);
  const [minHeight, setMinHeight] = useState<number | null>(null);

  useEffect(() => {
    setBgColor(getRandomColor());
    setMinHeight(Math.floor(Math.random() * 201) + 150);
  }, []);

  if (post)
    return (
      <div
        className={`relative w-full h-fit grid grid-cols-1 gap-2 rounded-md overflow-hidden cursor-pointer  shadow-sm transition-all duration-300 ease-out`}
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

        <div className="flex flex-col justify-between  absolute p-2 bottom-0 left-0 bg-gradient-to-t from-black to-transparent text-white size-full">
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
                redirect={false}
              />
            </div>
            <div>
              <p className="text-left font-bold text-md h-fit w-full">
                {post.title}
              </p>
              <ul className="flex overflow-x-scroll no-scrollbar h-fit gap-2 text-lg w-full">
                {post.categories.map((category) =>
                  category.name ? (
                    <li key={category._id} className="text-sm Category">
                      {category.name}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div
      className={` relative ${bgColor} w-full h-full grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0 shadow-md`}
      style={{
        minHeight: minHeight !== null ? `${minHeight}px` : undefined,
      }}
    >
      <div className="flex flex-col justify-between absolute p-2 bottom-0 left-0 size-full">
        <div className="flex flex-row justify-between items-center w-full gap-1">
          <div className="flex flex-row gap-1 items-center bg-secondary-2/70 p-1 rounded-full text-sm">
            <FontAwesomeIcon icon={faHeart} />
            <div className="  w-16 rounded-lg bg-secondary-1 h-4"></div>
          </div>
          <div className="  w-16 rounded-lg bg-secondary-1 h-4"></div>
        </div>
        <div className="h-fit w-full flex flex-row gap-2 items-center justify-start">
          <div className="transition-transform duration-200 hover:scale-110">
            <div className="Icon_small bg-secondary-1 "></div>
          </div>
          <div className=" w-16 rounded-lg bg-secondary-1 h-4"></div>
        </div>
      </div>
    </div>
  );
}
