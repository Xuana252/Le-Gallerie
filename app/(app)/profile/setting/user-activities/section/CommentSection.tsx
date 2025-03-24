
import { NumberLoader } from "@components/UI/Loader";
import CommentProps from "@components/UI/Props/ComentProps";
import { useSession } from "@node_modules/next-auth/react";
import React, { useEffect, useRef, useState } from "react";

export default function CommentSection({
  isVisible,
  commentCount,
}: {
  isVisible: boolean;
  commentCount: number;
}) {
  const { data: session } = useSession();
  const [count, setCount] = useState(commentCount);
  const [animated, setAnimate] = useState(isVisible);

  useEffect(() => {
    setAnimate(isVisible);
  }, [isVisible]);

  useEffect(() => {
    setCount(commentCount);
  }, [commentCount]);

  const fixedPositions = [
    { left: "5%", top: "10%", scale: 0.8 },
    { left: "20%", top: "40%", scale: 1 },
    { left: "2%", top: "30%", scale: 1.1 },
    { left: "15%", top: "25%", scale: 1.03 },
    { left: "30%", top: "40%", scale: 1.8 },
    { left: "50%", top: "55%", scale: 1.3 },
    { left: "65%", top: "35%", scale: 1.4 },
    { left: "80%", top: "15%", scale: 2 },
  ];

  return (
    <section className="flex flex-col" style={{ opacity: animated ? 1 : 0 }}>
      <span className={`title ${animated ? "animate-slideRight" : ""} mr-auto`}>
        You've made {count || <NumberLoader />} comments
      </span>

      <div className="relative min-w-[300px]  h-[200px]">
        <div className="bloom_left size-full absolute"></div>
        <div
          className={`w-full flex flex-row gap-2 p-4 mb-4 h-[300px] relative ${
            animated ? "animate-slideUp" : ""
          }`}
        >
          {fixedPositions.map((pos, index) => (
            <div
              key={index}
              className={`absolute  `}
              style={{
                left: pos.left,
                top: pos.top,
                zIndex: index,
              }}
            >
              <div
                className={`absolute `}
                style={{
                  transform: `scale(${pos.scale})`,
                  filter: `blur(${2 - pos.scale}px)`, // Dynamic blur calculation
                }}
              >
                <CommentProps />
                <div className="shadow "></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
