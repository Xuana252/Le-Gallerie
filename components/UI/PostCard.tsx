"use client";
import React, { useState } from "react";
import Link from "next/link";
import { type Post } from "@lib/types";
import CustomImage from "./Image";
import { useSession } from "next-auth/react";

export default function PostCard({ post }: { post: Post }) {
  const {data:session} = useSession();
  const handlePostCardClick = () => {
    if(session?.user.id&&(post.creator.blocked?.includes(session?.user.id)||session?.user.blocked?.includes(post.creator._id))) return
    localStorage.setItem("post", JSON.stringify(post));
  };
  return (
    <Link
      href={`/post/${post._id}`}
      onClick={handlePostCardClick}
      className="animate-slide-up-animation relative w-full h-fit grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0 animate-slideUp"
    >
      <CustomImage
        src={post.image}
        alt={post.title}
        className="size-full"
        width={0}
        height={0}
        transformation={[{ quality: 50 }]}
        style={{ objectFit: "cover" }}
        loading="lazy"
      />
      <div className="flex items-end flex-wrap hover:opacity-100 opacity-0 absolute p-2 bottom-0 left-0 bg-gradient-to-t from-black to-transparent text-white size-full">
        <div className="h-fit w-full">
          <p className="text-left font-bold text-xl h-fit w-full">
            {post.title}
          </p>
          <ul className="flex overflow-x-scroll no-scrollbar h-fit gap-2 text-lg w-full">
            {post.categories.map((category) => (
              <li key={category._id} className="text-base Category">
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  );
}
