"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Feed from "@components/UI/Layout/Feed";
import { Category, Comment, User, type Post } from "@lib/types";
import { useSession } from "next-auth/react";
import { fetchPostWithId } from "@actions/postActions";
import PostDetail from "@components/UI/Post/PostDetail";
import mongoose, { Schema } from "mongoose";
import { PostPrivacy } from "@enum/postPrivacyEnum";
import Head from "next/head";



export default function Post({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availableState, setAvailableState] = useState(true);
  const [post, setPost] = useState<Post | null>(null);

  const fetchPost = async () => {
    setIsLoading(true);
    const data = await fetchPostWithId(params.id);

    if (data.status === 200) {
      if (data.data && JSON.stringify(data.data) !== JSON.stringify(post)) {
        setPost(data.data);
      }
      setAvailableState(true);
    } else {
      setAvailableState(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchPost();
  }, [params.id]);

  useEffect(() => {
    const handleLocalStorage = () => {
      const storePost = localStorage.getItem("post");
      if (storePost) {
        const post = JSON.parse(storePost);
        setPost(post);
        localStorage.removeItem("post"); // Remove after setting state
        setIsLoading(false);
      }
    };
    handleLocalStorage();
  }, []);


  return (
    <section className="min-h-screen text-accent">
      <div className="mt-4">
        <button
          className="fixed top-[110px] left-4  shadow-lg bg-secondary-1 z-40 Icon "
          onClick={() => {
            router.back();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <PostDetail
          available={availableState}
          post={post}
          isLoading={isLoading}
        />
      </div>
      <br />
      <h1 className="text-center text-xl ">
        Explore more contents just like this
      </h1>
      <Feed relatePostFilter={params.id} showCateBar={false}></Feed>
    </section>
  );
}
