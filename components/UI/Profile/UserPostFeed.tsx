import React, { useEffect, useRef, useState } from "react";
import Feed from "../Layout/Feed";
import { faBorderAll } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { faHeart } from "@node_modules/@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

export default function UserPostFeed({ userId }: { userId: string }) {
  const [view, setView] = useState<"AllPosts" | "LikedPosts">("AllPosts");
  const viewRefs = useRef<Record<string, HTMLDivElement | null>>({
    AllPosts: null,
    LikedPosts: null,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === viewRefs.current.AllPosts) {
              setView("AllPosts");
            } else if (entry.target === viewRefs.current.LikedPosts) {
              setView("LikedPosts");
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Attach observer
    if (viewRefs.current.AllPosts) observer.observe(viewRefs.current.AllPosts);
    if (viewRefs.current.LikedPosts)
      observer.observe(viewRefs.current.LikedPosts);

    return () => {
      // Cleanup observer
      if (viewRefs.current.AllPosts)
        observer.unobserve(viewRefs.current.AllPosts);
      if (viewRefs.current.LikedPosts)
        observer.unobserve(viewRefs.current.LikedPosts);
    };
  }, []);

  const scrollToView = (tab: "AllPosts" | "LikedPosts") => {
    viewRefs.current[tab]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full h-full flex flex-col px-2">
      <div className="w-full m-auto grid grid-cols-2 justify-center items-center h-fit relative">
        <div
          className={`w-[50%] absolute bottom-0 h-1 bg-accent left-0 transition-all duration-150 ease-in-out ${
            view === "LikedPosts" ? "left-[50%]" : "left-0"
          }`}
        ></div>
        <button
          className={`${
            view === "AllPosts" ? "text-accent" : "text-secondary-2"
          }   hover:text-accent h-12 flex flex-row gap-2 items-center justify-center`}
          onClick={() => scrollToView("AllPosts")}
        >
          <FontAwesomeIcon icon={faBorderAll} />
          All
        </button>
        <button
          className={`${
            view === "LikedPosts" ? "text-accent" : "text-secondary-2"
          }   hover:text-accent h-12 flex flex-row gap-2 items-center justify-center`}
          onClick={() => scrollToView("LikedPosts")}
        >
          <FontAwesomeIcon icon={faHeart} />
          Liked
        </button>
      </div>
      <div className="shadow-inner grow overflow-x-scroll flex flex-row snap-x snap-mandatory no-scrollbar bg-secondary-2/20 rounded-xl">
        {userId && (
          <>
            <div
              ref={(el) => {
                viewRefs.current.AllPosts = el;
              }}
              className={` snap-start min-w-full overflow-scroll no-scrollbar`}
            >
              <Feed
                userIdLikedFilter={false}
                userIdFilter={userId}
                showCateBar={false}
              ></Feed>
            </div>
            <div
              ref={(el) => {
                viewRefs.current.LikedPosts = el;
              }}
              className={` snap-start min-w-full overflow-scroll no-scrollbar`}
            >
              <Feed
                userIdLikedFilter={true}
                userIdFilter={userId}
                showCateBar={false}
              ></Feed>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
