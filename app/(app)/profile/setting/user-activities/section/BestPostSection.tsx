import PostCard from "@components/UI/Post/PostCard";
import React, { useEffect, useRef, useState } from "react";

export default function BestPostSection() {
  const [postCount, setPostCount] = useState(null);
  const [animated, setAnimate] = useState(false);
  const sectionRef = useRef(null);

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
      <div className={`title ${animated ? "animate-slideUp" : ""} m-auto`}>
        Your best posts
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full p-2 gap-4">
        <div className="bg-secondary-2/30 backdrop-blur-sm border-2 border-accent/20 min-h-[300px] rounded-xl  flex items-center justify-center p-4 ">
          <div className="w-[250px]">
            <PostCard isLoading={true} />
          </div>

          <div className="relative grow ">
            <div className="bloom_up size-full absolute"></div>
            <span
              className={`title ${
                animated ? "animate-slideRight" : ""
              } m-auto`}
            >
              {postCount || <span className="dots"></span>}
            </span>
          </div>
        </div>
        <div className="bg-secondary-2/30 backdrop-blur-md border-2 border-accent/20 min-h-[300px] rounded-xl  flex items-center justify-center p-4 ">
          <div className="w-[250px]">
            <PostCard isLoading={true} />
          </div>

          <div className="relative grow ">
            <div className="bloom_up size-full absolute"></div>
            <span
              className={`title ${
                animated ? "animate-slideRight" : ""
              } m-auto`}
            >
              {postCount || <span className="dots"></span>}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
