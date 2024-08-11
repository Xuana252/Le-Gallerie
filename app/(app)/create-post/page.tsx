'use client'
import React, { FormEvent, useEffect, useState } from 'react';
import Form from '@components/Form';
import { useRouter } from 'next/navigation';
import { type Category, type Post } from '@lib/types';
import { useSession } from 'next-auth/react';

export default function CreatePost() { 
  const router =useRouter()
  const {data:session} = useSession()
  const [categories,setCategories] = useState<Category[]>([])
  const [post,setPost] = useState<Post>({
  creator: session?.user.id||'',
  title: '',
  image: '',
  categories: [],
  description: ''
  })

  const fetchCategories = async () => {
    try {
      const response = await fetch('api/categories')
      const data = await response.json()

      setCategories(data)
    } catch (error) {
      console.log('Error while fetching for categories: ',error)
    }
  }

  useEffect(()=>{
    fetchCategories()
  },[])

  const handleCreatePost = (e:FormEvent) =>{
    e.preventDefault();
    console.log('Creating post')
    router.back()

  }
  return (
     <section className='flex flex-col items-center justify-center h-full'>
      <Form type='Create' categories={categories} post={post} setPost={setPost} handleSubmit={handleCreatePost}></Form>
     </section>
  );
};
