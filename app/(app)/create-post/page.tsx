'use client'
import React, { FormEvent, useState } from 'react';
import Form from '@components/Form';
import { useRouter } from 'next/navigation';

type Post = {
  title: string,
  image: string,
  categories: string[]
}

export default function CreatePost() {
  const router =useRouter()
  const [post,setPost] = useState<Post>({
    title: '',
  image: '',
  categories: []
  })

  const handleCreatePost = (e:FormEvent) =>{
    e.preventDefault();
    console.log('Creating post')
    router.back()

  }
  return (
     <section className='mt-4'>
      <Form type='Create' setPost={setPost} handleSubmit={handleCreatePost}></Form>
     </section>
  );
};
