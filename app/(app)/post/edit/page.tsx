'use client'
import React, { FormEvent, useEffect, useState } from 'react';
import Form from '@components/Form';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Category, type Post } from '@lib/types';
import { useSession } from 'next-auth/react';


export default function EditPost() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  const router =useRouter()
  const {data:session} = useSession()
  const [categories,setCategories] = useState<Category[]>([])
  const [post,setPost] = useState<Post>({
    creator: { _id: session?.user.id || "" },
    title: "",
    description: "",
    categories: [],
    image: "",
  })
  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      const data =await response.json()
      setPost(data)
    } catch (error) {
      console.log('Failed to fetch for post details',error)
    }
  }
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()

      setCategories(data)
    } catch (error) {
      console.log('Error while fetching for categories: ',error)
    }
  }

  useEffect(()=>{
    fetchCategories()
    fetchPost()
  },[])


  const handleEditPost = async (e:FormEvent) =>{
    e.preventDefault();
    console.log(post)
    if(post?.image) {
      try {
        const response = await fetch(`/api/posts/${postId}`,{
          method: 'PATCH',
          body: JSON.stringify(post)
        })

        if(response.ok) {
          console.log('Post created successfully')
          router.back()
        } else {
          console.log(response)
        }

      } catch (error) {
        console.log('Something went wrong while creating post',error)
      }
    }

  }
  return (
     <section className='mt-4'>
      <Form type='Edit' categories={categories} post={post} setPost={setPost} handleSubmit={handleEditPost}></Form>
     </section>
  );
};
