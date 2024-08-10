'use client'
import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css'
import PostCard from './PostCard';


export default function Feed() {
  const [posts,setPosts] = useState([{
    _id:'123',
    creator: 'Xuan',
    title: 'TestCard',
    description: 'Hey',
    categories: ['Food','Animal'],
    image: 'https://www.cnet.com/a/img/resize/36e8e8fe542ad9af413eb03f3fbd1d0e2322f0b2/hub/2023/02/03/afedd3ee-671d-4189-bf39-4f312248fb27/gettyimages-1042132904.jpg?auto=webp&fit=crop&height=1200&width=1200'
  },{
    _id:'456',
    creator: 'Xuan',
    title: 'TestCard',
    description: 'Hey',
    categories: ['Food','Animal'],
    image: 'https://hungrybynature.com/wp-content/uploads/2017/09/pinch-of-yum-workshop-19.jpg'
  },])

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
    {posts.map((post)=> <PostCard key={post._id} data={post} />)}
  </Masonry>
  );
};
