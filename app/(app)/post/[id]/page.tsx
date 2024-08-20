"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDownload,
  faPenToSquare,
  faShare,
  faTrash,
  faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import Feed from "@components/UI/Feed";
import InputBox from "@components/Input/InputBox";
import { type Post } from "@lib/types";
import { useSession } from "next-auth/react";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import { checkUserHasLiked, deletePost, fetchPostWithId, handleLike } from "@server/postActions";

export default function Post({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [postRendered, setPostRendered] = useState<boolean>(false);
  const router = useRouter();
  const [likeTimeOut, setLikeTimeOut] = useState(false);
  const [postLikes, setPostLikes] = useState<number>(0);
  const [likedState, setLikedState] = useState<boolean>(false);
  const [post, setPost] = useState<Post>({
    _id: "",
    creator: { _id: "" },
    title: "",
    description: "",
    categories: [],
    image: "",
    likes: 0,
  });

  const handleSetLikedState = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (likeTimeOut) return;

    setLikeTimeOut(true);
    setPostLikes((prevLikes) => (likedState ? prevLikes - 1 : prevLikes + 1));
    setLikedState((prev) => !prev);
    if (session?.user.id) await handleLike(session?.user.id, params.id);
    setTimeout(() => {
      setLikeTimeOut(false);
    }, 1000);
  };

  const fetchPost = async () => {
    const data = await fetchPostWithId(params.id)

    if (data&&JSON.stringify(data) !== JSON.stringify(post)) {
      setPost(data);
      setPostLikes(data.likes);
    }
    setPostRendered(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = post.image;
    link.download = post.title || "download";
    link.click();
    link.parentNode?.removeChild(link);
  };
  const handleShare = () => {
    if (navigator.share) {
      // Use the Web Share API if available
      navigator
        .share({
          title: post.title,
          text: "Check out this photo!",
          url: post.image,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      const shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20this%20photo!&url=${encodeURIComponent(
        post.image
      )}`;
      window.open(shareUrl, "_blank");
    }
  };

  const handleDeletePost = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this post?");

    if (hasConfirmed) {
      try {
        await deletePost(params.id)
        console.log("Post deleted");
        router.back();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditButtonClick = () => {
    localStorage.setItem("post", JSON.stringify(post));
    router.push(`edit?id=${post?._id}`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchLikeStatus = async () => {
      if (session?.user.id) {
        try {
          const result = await checkUserHasLiked(session.user.id, params.id);
          setLikedState(result);
        } catch (error) {
          console.error("Failed to check if user has liked post", error);
        }
      }
    };
    fetchLikeStatus();
    fetchPost();
  }, [params.id, session]);

  useEffect(() => {
    const handleLocalStorage = () => {
      const storePost = localStorage.getItem("post");
      if (storePost) {
        const post = JSON.parse(storePost);
        setPost(post);
        setPostLikes(post.likes);
        setLikedState(post.liked);
        localStorage.removeItem("post"); // Remove after setting state
      }
    };
    handleLocalStorage();
  }, []);

  return (
    <section className="min-h-screen text-accent">
      <div className="mt-4">
        <button
          className="fixed top-[110px] left-4 Icon_big shadow-lg bg-secondary-1 z-40 over-"
          onClick={() => {
            router.back();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 rounded-3xl w-full max-w-[1080px] min-h-[400px] shadow-lg mx-auto bg-secondary-1 `}
        >
          <div className="flex items-center size-full sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden bg-secondary-2">
            <img src={post?.image} alt={post?.description} className="w-full" />
          </div>

          <div className="w-full p-4 flex flex-col gap-0">
            <div className="h-fit w-full grow ">
              <div className="flex-row p-2 h-fit z-10 flex sticky bg-secondary-1 top-[60px] gap-2">
                {postRendered&&<div className="flex justify-start items-center">
                  <button
                    className="Icon_small"
                    disabled={likeTimeOut}
                    onClick={handleSetLikedState}
                  >
                    {likedState ? (
                      <FontAwesomeIcon icon={solidHeart} />
                    ) : (
                      <FontAwesomeIcon icon={regularHeart} />
                    )}
                  </button>
                  <span>{postLikes} likes</span>
                </div>}

                <div className="flex-row flex ml-auto justify-end">
                  {session?.user && session?.user.id === post?.creator._id && (
                    <>
                      <button
                        className="hover:bg-secondary-2 Icon_small "
                        onClick={() => handleDeletePost()}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="hover:bg-secondary-2 Icon_small"
                        onClick={handleEditButtonClick}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </>
                  )}
                  <button
                    className="hover:bg-secondary-2 Icon_small "
                    onClick={handleDownload}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    className="hover:bg-secondary-2 Icon_small "
                    onClick={handleShare}
                  >
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                </div>
              </div>
              <div className="grow flex-col flex gap-2">
                <div className="flex items-center gap-2">
                  {session?.user?.id === post?.creator._id ? (
                    <UserProfileIcon currentUser={true} />
                  ) : (
                    <UserProfileIcon
                      currentUser={false}
                      user={post?.creator || { _id: "" }}
                    />
                  )}
                  <h2 className="text-sm">{post?.creator.username}</h2>
                </div>
                <h1 className="text-3xl font-bold">{post?.title}</h1>
                <ul className="flex gap-2 text-xl">
                  {post?.categories.map((category) => (
                    <li key={category._id} className="text-base Category">
                      {category.name}
                    </li>
                  ))}
                </ul>
                <p className="font-">{post?.description}</p>
              </div>
            </div>
            {session?.user && (
              <div className="bg-secondary-1 py-2 sticky z-1 left-0 bottom-0 flex flex-row items-center justify-between  w-full h-[60px] gap-2">
                <UserProfileIcon currentUser={true} />
                <InputBox type="Input">Make a comment...</InputBox>
              </div>
            )}
          </div>
        </div>
      </div>
      <br />
      <h1 className="text-center text-xl ">
        Explore more contents just like this
      </h1>
      {postRendered && <Feed categoryFilter={post?.categories}></Feed>}
    </section>
  );
}
