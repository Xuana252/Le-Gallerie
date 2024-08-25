"use client";
import React, { FormEvent, useEffect, useState } from "react";
import PostForm from "@components/Forms/PostForm";
import { useRouter, useSearchParams } from "next/navigation";
import { SubmitButtonState, type Category, type Post } from "@lib/types";
import { useSession } from "next-auth/react";

export default function EditPost() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const [postRendered,setPostRendered]  = useState<boolean>(false)
  const { data: session } = useSession();
  const [post, setPost] = useState({
    creator: { _id: session?.user.id ||'' },
    title: "",
    description: "",
    categories: [],
    image: {
      file: null,
      url:'',
    },
  });

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    const handleLocalStorage = () => {
      const storePost = localStorage.getItem("post");
      if (storePost) {
        const post = JSON.parse(storePost);
        const editPost = {
          ...post,
          image: {
            file:null,
            url:post.image,
          }
        }
        setPost(editPost);
        setPostRendered(true) 
      }
    };
    handleLocalStorage();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      if(JSON.stringify(data)!==JSON.stringify(post))
        setPost(data);
    } catch (error) {
      console.log("Failed to fetch for post details", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center  grow">
      {postRendered&&<PostForm
        type="Edit"
        editPost={post}
      ></PostForm>}
    </section>
  );
}
