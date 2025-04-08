import { Comment } from "@lib/types";
import React, { useEffect, useState } from "react";
import UserProfileIcon from "../Profile/UserProfileIcon";

export default function CommentProps({
  comment = null,
}: {
  comment?: Comment | null;
}) {
  const [isLeft, setIsLeft] = useState<boolean | null>(null);

  useEffect(() => {
    setIsLeft(Math.random() > 0.5);
  }, []);

  if (comment)
    return (
      <div className="flex flex-row gap-1 items-start justify-center"> 
        <UserProfileIcon currentUser={false} user={comment.user} size="Icon_small" />
        <div className="rounded-xl bg-secondary-2 w-fit px-2 py-1 text-sm">
          <span
            className={`font-semibold break-all whitespace-normal  text-sm`}
          >
            {comment.user.username}
          </span>
          <div className="relative">
            <p
              className={`max-h-[100px] whitespace-pre-line overflow-ellipsis overflow-y-hidden break-words
            text-sm`}
            >
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    );

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
