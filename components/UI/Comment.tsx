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
  checkUserHasLiked,
  fetchCommentReplies,
  fetchPostComment,
  fetchPostWithId,
  handleComment,
  handleLikeComment,
} from "@actions/postActions";
import { useEffect, useRef, useState } from "react";
import UserProfileIcon from "./UserProfileIcon";
import { useSession } from "next-auth/react";
import { formatTimeAgoWithoutAgo } from "@lib/dateFormat";
import InputBox from "@components/Input/InputBox";
import { useRouter, useSearchParams } from "next/navigation";
import EmojiInput from "@components/Input/EmojiInput";
import ButtonWithTimeOut from "@components/Input/ButtonWithTimeOut";

export const CommentItem = ({
  comment,
  size = "small",
}: {
  comment: Comment;
  size?: "small" | "smaller";
}) => {
  const { data: session } = useSession();
  const commentRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const commentId = searchParams.get("commentId");
  const parentId = searchParams.get("parentId");
  const replyId = searchParams.get("replyId");
  const content = useRef<HTMLParagraphElement>(null);
  const replyBlock = useRef<HTMLTextAreaElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isExpandable, setIsExpandable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isRepliesView, setIsRepliesView] = useState(
    !!(replyId && [commentId, parentId].includes(comment._id))
  );

  const fetchLikeStatus = async () => {
    if (session?.user.id) {
      try {
        const result = await checkUserHasLiked(
          session.user.id,
          comment._id,
          "comment"
        );
        setIsLiked(result);
      } catch (error) {
        console.error("Failed to check if user has liked post", error);
      }
    }
  };

  const handleLikeState = async () => {
    setLikesCount((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    setIsLiked((prev) => !prev);
    if (session?.user.id)
      await handleLikeComment(comment._id, session?.user.id);
  };

  const fetchReplies = async () => {
    try {
      const replies = await fetchCommentReplies(comment._id);
      setReplies(replies);
    } catch (error) {}
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const handleReply = async () => {
    if (!comment.post._id || !session?.user.id) {
      return;
    }
    setIsReplying(false);
    await handleComment(
      comment.post._id,
      session.user.id,
      comment._id,
      replyContent
    );
    fetchReplies();
  };

  useEffect(() => {
    if (isReplying && replyBlock.current) {
      replyBlock.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isReplying]);

  useEffect(() => {
    fetchLikeStatus();
    fetchReplies();
    setIsRepliesView(
      !!(replyId && [commentId, parentId].includes(comment._id))
    );
    if (commentId || replyId) {
      commentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      commentRef.current?.classList.add("Highlighted");
      setTimeout(() => {
        commentRef.current?.classList.remove("Highlighted");
      }, 2000);
    }
  }, [parentId, commentId, replyId]);

  useEffect(() => {
    if (content.current) {
      setIsExpandable(
        content.current.scrollHeight > content.current.clientHeight
      );
    }
  }, []);
  return (
    <div
      className="flex items-start gap-2 p-1"
      ref={[commentId, replyId].includes(comment._id) ? commentRef : null}
    >
      {session?.user.id === comment.user._id ? (
        <UserProfileIcon currentUser={true} size={`Icon_${size}`} />
      ) : (
        <UserProfileIcon
          currentUser={false}
          user={comment.user}
          size={`Icon_${size}`}
        />
      )}
      <div className="flex flex-col w-[80%] gap-2">
        <div className="rounded-xl bg-secondary-2 w-fit px-2 py-1 text-sm">
          <span
            className={`font-semibold break-all whitespace-normal ${
              size === "small" ? "text-sm" : "text-xs"
            }`}
          >
            {comment.user.username}
          </span>
          <div className="relative">
            <p
              className={`max-h-[100px] whitespace-break-spaces overflow-ellipsis overflow-y-hidden break-words  ${
                size === "small" ? "text-sm" : "text-xs"
              }  ${isExpanded ? "max-h-fit" : "line-clamp-4"}`}
              ref={content}
            >
              {comment.content}
            </p>
            {isExpandable && (
              <div className={`text-center text-sm w-full`}>
                <button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="hover:font-semibold underline my-1"
                >
                  {isExpanded ? "...Collapse..." : "Expand"}
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          className={`flex gap-2 text-accent/50 ${
            size === "small" ? "text-xs" : "text-[0.7em]"
          }`}
        >
          <div>{formatTimeAgoWithoutAgo(comment.createdAt.toString())}</div>
          <button
            className="hover:text-accent"
            onClick={() => setIsReplying((prev) => !prev)}
          >
            Reply
          </button>
        </div>
        {isReplying && (
          <div className="flex flex-row items-start gap-2 border-l-2 border-accent p-2">
            <UserProfileIcon currentUser={true} size="Icon_smaller" />
            <textarea
              ref={replyBlock}
              value={replyContent}
              onChange={handleReplyChange}
              className="resize-none  h-fit text-xs Input_box_variant_3 grow "
              placeholder="type your reply here"
              spellCheck={false}
            />
            <div className="flex flex-col">
              <button className="Icon_smaller" onClick={handleReply}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
              <EmojiInput
                setEmoji={setReplyContent}
                size="smaller"
                direction="bottom"
              />
            </div>
          </div>
        )}
        {isRepliesView && (
          <ul className="flex flex-col gap-2 border-l-2 border-accent/50 pl-2 pt-2 pb-2">
            {replies
              .sort((a, b) => {
                const dateA = new Date(a.createdAt.toString());
                const dateB = new Date(b.createdAt.toString());

                return dateB.getTime() - dateA.getTime();
              })
              .map((reply) => (
                <CommentItem key={reply._id} comment={reply} size="smaller" />
              ))}
          </ul>
        )}
        {replies.length > 0 && (
          <button
            className={`text-sm w-fit ${isRepliesView ? "m-auto" : ""}`}
            onClick={() => setIsRepliesView((prev) => !prev)}
          >
            {isRepliesView
              ? "...Collapse..."
              : `..See ${replies.length} replies...`}
          </button>
        )}
      </div>
      <div className="flex flex-col items-center">
        <ButtonWithTimeOut
          timeOut={1000}
          className="Icon_smaller"
          onClick={handleLikeState}
        >
          {isLiked ? (
            <FontAwesomeIcon icon={SolidHeart} />
          ) : (
            <FontAwesomeIcon icon={RegularHeart} />
          )}
        </ButtonWithTimeOut>
        <span className="text-xs">{likesCount}</span>
      </div>
    </div>
  );
};

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
  const [comment, setComment] = useState("");

  const fetchComments = async () => {
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
      <div className="text-center">{comments.length} Comments</div>
      <button className="" onClick={() => setIsMinimize((prev) => !prev)}>
        {isMinimize ? (
          <FontAwesomeIcon icon={faAngleUp} />
        ) : (
          <FontAwesomeIcon icon={faAngleDown} />
        )}
      </button>
      <div className={`${isMinimize ? "hidden" : "inline-block"} w-full`}>
        <ul className="max-h-[400px]  w-full bg-secondary-2/20 flex flex-col gap-6 overflow-y-scroll no-scrollbar p-2 shadow-inner rounded-lg overscroll-none">
          {comments
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
            ))}
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
