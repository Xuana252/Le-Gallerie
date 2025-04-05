"use client";
import React, { useEffect, useState } from "react";

export default function HoverButton({
  buttonSet = [],
}: {
  buttonSet: { name: string; func: any }[];
}) {

  const [hoverIndex, setHoverIndex] = useState(0);


  return (
    <div
      className={`grid ${`grid-cols-${buttonSet.length}`} gap-2 items-center w-fit content-center rounded-full bg-primary relative overflow-hidden p-1 border-4 border-primary`}
    >
      <div
        className={`h-full bg-accent  absolute z-0 rounded-full transition-all duration-500 ease-in-out`}
        style={{
          transform: `translateX(${hoverIndex * 100}%)`,
          width: `${100 / buttonSet.length}%`,
        }}
      ></div>
      {buttonSet.map((b, index) => (
        <button
          key={index}
          onMouseOver={() => setHoverIndex(index)}
          className={`${
            hoverIndex === index ? "text-primary font-bold" : "text-accent"
          } z-10 transition-all duration-200 ease-in-out active:scale-95`}
          onClick={(e) => {
            e.preventDefault();
            b.func();
          }}
        >
          {b.name}
        </button>
      ))}
    </div>
  );
}
