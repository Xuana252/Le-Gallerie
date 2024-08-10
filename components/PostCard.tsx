import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Post } from '@lib/types';


export default function PostCard({data}:{data:Post}) {
  return (
    <Link href={`/post?id=${data._id}`} className="animate-slide-up-animation w-full h-fit  relative grid grid-cols-1  gap-2  rounded-xl overflow-hidden cursor-zoom-in " >
    <div
      className={`flex items-end flex-wrap hover:opacity-100 opacity-0 absolute p-2 bottom-0  left-0 bg-gradient-to-t from-black to-transparent text-white size-full`}
    >
      <div className="h-fit w-full">
        <p className="text-left font-bold text-xl h-fit w-full">{data.title}</p>
        <ul className="flex overflow-x-scroll no-scrollbar h-fit gap-2 text-lg w-full">
          {data.categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>
    </div>
    <Image src={data.image} alt={data.title} width={0} height={0} layout='responsive'  />
  </Link>
  );
};
