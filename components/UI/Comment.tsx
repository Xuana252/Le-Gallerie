"use client";

import { faUber } from "@fortawesome/free-brands-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faPaperPlane, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Comment } from "@lib/types";
import { fetchPostComment, fetchPostWithId, handleComment } from "@server/postActions";
import { useEffect, useRef, useState } from "react";
import UserProfileIcon from "./UserProfileIcon";
import { useSession } from "next-auth/react";
import { formatTimeAgoWithoutAgo } from "@lib/dateFormat";
import InputBox from "@components/Input/InputBox";

export const CommentItem = ({ comment }: { comment: Comment }) => {
  const { data: session } = useSession();

  const content = useRef<HTMLParagraphElement>(null);
  const [repliesCount, setRepliesCount] = useState(0);
  const [isExpandable, setIsExpandable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (content.current) {
      setIsExpandable(
        content.current.scrollHeight > content.current.clientHeight
      );
    }
    console.log();
  }, []);
  return (
    <div className="flex items-start gap-2">
      {session?.user.id === comment.user._id ? (
        <UserProfileIcon currentUser={true} />
      ) : (
        <UserProfileIcon currentUser={false} user={comment.user} />
      )}
      <div className="flex flex-col w-[80%]">
        <span className="font-semibold">{comment.user.username}</span>
        <div className="relative mb-2">
          <p
            className={`max-h-[100px] whitespace-break-spaces overflow-ellipsis overflow-y-hidden break-words ${
              isExpanded ? "max-h-fit" : "line-clamp-4"
            }`}
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
        <div className="flex gap-2 text-accent/50 text-sm">
          <div>{formatTimeAgoWithoutAgo(comment.createdAt.toString())}</div>
          <button className="hover:text-accent">Reply</button>
        </div>
        {repliesCount > 0 && <div>..See {repliesCount} replies...</div>}
      </div>
      <div className="flex flex-col items-center">
        <FontAwesomeIcon icon={faHeart} />
        <span>{comment.likes}</span>
      </div>
    </div>
  );
};

export const CommentSection = ({ postId }: { postId: string }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isMinimize, setIsMinimize] = useState(true);
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
    await handleComment(postId, session.user.id, "", comment);
    await fetchComments()
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
            .sort((a, b) => {
              // Convert ISO strings to Date objects
              const dateA = new Date(a.createdAt.toString());
              const dateB = new Date(b.createdAt.toString());

              // Compare the Date objects
              return dateB.getTime() -  dateA.getTime() ;
            })
            .map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
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
