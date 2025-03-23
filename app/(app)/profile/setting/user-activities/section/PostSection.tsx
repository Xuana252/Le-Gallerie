import { NumberLoader } from "@components/UI/Loader";
import PostCard from "@components/UI/Post/PostCard";
import PostProps from "@components/UI/Props/PostProps";
import { getRandomColor } from "@lib/Post/post";
import { faHeart } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  a,
  animated,
} from "@node_modules/@react-spring/web/dist/react-spring_web.modern";
import React, { useEffect, useRef, useState } from "react";

export default function PostSection({ isVisible }: { isVisible: boolean }) {
  const [postCount, setPostCount] = useState(null);
  const [animated, setAnimate] = useState(isVisible);

  useEffect (()=>{setAnimate(isVisible)},[isVisible])

  const fixedTransforms = [
    { x: 15, y: -10, z: 5, scale: 0.9, left: "0%", zIndex: 1, blur: 0.5 }, // Rotation for the first card
    { x: -5, y: 20, z: -10, scale: 0.7, left: "25%", zIndex: 0, blur: 2 }, // Rotation for the second card
    { x: 10, y: 10, z: -6, scale: 1, left: "60%", zIndex: 1, blur: 0 }, // Rotation for the second card
  ];

  return (
    <section
      className="flex flex-col"
      style={{
        opacity: animated ? 1 : 0,
      }}
    >
      <div className={`title ${animated ? "animate-slideRight" : ""} mr-auto`}>
        You've made {postCount || <NumberLoader/>} posts
      </div>

      <div className="relative  min-w-[300px] w-full sm:w-[50%]  rounded-lg ">
        <div className="bloom_left size-full absolute"></div>
        <div className="w-full relative h-[300px]">
          {fixedTransforms.map((transform, index) => (
            <div
              key={index}
              className="grow absolute top-[10%] w-[45%] max-w-[160px] aspect-[1/2]"
              style={{
                left: transform.left,
                zIndex: transform.zIndex,
                filter: `blur(${transform.blur}px)`,
                transform: `scale(${transform.scale})`,
              }}
            >
              <div
                className="size-full"
                style={{
                  transform: `rotateX(${transform.x}deg) rotateY(${transform.y}deg) rotateZ(${transform.z}deg)`,
                }}
              >
                <div
                  className={`size-full ${animated ? "animate-slideUp" : ""}`}
                >
                  <PostProps />
                </div>
              </div>
              <div className="shadow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
