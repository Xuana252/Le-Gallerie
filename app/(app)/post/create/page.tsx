"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Form from "@components/Form";
import { useRouter } from "next/navigation";
import { type Category, type Post } from "@lib/types";
import { useSession } from "next-auth/react";

export default function CreatePost() {
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [post, setPost] = useState<Post>({
    creator: { _id: session?.user.id || "" },
    title: "",
    description: "",
    categories: [],
    image: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.log("Error while fetching for categories: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    console.log(post);
    if (post?.image) {
      try {
        const response = await fetch("/api/posts/new", {
          method: "POST",
          body: JSON.stringify({ ...post, creator: session?.user.id }),
        });

        if (response.ok) {
          console.log("Post created successfully");
          router.back();
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log("Something went wrong while creating post", error);
      }
    }
  };
  return (
    <section className="flex flex-col items-center justify-center  size-full">
      <Form
        type="Create"
        categories={categories}
        post={post}
        setPost={setPost}
        handleSubmit={handleCreatePost}
      ></Form>
    </section>
  );
}
