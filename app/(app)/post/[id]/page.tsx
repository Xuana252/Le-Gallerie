"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Feed from "@components/UI/Feed";
import { Category, Comment, User, type Post } from "@lib/types";
import { useSession } from "next-auth/react";
import {
  fetchPostWithId,
} from "@server/postActions";
import PostDetail from "@components/UI/PostDetail";

export default function Post({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [postRendered, setPostRendered] = useState<boolean>(false);
  const router = useRouter();
  const [post, setPost] = useState<Post>({
    _id: "",
    creator: { _id: "" },
    title: "",
    description: "",
    categories: [],
    image: "",
    likes: 0,
  });


  const fetchPost = async () => {
    const data = await fetchPostWithId(params.id);

    if (data && JSON.stringify(data) !== JSON.stringify(post)) {
      setPost(data);
    }
    setPostRendered(true);
  };



  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchPost();
  }, [params.id, session]);

  useEffect(() => {
    const handleLocalStorage = () => {
      const storePost = localStorage.getItem("post");
      if (storePost) {
        const post = JSON.parse(storePost);
        setPost(post);
        localStorage.removeItem("post"); // Remove after setting state
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
          <PostDetail post={post}/>
      </div>
      <br />
      <h1 className="text-center text-xl ">
        Explore more contents just like this
      </h1>
      {postRendered&&<Feed categoryFilter={post.categories}></Feed>}
    </section>
  );
}
