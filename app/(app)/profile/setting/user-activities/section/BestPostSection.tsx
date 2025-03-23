import { NumberLoader } from "@components/UI/Loader";
import PostCard from "@components/UI/Post/PostCard";
import CommentProps from "@components/UI/Props/ComentProps";
import { Reaction } from "@enum/reactionEnum";
import { renderReaction } from "@lib/Emoji/render";
import React, { useEffect, useRef, useState } from "react";

export default function BestPostSection({ isVisible }: { isVisible: boolean }) {
  const [postCount, setPostCount] = useState(null);
  const [animated, setAnimate] = useState(isVisible);


  useEffect (()=>{setAnimate(isVisible)},[isVisible])
  const reactions = [
    {
      reaction: Reaction.LIKE,
      left: "22%",
      top: "5%",
      scale: 1.5,
      rotate: -30,
    },
    {
      reaction: Reaction.LOVE,
      left: "63%",
      top: "10%",
      scale: 1.4,
      rotate: 25,
    },
    {
      reaction: Reaction.HAHA,
      left: "32%",
      top: "20%",
      scale: 1.3,
      rotate: -20,
    },
    { reaction: Reaction.WOW, left: "68%", top: "25%", scale: 0.8, rotate: 60 },
    {
      reaction: Reaction.SAD,
      left: "24%",
      top: "35%",
      scale: 0.7,
      rotate: -45,
    },
    {
      reaction: Reaction.ANGRY,
      left: "55%",
      top: "40%",
      scale: 1.0,
      rotate: -35,
    },
    {
      reaction: Reaction.HAHA,
      left: "38%",
      top: "50%",
      scale: 0.9,
      rotate: -20,
    },
    {
      reaction: Reaction.LOVE,
      left: "50%",
      top: "55%",
      scale: 0.8,
      rotate: 20,
    },
    {
      reaction: Reaction.LIKE,
      left: "49%",
      top: "65%",
      scale: 0.5,
      rotate: 30,
    },
    {
      reaction: Reaction.ANGRY,
      left: "45%",
      top: "70%",
      scale: 0.3,
      rotate: 5,
    },
  ];

  const fixedPositions = [
    {
      left: "22%",
      top: "5%",
      scale: 1.5,
    },
    {
      left: "63%",
      top: "10%",
      scale: 1.4,
    },
    {
      left: "32%",
      top: "20%",
      scale: 1.3,
    },
    { left: "68%", top: "25%", scale: 0.8 },
    {
      left: "24%",
      top: "35%",
      scale: 0.7,
    },
    {
      left: "55%",
      top: "40%",
      scale: 1.0,
    },
    {
      left: "38%",
      top: "50%",
      scale: 0.9,
    },
    {
      left: "50%",
      top: "55%",
      scale: 0.8,
    },
    {
      left: "49%",
      top: "65%",
      scale: 0.5,
    },
    {
      left: "45%",
      top: "70%",
      scale: 0.3,
    },
  ];

  return (
    <section
      className="flex flex-col"
      style={{
        opacity: animated ? 1 : 0,
      }}
    >
      <div className={`title ${animated ? "animate-slideUp" : ""} m-auto`}>
        Your best posts
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full p-2 gap-2">
        <div className="min-h-[300px]   flex items-center justify-center relative">
          <div className="bloom_right size-full absolute"></div>
          <div className="grow h-full flex flex-col gap-2 relative">
            <div className="light_bottom_right size-full absolute"></div>

            <div className="light_bottom size-[50%] absolute bottom-0 left-[50%] -translate-x-1/2"></div>
            <div
              className={`title ${
                animated ? "animate-slideRight" : ""
              } m-auto`}
            >
              {postCount || <NumberLoader/>}
            </div>

            <div className="relative grow h-full">
              {reactions.map((reaction, index) => (
                <div
                  key={index}
                  className={`absolute size-6 md:size-8 ${
                    animated ? "animate-slideUp" : ""
                  }`}
                  style={{
                    top: reaction.top,
                    left: reaction.left,
                    filter: `blur(${1.5 - reaction.scale}px)`,
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${reaction.scale}) rotate(${reaction.rotate}deg)`,
                    }}
                  >
                    <div className="size-10">
                      {renderReaction(reaction.reaction)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-[250px] w-[50%]">
            <PostCard isLoading={true} />
          </div>
        </div>
        <div className="min-h-[300px] relative  flex items-center justify-center">
          <div className="bloom_left size-full absolute"></div>
          <div className="max-w-[250px] w-[50%]">
            <PostCard isLoading={true} />
          </div>

          <div className="grow h-full relative flex flex-col gap-2">
            <div className="light_bottom_left size-full absolute"></div>
            <div className="light_bottom size-[50%] absolute bottom-0 left-[50%] -translate-x-1/2"></div>
            <div
              className={`title ${
                animated ? "animate-slideLeft" : ""
              } m-auto`}
            >
              {postCount || <NumberLoader/>}
            </div>
            <div className="relative grow w-full">
              {fixedPositions.map((pos, index) => (
                <div
                  key={index}
                  className={`absolute  ${animated ? "animate-slideUp" : ""}`}
                  style={{
                    left: pos.left,
                    top: pos.top,
                    zIndex: index,
                  }}
                >
                  <div
                    className={`absolute h-[15px] w-[40px] md:h-[30px] md:w-[80px] `}
                    style={{
                      transform: `scale(${pos.scale})`,
                      filter: `blur(${1.5 - pos.scale}px)`,
                    }}
                  >
                    <CommentProps />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
