"use client";

import { faUber } from "@fortawesome/free-brands-svg-icons";
import { faHeart as RegularHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faFaceSmile,
  faHeart as SolidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Comment } from "@lib/types";
import {
  fetchCommentReplies,
  fetchPostComment,
  fetchPostWithId,
  handleComment,
  handleLikeComment,
} from "@server/postActions";
import { RefObject, useEffect, useRef, useState } from "react";
import UserProfileIcon from "./UserProfileIcon";
import { useSession } from "next-auth/react";
import { formatTimeAgoWithoutAgo } from "@lib/dateFormat";
import InputBox from "@components/Input/InputBox";
import { useSearchParams } from "next/navigation";
import EmojiPicker from "emoji-picker-react";

export const CommentItem = ({
  comment,
  size = "small",
}: {
  comment: Comment;
  size?: "small" | "smaller";
}) => {
  const { data: session } = useSession();
  const commentRef = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const commentId = searchParams.get("commentId");
  const parentId = searchParams.get("parentId");
  const replyId = searchParams.get("replyId");
  const content = useRef<HTMLParagraphElement>(null);
  const replyBlock = useRef<HTMLTextAreaElement>(null);
  const [likeTimeOut, setLikeTimeOut] = useState(false);
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

  const handleLikeState = async () => {
    if (likeTimeOut) return;

    setLikeTimeOut(true);
    setLikesCount((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    setIsLiked((prev) => !prev);
    if (session?.user.id)
      await handleLikeComment(comment._id, session?.user.id);
    setTimeout(() => {
      setLikeTimeOut(false);
    }, 1000);
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
    setIsRepliesView(
      !!(replyId && [commentId, parentId].includes(comment._id))
    );
    if (commentId || parentId) {
      commentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      if (commentId) {
        commentRef.current?.classList.remove("Highlighted");
        commentRef.current?.classList.add("Highlighted");
        setTimeout(() => {
          commentRef.current?.classList.remove("Highlighted");
        }, 2000);
      }
    }
    if (replyId && replyRef.current) {
      replyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      replyRef.current?.classList.remove("Highlighted");
      replyRef.current?.classList.add("Highlighted");

      setTimeout(() => {
        replyRef.current?.classList.remove("Highlighted");
      }, 2000);
    }
  }, [parentId, commentId, replyId]);

  useEffect(() => {
    if (content.current) {
      setIsExpandable(
        content.current.scrollHeight > content.current.clientHeight
      );
    }
    fetchReplies();
  }, []);
  return (
    <div
      className="flex items-start gap-2 p-1"
      ref={
        [commentId, parentId].includes(comment._id)
          ? commentRef
          : replyId === comment._id
          ? replyRef
          : null
      }
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
            className={`font-semibold ${
              size === "small" ? "text-sm" : "text-xs"
            }`}
          >
            {comment.user.username}
          </span>
          <div className="relative">
            <p
              className={`max-h-[100px] whitespace-break-spaces overflow-ellipsis overflow-y-hidden break-words  ${
                size === "small" ? "text-xs" : "text-[0.9em]"
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
              <div className="relative">
                {/* <div className="absolute bottom-full right-0">
                  <EmojiPicker
                    height={"350px"}
                    onEmojiClick={handleEmojiSelect}
                    open={isEmojiPickerOpen}
                  />
                </div> */}
                <button className="Icon_smaller">
                  <FontAwesomeIcon icon={faFaceSmile} />
                </button>
              </div>
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
        <button
          className="Icon_smaller"
          onClick={handleLikeState}
          disabled={likeTimeOut}
        >
          {isLiked ? (
            <FontAwesomeIcon icon={SolidHeart} />
          ) : (
            <FontAwesomeIcon icon={RegularHeart} />
          )}
        </button>
        <span className="text-xs">{likesCount}</span>
      </div>
    </div>
  );
};

export const CommentSection = ({ postId }: { postId: string }) => {
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
  }, [postId]);

  return (
    <div className="flex flex-col items-center ">
      <div className="text-center">{comments.length} Comments</div>
      <button className="" onClick={() => setIsMinimize((prev) => !prev)}>
        {isMinimize ? "▼" : "▲"}
      </button>
      {!isMinimize ? (
        <ul className="max-h-[400px] w-full bg-secondary-2/20 flex flex-col gap-6 overflow-y-scroll no-scrollbar p-2 border-t-2 border-accent rounded-lg">
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
      ) : null}
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
