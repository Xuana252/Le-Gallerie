import PostProps from "@components/UI/Props/PostProps";
import { Category, Post } from "@lib/types";
import { faImage } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function FavoriteTopicsSection({
  isVisible,
  posts,
}: {
  isVisible: boolean;
  posts: Post[]|null;
}) {
  const [animated, setAnimate] = useState(isVisible);
  const [displayNumber, setIsDisplayNumber] = useState("");
  const [categories, setTop3Category] = useState<Array<[string, number]>>([]);

  useEffect(() => setAnimate(isVisible), [isVisible]);

  useEffect(() => {
    if(!posts) return
    const getTop3 = async () => {
      const categoryCounts = posts.reduce((acc, post) => {
        post.categories.forEach((category: Category) => {
          acc[category.name] = (acc[category.name] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const top3Categories = Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

      setTop3Category(top3Categories);
    };

    getTop3();
  }, [posts]);

  const placeholders = [
    { top: "80%", left: "70%", scale: 1 },
    { top: "20%", left: "60%", scale: 0.8},
    { top: "50%", left: "-10%", scale: 0.9 },
  ];

  const props = [
    { top: "67%", left: "70%", scale: 0.89 },
    { top: "70%", left: "15%", scale: 0.76 },
    { top: "24%", left: "70%", scale: 0.7 },
    { top: "55%", left: "2%", scale: 0.65 },
    { top: "55%", left: "85%", scale: 0.8 },
    { top: "40%", left: "8%", scale: 0.9 },
    { top: "40%", left: "90%", scale: 0.7 },
    { top: "25%", left: "12%", scale: 0.89 },
  ];

  return (
    <section
      className="flex flex-col"
      style={{
        opacity: animated ? 1 : 0,
      }}
    >
      <div className={`title ${animated ? "animate-slideUp" : ""} mx-auto`}>
        Things you like to post about
      </div>

      <div className="relative self-center mt-[100px] w-full m-auto max-w-[700px] max-h-[500px]">
        <div className="light_bottom  size-full absolute  "></div>
        <div className="bloom_up  size-full absolute  "></div>
        <div
          className={`absolute size-full ${animated ? "animate-slideUp" : ""}`}
        >
          {props.map((pos, index) => (
            <div
              onMouseEnter={() => setIsDisplayNumber("c" + index)}
              onMouseLeave={() => setIsDisplayNumber("")}
              key={index}
              className={`absolute  flex flex-col items-center gap-1 `}
              style={{
                top: pos.top,
                left: pos.left,
                scale: pos.scale,
                filter: `blur(${3 - pos.scale}px)`,
              }}
            >
              <div className="rounded-lg px-2 py-1 italic bg-secondary-2">
                #Hashtag
              </div>
            </div>
          ))}
        </div>
        <div className="  w-[200px] m-auto z-50 aspect-[2/3]">
          <div className={`size-full `}>
            <PostProps />
          </div>

          <div className="shadow"></div>
          <div
            className={`absolute top-0 w-[200px] mx-auto h-full ${
              animated ? "animate-slideUp" : ""
            }`}
          >
            {placeholders.map((pos, index) => (
              <div
                onMouseEnter={() => setIsDisplayNumber("c" + index)}
                onMouseLeave={() => setIsDisplayNumber("")}
                key={index}
                className={`absolute  flex flex-col items-center gap-1 `}
                style={{ top: pos.top, left: pos.left, scale: pos.scale }}
              >
                {categories[index] ? (
                  <div className="flex flex-col items-center">
                    <div className="rounded-lg px-2 py-1 italic bg-secondary-2 ">
                      #{categories[index][0]} { displayNumber === "c" + index&& <div>{categories[index][1]} <FontAwesomeIcon icon={faImage}/></div> }
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg px-2 py-1 italic bg-secondary-2">
                    #Hashtag
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
