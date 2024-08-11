'use client'
import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css'
import PostCard from './PostCard';


export default function Feed() {
  const [posts,setPosts] = useState([])

  // const fetchPosts = async () => {
  //   const response  = await fetch('api/posts')
  //   const data = await response.json()
  //   setPosts(data)
  // }

  // useEffect(()=>{
  //   fetchPosts()
  // },[])

    const breakpointColumnsObj = {
        default: 5,
        1100: 3,
        700: 2,
        500: 1,
      };
  return (
    <Masonry
    breakpointCols={breakpointColumnsObj}
    className="my-masonry-grid w-full  "
    columnClassName="my-masonry-grid_column"
  >
    {posts.map((post)=> <PostCard key={post} data={post} />)}
  </Masonry>
  );
};
