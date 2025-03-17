import { getTop3Reactions, renderReaction } from "@lib/Emoji/render";
import { Like } from "@lib/types";
import React, { useState } from "react";
import UserProfileIcon from "./UserProfileIcon";
import { useSession } from "@node_modules/next-auth/react";
import { Reaction } from "@enum/reactionEnum";

export default function LikedUserTab({likes}:{likes:Like[]} ) {
  const [reactionFilter, setReactionFilter] = useState<Reaction | null>(null);

  return (
    <div className="h-fit w-[300px] flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center">
        <div className="rounded-full w-fit flex flex-row p-1 pr-2 items-center bg-primary/50">
          {getTop3Reactions(likes).map((reaction, index) => (
            <div className={`size-5 -mr-1 `} style={{ zIndex: 3 - index }}>
              {renderReaction(reaction)}
            </div>
          ))}
        </div>
        <div>
          {reactionFilter
            ? likes.filter((likes) => likes.reaction === reactionFilter).length
            : likes.length}{" "}
          interactions
        </div>
      </div>

      <ul className="grid grid-cols-6 rounded-full bg-primary/50 w-full p-1">
        {Object.values(Reaction).map((reaction, index) => (
          <button
            key={index}
            onClick={() =>
              setReactionFilter((prev) => (prev === reaction ? null : reaction))
            }
            className={`flex flex-row items-center text-xs w-fit  font-bold rounded-full m-2 size-5 transition-all duration-100 ${
              reactionFilter === reaction ? "scale-150" : ""
            } `}
          >
            {renderReaction(reaction)}
          </button>
        ))}
      </ul>
      <ul className="flex flex-col gap-2 p-1 bg-primary/50 h-[400px] rounded-xl overflow-y-scroll no-scrollbar">
        {likes
          .filter(
            (like) =>
              like.reaction === reactionFilter || reactionFilter === null
          )
          .map((like, index) => (
            <label
              key={index}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-2"
            >
              <UserProfileIcon
                currentUser={false}
                user={like.user || { _id: "" }}
                size={"Icon_smaller"}
              />
              <h2 className="text-sm cursor-pointer text-accent  whitespace-nowrap overflow-x-hidden overflow-ellipsis">
                {like.user.username}
              </h2>
              <div className="size-4">{renderReaction(like.reaction)}</div>
            </label>
          ))}
      </ul>
    </div>
  );
}
