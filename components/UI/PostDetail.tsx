"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDownload,
  faPaperPlane,
  faPen,
  faShare,
  faTrash,
  faUser,
  faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { Category, Post, User } from "@lib/types";
import { removeImage } from "@lib/upload";
import {
  checkUserHasLiked,
  deletePost,
  fetchPostLikedUser,
  handleLike,
} from "@actions/postActions";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import CustomImage from "./Image";
import { useSession } from "next-auth/react";
import UserProfileIcon from "./UserProfileIcon";
import ButtonWithTimeOut from "@components/Input/ButtonWithTimeOut";
import DropDownButton from "@components/Input/DropDownButton";
import { SearchContext } from "./Nav";
import { CommentSection } from "./Comment";
import { confirm } from "@components/Notification/Toaster";
import { formatTimeAgo, formatTimeAgoWithoutAgo } from "@lib/dateFormat";

export default function PostDetail({ post }: { post: Post }) {
    const { handleSetCategory } = useContext(SearchContext);
  const router = useRouter();
  const { data: session } = useSession();
  const [postRendered, setPostRendered] = useState<boolean>(false);
  const [postLikes, setPostLikes] = useState<number>(post.likes||0);
  const [likedState, setLikedState] = useState<boolean>(false);
  const [likes, setLikes] = useState<User[]>([]);

  const handleCategoryCLick = (category: Category) => {
    handleSetCategory(category);
    router.push("/");
  };

  useEffect(()=>{
    // fetchLikeStatus()
    fetchLikesUsers()
    setPostRendered(true)
    setPostLikes(post.likes||0)
  },[post])

//   const fetchLikeStatus = async () => {
//     if (session?.user.id && post._id) {
//       try {
//         const result = await checkUserHasLiked(
//           session.user.id,
//           post._id,
//           "post"
//         );
//         setLikedState(result);
//       } catch (error) {
//         console.error("Failed to check if user has liked post", error);
//       }
//     }
//   };
  const fetchLikesUsers = async () => {
    if (!post._id) return;
    try {
      const response = await fetchPostLikedUser(post._id);
      setLikes(response);
      setLikedState(response.find((user:any)=>user._id===session?.user.id))

    } catch (error) {
      console.error("Failed to fetch users that has liked post", error);
    }
  };

  const handleSetLikedState = async () => {
    setPostLikes((prevLikes) => (likedState ? prevLikes - 1 : prevLikes + 1));
    setLikedState((prev) => !prev);
    if (session?.user.id && post._id) {
      await handleLike(session?.user.id, post._id);
      if(likes.find(user=>user._id===session.user.id)) {
        setLikes(prev=>prev.filter(user=>user._id!==session.user.id))
      } else {
          setLikes(prev=>[...prev,{_id:session.user.id,
            username: session.user.name,
            image: session.user.image,
            bio: session.user.bio} as User])
      }
    }
  };

  const handleDownload = () => {
    if(!post._id) return;
    const link = document.createElement("a");
    link.href = post.image;
    link.target = "_blank";
    link.download = post.title || "download";
    link.click();
    link.parentNode?.removeChild(link);
  };
  const handleShare = () => {
    if(!post._id) return;
    if (navigator.share) {
      // Use the Web Share API if available
      navigator
        .share({
          title: post.title,
          text: "check out this photo",
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
    const hasConfirmed = await confirm(
      "Are you sure you want to delete this post?"
    );

    if (hasConfirmed && post._id) {
      try {
        await removeImage(post.image);
        await deletePost(post._id);
        router.back();
        console.log("Post deleted");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditButtonClick = () => {
    localStorage.setItem("post", JSON.stringify(post));
    router.push(`edit?id=${post?._id}`);
  };

  const likedUser = (
    <div className="h-fit w-52">
      <span className="font-bold">Liked by</span>
      <ul className="flex flex-col gap-2 p-1 bg-secondary-2/50 h-48 rounded-xl overflow-y-scroll no-scrollbar">
        {likes.map((user, index) => (
          <label key={index} className="grid grid-cols-[auto_1fr] items-center gap-2">
            {session?.user?.id === user._id ? (
              <UserProfileIcon currentUser={true} size={"Icon_small"} />
            ) : (
              <UserProfileIcon
                currentUser={false}
                user={user || { _id: "" }}
                size={"Icon_small"}
              />
            )}
            <h2 className="text-sm cursor-pointer text-accent max-w-[150px] w-[150px] whitespace-nowrap overflow-x-hidden overflow-ellipsis">
              {user.username}
            </h2>
          </label>
        ))}
      </ul>
    </div>
  );
  return (
    <div
      className={`Form`}
    >
      <div className="flex items-center size-full relative sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden bg-secondary-2">
        {post.image&&<CustomImage
          src={post.image}
          alt={post.title}
          className="w-full"
          width={0}
          height={0}
          transformation={[{ quality: 100 }]}
          style={{ objectFit: "cover" }}
          lqip={{ active: true, quality: 20 }}
        />}
      </div>

      <div className="w-full p-4 flex flex-col gap-0 ">
        <div className="flex-row p-2 h-fit z-20 flex sticky bg-secondary-1 top-[59px] gap-2">
          <div className="flex justify-start items-center">
            {postRendered&&<ButtonWithTimeOut
              timeOut={1000}
              className="Icon_small"
              onClick={handleSetLikedState}
            >
              {likedState ? (
                <FontAwesomeIcon icon={solidHeart} />
              ) : (
                <FontAwesomeIcon icon={regularHeart} />
              )}
            </ButtonWithTimeOut>}
            <DropDownButton
              hover={true}
              dropDownList={likedUser}
              dropDirection={"right"}
            >
              <span className="hover:underline">{postLikes} likes</span>
            </DropDownButton>
          </div>

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
                  <FontAwesomeIcon icon={faPen} />
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
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <label className="grid grid-cols-[auto_1fr] items-center gap-2">
              {session?.user?.id === post?.creator._id ? (
                <UserProfileIcon currentUser={true} />
              ) : (
                <UserProfileIcon
                  currentUser={false}
                  user={post?.creator || { _id: "" }}
                />
              )}
              <h2 className="text-sm cursor-pointer font-bold whitespace-normal break-all">
                {post?.creator.username}
              </h2>
            </label>
            <div className="ml-auto text-accent/40">{post.createdAt?formatTimeAgo(post.createdAt.toString()):""}</div>
          </div>
          <h1 className="text-3xl font-bold">{post?.title}</h1>
          <ul className="flex gap-2 text-xl flex-wrap">
            {post?.categories.map((category) => (
              <li
                key={category._id}
                className="text-sm Category hover:font-bold cursor-pointer bg-secondary-2/40 size-fit px-2 py-1 rounded-xl"
                onClick={() => handleCategoryCLick(category)}
              >
                {category.name}
              </li>
            ))}
          </ul>
          <p className="font-">{post?.description}</p>
        </div>
        <div className="mt-auto">
          {post._id&&<CommentSection postId={post._id} />}
        </div>
      </div>
    </div>
  );
}
