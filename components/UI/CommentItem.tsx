import {
  handleLikeComment,
  fetchCommentReplies,
  handleComment,
  fetchCommentLikes,
} from "@actions/postActions";
import ButtonWithTimeOut from "@components/Input/ButtonWithTimeOut";
import EmojiInput from "@components/Input/EmojiInput";
import { formatTimeAgoWithoutAgo } from "@lib/dateFormat";
import {
  faArrowUp,
  faComment,
  faPaperPlane,
  faSeedling,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useRef, useState, useEffect } from "react";
import { useSession } from "@node_modules/next-auth/react";
import { useSearchParams } from "@node_modules/next/navigation";
import UserProfileIcon from "./UserProfileIcon";
import { Comment, Like } from "@lib/types";
import ReactionButton from "@components/Input/ReactionInput";
import { Reaction } from "@app/enum/reactionEnum";
import { getTop3Reactions, renderReaction } from "@lib/Emoji/render";

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

  const [commentLikes, setCommentLikes] = useState<Like[]>([]);
  const [likesCount, setLikesCount] = useState(comment.likes);
  const [myReaction, setMyReaction] = useState<Reaction | null>(null);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isExpandable, setIsExpandable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isRepliesView, setIsRepliesView] = useState(
    !!(replyId && [commentId, parentId].includes(comment._id))
  );

  const handleLikeState = async (reaction: Reaction | null) => {
    if (session?.user.id) {
      setMyReaction(reaction);
      await handleLikeComment(comment._id, session?.user.id, reaction);
    }
  };

  const fetchReplies = async () => {
    try {
      const replies = await fetchCommentReplies(comment._id);
      setReplies(replies);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLikes = async () => {
    try {
      const likes = await fetchCommentLikes(
        comment._id,
        comment.post._id || ""
      );
      setMyReaction(
        likes.find((like: any) => like.user._id === session?.user.id)?.reaction
      );
      setCommentLikes(likes || []);
    } catch (error) {
      console.log(error);
    }
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
    fetchLikes();
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
          className={`flex gap-2 text-accent/50 items-center ${
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

          <ReactionButton
            style="vertical"
            type="Icon_smaller"
            drop="left"
            reaction={myReaction}
            action={(r: Reaction | null) => handleLikeState(r)}
          />
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
                <FontAwesomeIcon icon={faArrowUp} />
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
      {commentLikes.length>0 && (<div className="flex flex-col items-center">
        
          <div className="rounded-full w-fit flex flex-row p-1 pr-2 items-center bg-primary/50">
            {getTop3Reactions(commentLikes).map((reaction, index) => (
              <div className={`size-4 -mr-1 `} style={{ zIndex: 3 - index }}>
                {renderReaction(reaction)}
              </div>
            ))}
          </div>
        
        <span className="text-xs">{likesCount}</span>
      </div>)}
    </div>
  );
};
