import { NumberLoader } from "@components/UI/Loader";
import PostCard from "@components/UI/Post/PostCard";
import CommentProps from "@components/UI/Props/ComentProps";
import PostProps from "@components/UI/Props/PostProps";
import { Reaction } from "@enum/reactionEnum";
import { renderReaction } from "@lib/Emoji/render";
import { Comment, Like } from "@lib/types";
import {
  faComment,
  faHeart,
  faListDots,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function PostInteractionSection({
  isVisible,
  postsLikes,
  postsComments,
}: {
  isVisible: boolean;
  postsLikes: Like[] | null;
  postsComments: Comment[] | null;
}) {
  const [likes, setLikes] = useState(postsLikes);
  const [comments, setComments] = useState(postsComments);
  const [animated, setAnimate] = useState(isVisible);
  const [displayNumber, setIsDisplayNumber] = useState("");

  useEffect(() => {
    setLikes(postsLikes);
  }, [postsLikes]);

  useEffect(() => {
    setComments(postsComments);
  }, [postsComments]);

  useEffect(() => {
    setAnimate(isVisible);
  }, [isVisible]);

  const reactions = [
    { type: Reaction.LIKE, left: "5%", top: "3%", scale: 1.2, zIndex: 40 },
    { type: Reaction.LOVE, left: "88%", top: "6%", scale: 1.3, zIndex: 40 },
    { type: Reaction.HAHA, left: "15%", top: "25%", scale: 1, zIndex: 40 },
    { type: Reaction.WOW, left: "82%", top: "32%", scale: 1.4, zIndex: 40 },
    { type: Reaction.SAD, left: "4%", top: "55%", scale: 1.1, zIndex: 40 },
    { type: Reaction.ANGRY, left: "78%", top: "65%", scale: 1.1, zIndex: 40 },
    { type: Reaction.LIKE, left: "30%", top: "10%", scale: 0.9, zIndex: 0 },
    { type: Reaction.LOVE, left: "30%", top: "24%", scale: 0.8, zIndex: 0 },
    { type: Reaction.HAHA, left: "70%", top: "50%", scale: 1.3, zIndex: 0 },
    { type: Reaction.WOW, left: "20%", top: "75%", scale: 1, zIndex: 0 },
    { type: Reaction.SAD, left: "65%", top: "10%", scale: 1.2, zIndex: 0 },
    { type: Reaction.ANGRY, left: "40%", top: "90%", scale: 0.9, zIndex: 0 },
  ];

  const leftReaction = reactions.filter(
    (reaction) => parseInt(reaction.left) <= 50
  );
  const rightReaction = reactions.filter(
    (reaction) => parseInt(reaction.left) > 50
  );

  const placeholders = [
    { top: "80%", left: "60%", scale: 1.4 },
    { top: "20%", left: "60%", scale: 1.1 },
    { top: "40%", left: "26%", scale: 1.3 },
  ];

  return (
    <section
      className="flex flex-col"
      style={{
        opacity: animated ? 1 : 0,
      }}
    >
      <div className={`title ${animated ? "animate-slideLeft" : ""} ml-auto`}>
        Your posts have received{" "}
        {postsLikes && postsComments ? (
          postsLikes.length + postsComments.length
        ) : (
          <NumberLoader />
        )}{" "}
        interactions
      </div>

      <div className="relative self-center mt-[100px] w-full m-auto max-w-[700px] max-h-[500px]">
        <div className="bloom_up  size-full absolute  "></div>
        <div
          className={`${
            animated ? "animate-slideLeft" : ""
          } size-full absolute`}
        >
          {leftReaction.map((reaction, index) => (
            <div
              onMouseEnter={() => setIsDisplayNumber("lr" + index)}
              onMouseLeave={() => setIsDisplayNumber("null")}
              key={index}
              className={`absolute flex flex-col items-center gap-1 size-10 `}
              style={{
                left: reaction.left,
                top: reaction.top,
                zIndex: reaction.zIndex,
              }}
            >
              <div
                style={{
                  transform: `scale(${reaction.scale})`,
                  filter: `blur(${1.7 - reaction.scale}px)`,
                }}
              >
                {renderReaction(reaction.type)}
              </div>
              <div
                className={`${
                  displayNumber === "lr" + index
                    ? "animate-slideUp text-accent/70 text-xs font-semibold rounded-md bg-primary p-1 w-fit"
                    : "hidden"
                }`}
              >
                {
                  postsLikes?.filter((likes) => likes.reaction === reaction.type)
                    .length
                }
              </div>
            </div>
          ))}
        </div>
        <div
          className={`${
            animated ? "animate-slideRight" : ""
          } size-full absolute`}
        >
          {rightReaction.map((reaction, index) => (
            <div
              onMouseEnter={() => setIsDisplayNumber("rr" + index)}
              onMouseLeave={() => setIsDisplayNumber("null")}
              key={index}
              className={`absolute flex flex-col items-center gap-1 size-10 `}
              style={{
                left: reaction.left,
                top: reaction.top,
                zIndex: reaction.zIndex,
              }}
            >
              <div
                style={{
                  transform: `scale(${reaction.scale})`,
                  filter: `blur(${1.7 - reaction.scale}px)`,
                }}
              >
                {renderReaction(reaction.type)}
              </div>
              <div
                className={`${
                  displayNumber === "rr" + index
                    ? "animate-slideUp text-accent/70 text-xs font-semibold rounded-md bg-primary p-1 w-fit "
                    : "hidden"
                }`}
              >
                {
                  postsLikes?.filter((likes) => likes.reaction === reaction.type)
                    .length
                }
              </div>
            </div>
          ))}
        </div>

        <div className="  max-w-[150px] min-w-[200px] m-auto z-50 aspect-[2/3]">
          <div className={`size-full ${animated ? "animate-slideUp" : ""}`}>
            <PostProps />
          </div>

          <div className="shadow"></div>
        </div>

        {placeholders.map((pos, index) => (
          <div
            onMouseEnter={() => setIsDisplayNumber("c" + index)}
            onMouseLeave={() => setIsDisplayNumber("null")}
            key={index}
            className={`absolute  flex flex-col items-center gap-1 ${
              animated
                ? parseFloat(pos.left) <= 50
                  ? "animate-slideRight"
                  : "animate-slideLeft"
                : ""
            }`}
            style={{ top: pos.top, left: pos.left, scale: pos.scale }}
          >
            <CommentProps />
            <div
              className={`${
                displayNumber === "c" + index
                  ? "animate-slideUp text-accent/70 text-xs font-semibold rounded-md bg-primary p-1 w-fit "
                  : "hidden"
              }`}
            >
              {postsComments?.length}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
