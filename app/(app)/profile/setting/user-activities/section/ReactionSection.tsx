import { NumberLoader } from "@components/UI/Loader";
import { Reaction } from "@enum/reactionEnum";
import { renderReaction } from "@lib/Emoji/render";
import React, { useEffect, useRef, useState } from "react";

export default function ReactionSection({ isVisible,likesCount,commentLikesCount }: { isVisible: boolean, likesCount:number,commentLikesCount:number }) {
  const [count1, setCount1] = useState(likesCount);
  const [count2, setCount2] = useState(commentLikesCount);
  const [animated, setAnimate] = useState(isVisible);
  useEffect (()=>{setAnimate(isVisible)},[isVisible])


  useEffect(()=>{
    setCount1(likesCount)
    setCount2(commentLikesCount)
  },[likesCount,commentLikesCount])

  const reactionStyles = [
    {
      reaction: Reaction.LIKE,
      top: "10%",
      right: "10%",
      rotate: "rotate(12deg)",
      scale: 0.8,
    },
    {
      reaction: Reaction.LOVE,
      top: "20%",
      right: "23%",
      rotate: "rotate(-8deg)",
      scale: 1.0,
    },
    {
      reaction: Reaction.HAHA,
      top: "35%",
      right: "32%",
      rotate: "rotate(18deg)",
      scale: 1.3,
    },
    {
      reaction: Reaction.WOW,
      top: "50%",
      right: "25%",
      rotate: "rotate(-22deg)",
      scale: 1.7,
    },
    {
      reaction: Reaction.SAD,
      top: "65%",
      right: "43%",
      rotate: "rotate(15deg)",
      scale: 2.0,
    },
    {
      reaction: Reaction.ANGRY,
      top: "50%",
      right: "67%",
      rotate: "rotate(-10deg)",
      scale: 2.3,
    },
    {
      reaction: Reaction.LIKE,
      top: "5%",
      right: "80%",
      rotate: "rotate(10deg)",
      scale: 2.5,
    },
    {
      reaction: Reaction.HAHA,
      top: "30%",
      right: "15%",
      rotate: "rotate(-12deg)",
      scale: 2.4,
    },
    {
      reaction: Reaction.WOW,
      top: "45%",
      right: "55%",
      rotate: "rotate(5deg)",
      scale: 1.2,
    },
    {
      reaction: Reaction.LOVE,
      top: "60%",
      right: "30%",
      rotate: "rotate(-20deg)",
      scale: 1.8,
    },
    {
      reaction: Reaction.SAD,
      top: "75%",
      right: "20%",
      rotate: "rotate(10deg)",
      scale: 2.1,
    },
    {
      reaction: Reaction.ANGRY,
      top: "85%",
      right: "50%",
      rotate: "rotate(-18deg)",
      scale: 1.4,
    },
  ];


  return (
    <section className="flex flex-col"  style={{ opacity: animated ? 1 : 0 }}>
      <span className={`title animate-slideLeft ml-auto ${animated ? "animate-slideLeft" : ""}`}>
        You've reacted {" "}
        {count1 + count2 || (
          <NumberLoader/>
        )}{" "}
        times
      </span>

      <div className="relative w-full h-[200px]">
        <div className="bloom_right absolute size-full"></div>
        <ul className={`size-full relative ${animated ? "animate-slideUp" : ""}`}>
          {reactionStyles.map(
            ({ reaction, top, right, rotate, scale }, index) => (
              <div
                key={index}
                className={`absolute size-6 md:size-8 `}
                style={{
                  top,
                  right,
                  filter: `blur(${2.5 - scale}px)`,
                }}
              >
                <div style={{ transform: rotate + `scale(${scale})` }}>
                  {renderReaction(reaction)}
                </div>
                <div className="shadow "></div>
              </div>
            )
          )}
        </ul>
      </div>
    </section>
  );
}
