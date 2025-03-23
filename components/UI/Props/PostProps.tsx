"use client";
import { getRandomColor } from "@lib/Post/post";
import { faHeart } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";

export default function PostProps() {
  const [background, setBackground] = useState("");

  useEffect(() => {
    setBackground(getRandomColor());
  }, []);
  return (
    <div
      className={` relative w-full h-full grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0 shadow-md`}
    >
      <div className={` w-full  ${background}`}></div>
      <div className="flex flex-col justify-between absolute p-2 bottom-0 left-0 size-full">
        <div className="flex flex-row justify-between items-center w-full gap-1">
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
  );
}
