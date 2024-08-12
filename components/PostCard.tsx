import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Post } from '@lib/types';


export default function PostCard({post}:{post:Post}) {
  return (
    <Link href={`/post/${post._id}`} className="animate-slide-up-animation w-full h-fit  relative grid grid-cols-1  gap-2  rounded-xl overflow-hidden cursor-zoom-in " >
    <div
      className={`flex items-end flex-wrap hover:opacity-100 opacity-0 absolute p-2 bottom-0  left-0 bg-gradient-to-t from-black to-transparent text-white size-full`}
    >
      <div className="h-fit w-full">
        <p className="text-left font-bold text-xl h-fit w-full">{post.title}</p>
        <ul className="flex overflow-x-scroll no-scrollbar h-fit gap-2 text-lg w-full">
          {post.categories.map((category) => (
            <li key={category._id}>{category.name}</li>
          ))}
        </ul>
      </div>
    </div>
    <Image src={post.image} alt={post.title} width={0} height={0} layout='responsive'  />
  </Link>
  );
};
