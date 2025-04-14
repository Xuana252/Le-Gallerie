"use client";
import {
  fetchUserWithId,
  updateUserBanState,
  updateUserCreatorState,
} from "@actions/accountActions";
import { deletePost, fetchPostWithId } from "@actions/postActions";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import toastError, {
  confirm,
  toastMessage,
} from "@components/Notification/Toaster";
import ImageSlider from "@components/UI/Image/ImageSlider";
import Feed from "@components/UI/Layout/Feed";
import MultiTabContainer from "@components/UI/Layout/MultiTabContainer";
import PostDetail from "@components/UI/Post/PostDetail";
import PostReportTab from "@components/UI/Post/PostReportTab";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import UserStatBar from "@components/UI/Profile/UserStatBar";
import UserReportTab from "@components/UI/Report/UserReportTab";
import UsersReportTab from "@components/UI/Report/UsersReportTab";
import { SubmitButtonState } from "@enum/submitButtonState";
import { UserRole } from "@enum/userRolesEnum";
import { renderRole } from "@lib/Admin/render";
import { formatDate } from "@lib/dateFormat";
import { Post, User } from "@lib/types";
import {
  faAt,
  faBirthdayCake,
  faBorderAll,
  faCalendar,
  faCameraRetro,
  faHeart,
  faLock,
  faLockOpen,
  faUnlock,
  faUserSlash,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function PostDetails({ params }: { params: { id: string } }) {
  const [postId, setPostId] = useState(params.id !== "postId" ? params.id : "");
  const [pendingText, setPendingText] = useState(
    params.id !== "postId" ? params.id : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPostId(pendingText);
    }
  };

  const fetchPost = async () => {
    setIsLoading(true);
    const res = await fetchPostWithId(postId);
    setPost(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    postId.trim() && fetchPost();
  }, [postId]);

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="title">Users Detail</div>

      <div className="panel">
        <InputBox
          type="SearchBox"
          value={pendingText}
          onTextChange={(e) => setPendingText(e.target.value)}
          onKeyDown={handleKeydown}
          placeholder="postId"
        />
      </div>

      <PostDetail
        available={true}
        post={post}
        isLoading={isLoading}
        interactBar={false}
        commentBar={false}
        likeSummarize={true}
        commentSummarize={true}
        slider={2}
      />

      <div className="mx-auto">See post's reports</div>
      <div className="flex flex-wrap gap-4">
        <PostReportTab post={post} />
      </div>
    </section>
  );
}
