import React, { useState } from "react";
import Feed from "../Layout/Feed";
import { faBorderAll } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { faHeart } from "@node_modules/@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

export default function UserPostFeed({ userId }: { userId: string }) {
  const [view, setView] = useState<"AllPosts" | "LikedPosts">("AllPosts");
  return (
    <div className="w-full flex flex-col px-2">
      <div className="w-fit m-auto flex flex-row justify-center items-center h-fit relative">
        <div className={`w-[50%] absolute bottom-0 h-1 bg-accent left-0 transition-all duration-150 ease-in-out ${view==="LikedPosts"?"left-[50%]":"left-0"}`}></div>
        <button
          className={`${
            view === "AllPosts" ? "text-accent" : "text-secondary-2"
          } text-3xl  hover:text-accent size-12`}
          onClick={() => setView("AllPosts")}
        >
          <FontAwesomeIcon icon={faBorderAll} />
        </button>
        <button
          className={`${
            view === "LikedPosts" ? "text-accent" : "text-secondary-2"
          } text-3xl  hover:text-accent size-12`}
          onClick={() => setView("LikedPosts")}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>
      <div className="shadow-inner bg-secondary-2/20 rounded-xl">
        {userId && (
          <>
            <div className={`${view === "LikedPosts" ? "" : "hidden"}`}>
              <Feed
                userIdLikedFilter={true}
                userIdFilter={userId}
                showCateBar={false}
              ></Feed>
            </div>
            <div className={`${view === "AllPosts" ? "" : "hidden"}`}>
              <Feed
                userIdLikedFilter={false}
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
