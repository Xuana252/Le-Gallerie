"use client";

import { faUber } from "@fortawesome/free-brands-svg-icons";
import { faHeart as RegularHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faAngleUp,
  faFaceSmile,
  faHeart as SolidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Comment } from "@lib/types";
import {

  fetchPostWithId,

} from "@actions/postActions";
import { useEffect, useRef, useState } from "react";
import UserProfileIcon from "../../Profile/UserProfileIcon";
import { useSession } from "next-auth/react";
import { formatTimeAgoWithoutAgo } from "@lib/dateFormat";
import InputBox from "@components/Input/InputBox";
import { useRouter, useSearchParams } from "next/navigation";
import EmojiInput from "@components/Input/EmojiInput";
import ButtonWithTimeOut from "@components/Input/ButtonWithTimeOut";
import { CommentItem } from "./CommentItem";
import { fetchPostComment, handleComment } from "@actions/commentAction";

export const CommentSection = ({ postId }: { postId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const commentId = searchParams.get("commentId");
  const parentId = searchParams.get("parentId");
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isMinimize, setIsMinimize] = useState<boolean>(
    !!!(commentId || parentId)
  );

  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");

  const fetchComments = async () => {
    setIsLoading(true);
    const response = await fetchPostComment(postId);
    const replyComment = response.find(
      (comment: any) => comment._id.toString() === commentId && comment.parent
    );
    if (replyComment) {
      router.replace(
        `/post/${postId}?parentId=${replyComment.parent.toString()}&replyId=${replyComment._id.toString()}`
      );
    }
    setComments(response);
    setIsLoading(false);
  };

  const handleCommentTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleMakeComment = async () => {
    if (!comment || !session?.user.id) return;
    setComment("");
    setIsMinimize(false);
    await handleComment(postId, session.user.id, "", comment);
    await fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [postId, commentId]);

  return (
    <div className="flex flex-col items-center ">
      <div className="text-center">{comments.length||"..."} Comments</div>
      <button className="" onClick={() => setIsMinimize((prev) => !prev)}>
        {isMinimize ? (
          <FontAwesomeIcon icon={faAngleUp} />
        ) : (
          <FontAwesomeIcon icon={faAngleDown} />
        )}
      </button>
      <div className={`${isMinimize ? "hidden" : "inline-block"} w-full`}>
        <ul className="max-h-[400px]  w-full bg-secondary-2/20 flex flex-col gap-6 overflow-y-scroll no-scrollbar p-2 shadow-inner rounded-lg overscroll-none">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <li
                  key={index}
                  className="grid  grid-cols-[auto_1fr_auto] w-full gap-2 items-start"
                >
                  <div className="size-9 rounded-full animate-pulse bg-secondary-2"></div>
                  <div className="flex flex-col gap-2 rounded-xl h-12 w-fit  animate-pulse bg-secondary-2 p-2">
                    <div className="bg-accent animate-pulse rounded-md grow w-[100px]"></div>
                    <div className="bg-accent animate-pulse rounded-md grow w-[200px]"></div>
                  </div>
                  <div className="rounded-full size-4 animate-pulse bg-secondary-2">
                    
                  </div>
                </li>
              ))
            : comments.length > 0
            ? comments
                .filter((comment) => comment.parent === null)
                .sort((a, b) => {
                  // Convert ISO strings to Date objects
                  const dateA = new Date(a.createdAt.toString());
                  const dateB = new Date(b.createdAt.toString());
                  // Compare the Date objects
                  return dateB.getTime() - dateA.getTime();
                })
                .map((comment) => (
                  <div key={comment._id}>
                    <CommentItem comment={comment} />
                  </div>
                ))
            : ""}
        </ul>
      </div>
      {session?.user && (
        <div className="bg-secondary-1 py-2 flex flex-row items-center justify-between  w-full h-[60px] gap-2">
          <UserProfileIcon currentUser={true} />
          <InputBox
            type="Input"
            value={comment}
            onTextChange={handleCommentTextChange}
          >
            Make a comment...
          </InputBox>
          <button className="Icon" onClick={handleMakeComment}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      )}
    </div>
  );
};
