import React, { useEffect, useState } from "react";

export default function CommentProps() {
  const [isLeft, setIsLeft] = useState<boolean | null>(null);

  useEffect(() => {
    setIsLeft(Math.random() > 0.5);
  }, []);
  return (
    <div className="h-[15px] w-[40px] md:h-[30px] md:w-[80px]">
      <div className="size-full relative shadow-none rounded-md bg-gradient-to-b from-secondary-1 to-secondary-2 flex flex-row items-center justify-center p-1 gap-1">
        <div className="h-full aspect-square rounded-full bg-accent/50"></div>
        <div className="grow h-2/3 bg-accent/50 rounded-sm"></div>
      </div>
      <div
        className="w-[15%] h-[20%] bg-secondary-2 ml-2"
        style={{
          marginLeft: isLeft ? "75%" : "10%",
          clipPath: isLeft
            ? "polygon(0 0, 100% 0, 100% 100%)" // Triangle pointing to the top-left
            : "polygon(0 0, 100% 0, 0 100%)", // Triangle pointing to the top-right
        }}
      ></div>
    </div>
  );
}
