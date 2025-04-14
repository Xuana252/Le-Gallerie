"use client";
import { fetchPostCommentSummarize } from "@actions/commentAction";
import { fetchPostLikeSummarize } from "@actions/likesAction";
import { Reaction } from "@enum/reactionEnum";
import { renderReaction } from "@lib/Emoji/render";
import { formatNumber } from "@lib/format";
import {
  faComment,
  faRobot,
  faSmile,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function LikeSummarize({ postId }: { postId: string }) {
  const [summarize, setSummarize] = useState<Record<Reaction, number>>();
  const [count, setCount] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  const fetchSummarize = async (id: string) => {
    setIsFetching(true);
    try {
      const res = await fetchPostLikeSummarize(id);

      const totalCount = Object.values(res as Record<Reaction, number>).reduce(
        (acc, val) => acc + val,
        0
      );

      setSummarize(res);
      setCount(totalCount);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    postId && fetchSummarize(postId);
  }, [postId]);

  return (
    <div>
      <div className="flex flex-row items-center p-1 gap-1">
        <div className="Icon_smaller">
          <FontAwesomeIcon icon={faSmile} />
        </div>

        <span className="italic text-xs rounded-full bg-accent text-primary py-1 px-2 font-semibold">
          Reaction Summarize
        </span>

        {!isFetching && (
          <span className="animate-slideRight text-sm font-mono">
            {formatNumber(count)} <FontAwesomeIcon icon={faSmile} />
          </span>
        )}
      </div>
      <div
        className={`rounded-lg text-sm ${
          isFetching ? "animate-pulse bg-secondary-2" : ""
        }  p-2`}
      >
        {isFetching ? (
          "Calculating"
        ) : (
          <div className="flex flex-wrap gap-2 gap-x-4 items-center justify-center">
            {Object.entries(summarize as Record<Reaction, number>).map(
              ([reaction, count]) => (
                <div
                  key={reaction}
                  className="flex flex-col gap-2 items-center "
                >
                  <div className="size-6">
                    {renderReaction(reaction as Reaction)}
                  </div>
                  <span className="text-xs font-mono">
                    {formatNumber(count)}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
