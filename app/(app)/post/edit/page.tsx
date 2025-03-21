"use client";
import React, { FormEvent, useEffect, useState } from "react";
import PostForm from "@components/Forms/PostForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { UploadImage, UploadPost } from "@lib/types";
import { uploadImage } from "@lib/upload";
import { PostPrivacy } from "@enum/postPrivacyEnum";

export default function EditPost() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const [postRendered, setPostRendered] = useState<boolean>(false);
  const { data: session } = useSession();
  const [post, setPost] = useState<UploadPost>({
    creator: { _id: session?.user.id || "" },
    title: "",
    description: "",
    categories: [],
    image: [
      {
        file: null,
        url: "",
      },
    ],
    privacy:PostPrivacy.PUBLIC
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
          image: post.image.map((img: string) => ({
            file: null,
            url: img
          })),
        };
        setPost(editPost);
        setPostRendered(true);
      }
    };
    handleLocalStorage();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      const editPost = {
        ...data,
        image: data.image.map((img: string) => ({
          file: null,
          url: img
        })),
      };
      if (JSON.stringify(editPost) !== JSON.stringify(post)) setPost(editPost);
    } catch (error) {
      console.log("Failed to fetch for post details", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center  grow">
      {postRendered && <PostForm type="Edit" editPost={post}></PostForm>}
    </section>
  );
}
