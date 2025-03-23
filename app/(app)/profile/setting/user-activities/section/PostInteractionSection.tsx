import PostCard from "@components/UI/Post/PostCard";
import { Reaction } from "@enum/reactionEnum";
import { renderReaction } from "@lib/Emoji/render";
import { getRandomColor } from "@lib/Post/post";
import {
  faComment,
  faHeart,
  faListDots,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function PostInteractionSection() {
  const [postCount, setPostCount] = useState(null);
  const [animated, setAnimate] = useState(false);
  const [displayNumber, setIsDisplayNumber] = useState("");
  const sectionRef = useRef(null);

  const background = useMemo(() => getRandomColor(), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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

  const placeholders = [
    { top: "80%", left: "60%", scale: 1.2 },
    { top: "20%", left: "60%", scale: 0.8 },
    { top: "40%", left: "26%", scale: 1 },
  ];

  return (
    <section
      className="flex flex-col"
      ref={sectionRef}
      style={{
        opacity: animated ? 1 : 0,
      }}
    >
      <div className={`title ${animated ? "animate-slideLeft" : ""} ml-auto`}>
        Your posts have received{" "}
        {postCount || (
          <span className="dots">
          </span>
        )}{" "}
        reactions
      </div>

      <div className="relative self-center pt-[100px] w-full m-auto max-w-[700px]">
        <div className="bloom_up  size-full absolute  "></div>
        {reactions.map((reaction, index) => (
          <div
            onMouseEnter={() => setIsDisplayNumber("r" + index)}
            onMouseLeave={() => setIsDisplayNumber("null")}
            key={index}
            className={`absolute flex flex-col items-center gap-1 size-10 ${
              animated
                ? parseFloat(reaction.left) <= 50
                  ? "animate-slideLeft"
                  : "animate-slideRight"
                : ""
            }`}
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
                displayNumber === "r" + index
                  ? "animate-slideUp text-accent/70 text-xs font-semibold rounded-md bg-primary p-1 w-fit"
                  : "hidden"
              }`}
            >
              Number
            </div>
          </div>
        ))}
        <div className="  max-w-[150px] min-w-[200px] m-auto z-50 aspect-[2/3]">
          <div
            className={` relative w-full h-full grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0 shadow-md  ${
              animated ? "animate-slideUp" : ""
            } ease-in-out`}
          >
            <div className={` w-full  ${background}`}></div>
            <div className="flex flex-col justify-between absolute p-2 bottom-0 left-0 size-full">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row gap-1 items-center bg-secondary-2/70 p-1 rounded-full text-sm">
                  <FontAwesomeIcon icon={faHeart} />
                  <div className="  w-16 rounded-lg bg-secondary-1 h-4"></div>
                </div>
                <div className="  w-16 rounded-lg bg-secondary-1 h-4"></div>
              </div>
              <div className="h-fit w-full flex flex-row gap-2 items-center justify-start">
                <div className="transition-transform duration-200 hover:scale-110">
                  <div className="Icon_small bg-secondary-1 "></div>
                </div>
                <div className=" w-16 rounded-lg bg-secondary-1 h-4"></div>
              </div>
            </div>
          </div>

          <div className="shadow"></div>
        </div>

        {placeholders.map((pos, index) => (
          <div
            onMouseEnter={() => setIsDisplayNumber("c" + index)}
            onMouseLeave={() => setIsDisplayNumber("null")}
            key={index}
            className={`absolute h-[40px] w-[100px] ${
              animated
                ? parseFloat(pos.left) <= 50
                  ? "animate-slideRight"
                  : "animate-slideLeft"
                : ""
            }`}
            style={{ top: pos.top, left: pos.left, scale: pos.scale }}
          >
            <div className="size-full relative shadow-none rounded-md bg-secondary-1/50 flex flex-row items-center justify-center p-1 gap-1">
              <div className="h-full aspect-square rounded-full bg-accent/50"></div>
              <div className="grow h-2/3 bg-accent rounded-md"></div>
            </div>
            <div
              className="w-[15%] h-[20%] bg-secondary-1/50 ml-2"
              style={{
                marginLeft: index == 2 ? "75%" : "10%",
                clipPath:
                  index === 2
                    ? "polygon(0 0, 100% 0, 100% 100%)" // Triangle pointing to the top-left
                    : "polygon(0 0, 100% 0, 0 100%)", // Triangle pointing to the top-right
              }}
            ></div>
            <div
              className={`${
                displayNumber === "c" + index
                  ? "animate-slideUp text-accent/70 text-xs font-semibold rounded-md bg-primary p-1 w-fit"
                  : "hidden"
              }`}
            >
              Number
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
