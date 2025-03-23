import PostCard from "@components/UI/Post/PostCard";
import { getRandomColor } from "@lib/Post/post";
import { faHeart } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  a,
  animated,
} from "@node_modules/@react-spring/web/dist/react-spring_web.modern";
import React, { useEffect, useRef, useState } from "react";

export default function PostSection() {
  const [postCount, setPostCount] = useState(null);
  const [animated, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  const fixedTransforms = [
    { x: 15, y: -10, z: 5, scale: 0.9, left: "0%", zIndex: 1, blur: 0.5 }, // Rotation for the first card
    { x: -5, y: 20, z: -10, scale: 0.7, left: "25%", zIndex: 0, blur: 2 }, // Rotation for the second card
    { x: 10, y: 10, z: -6, scale: 1, left: "60%", zIndex: 1, blur: 0 }, // Rotation for the second card
  ];

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
  return (
    <section
      className="flex flex-col"
      ref={sectionRef}
      style={{
        opacity: animated ? 1 : 0,
      }}
    >
      <div className={`title ${animated ? "animate-slideRight" : ""} mr-auto`}>
        You've made {postCount || <span className="dots"></span>} posts
      </div>

      <div className="relative  min-w-[300px] w-full sm:w-[50%]  rounded-lg ">
        <div className="bloom_left size-full absolute"></div>
        <div className="w-full relative h-[300px]">
          {fixedTransforms.map((transform, index) => (
            <div
              key={index}
              className="grow absolute top-[10%] w-[40%] max-w-[150px] aspect-[1/2]"
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
                  className={` relative w-full h-full grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0 shadow-md  ${
                    animated ? "animate-slideUp" : ""
                  } ease-in-out`}
                >
                  <div className={` w-full  ${getRandomColor()}`}></div>
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
              </div>
              <div className="shadow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
