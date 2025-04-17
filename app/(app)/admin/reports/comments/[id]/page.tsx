"use client";
import {
  fetchUserWithId,
  updateUserBanState,
  updateUserCreatorState,
} from "@actions/accountActions";
import { deletePost, fetchPostWithId, revivePost } from "@actions/postActions";
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
import PostReportTab from "@components/UI/Report/ReportTab";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import UserStatBar from "@components/UI/Profile/UserStatBar";
import UserReportTab from "@components/UI/Report/UserReportTab";
import UsersReportTab from "@components/UI/Report/UsersReportTab";
import { SubmitButtonState } from "@enum/submitButtonState";
import { UserRole } from "@enum/userRolesEnum";
import { renderRole } from "@lib/Admin/render";
import { formatDate } from "@lib/dateFormat";
import { Comment, Post, User } from "@lib/types";
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
import CommentProps from "@components/UI/Props/ComentProps";
import { deleteComment, fetchCommentWithId } from "@actions/commentAction";
import ReportTab from "@components/UI/Report/ReportTab";

export default function CommentDetails({ params }: { params: { id: string } }) {
  const [commentId, setCommentId] = useState(params.id );
  const [pendingText, setPendingText] = useState(
    params.id !== "postId" ? params.id : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState<Comment| null>(null);
  const [hideState, setHideState] = useState<SubmitButtonState>(
    SubmitButtonState.IDLE
  );


  const handleDelete = async () => {

      const result = await confirm("Do you want to delete this comment?");
      if (!result) return;
    
    if (!comment?._id) {
      toastMessage("Unavailable");
      return;
    }

    
    setHideState(SubmitButtonState.PROCESSING)
    try {
      const res = await deleteComment(comment._id);
      
      if (res) {
        setHideState(SubmitButtonState.SUCCESS)
        toastMessage("Comment deleted")
        return 
      } else {
        setHideState(SubmitButtonState.FAILED)
        toastMessage("Failed to delete comment")
      }
    } catch (error) {
      setHideState(SubmitButtonState.FAILED)
      toastError("Failed to delete comment")
      console.log(error)
    }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        setCommentId(pendingText);
    }
  };

  const fetchPost = async () => {
    setIsLoading(true);
    const res = await fetchCommentWithId(commentId);
    setComment(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    commentId.trim() && fetchPost();
  }, [commentId]);

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

      {comment && !isLoading && (
        <div className="panel_2 flex flex-wrap items-center gap-2 ">
          <span className="subtitle">Action</span>

          <div className="ml-auto flex flex-row gap-1">
            <SubmitButton
              state={hideState}
              changeState={setHideState}
              variant="Button_variant_1_5"
              onClick={handleDelete}
            >
             Delete Comment
            </SubmitButton>
          </div>
        </div>
      )}

      <div className="panel flex items-center justify-center">
          <CommentProps
           comment={comment}
          />
      </div>

      <div className="mx-auto">See comment's reports</div>
      <div className="flex flex-wrap gap-4">
        <ReportTab target={comment} type="Comment" />
      </div>
    </section>
  );
}
