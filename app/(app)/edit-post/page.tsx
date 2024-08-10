'use client'
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import Form from '@components/Form';

type Post = {
  title: string,
  image: string,
  categories: string[]
}

export default function EditPost() {
  const router =useRouter()
  const [post,setPost] = useState<Post>({
    title: '',
  image: '',
  categories: []
  })

  const handleEditPost = (e:FormEvent) =>{
    e.preventDefault();
    console.log('Creating post')
    router.back()

  }
  return (
     <section className='mt-4'>
      <Form type='Edit' setPost={setPost} handleSubmit={handleEditPost}></Form>
     </section>
  );
};
