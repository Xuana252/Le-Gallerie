"use client";
import {
  fetchCommentRepliesSummarize,
  fetchPostCommentSummarize,
} from "@actions/commentAction";
import Typewriter from "@components/UI/Typewriter";
import { formatNumber } from "@lib/format";
import {
  faComment,
  faRobot,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

export default function CommentSummarize({
  targetId,
  type,
}: {
  targetId: string;
  type: "Comments" | "Replies";
}) {
  const [summarize, setSummarize] = useState("");
  const [count, setCount] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  const fetchSummarize = async (id: string) => {
    setIsFetching(true);
    try {
      const res =
        type === "Comments"
          ? await fetchPostCommentSummarize(id)
          : await fetchCommentRepliesSummarize(id);

      setSummarize(res.message);
      setCount(res.counts);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  };
  useEffect(() => {
    targetId && fetchSummarize(targetId);
  }, [targetId]);

  return (
    <div>
      <div className="flex flex-row items-center p-1 gap-1">
        <div className="Icon_smaller">
          <FontAwesomeIcon icon={faRobot} />
        </div>

        <span className="italic text-xs rounded-full bg-accent text-primary py-1 px-2 font-semibold">
          {type} Summarize
        </span>

        {!isFetching && (
          <span className="animate-slideRight font-mono text-sm">
            {formatNumber(count)} <FontAwesomeIcon icon={faComment} />
          </span>
        )}
      </div>
      <div
        className={`rounded-lg text-sm ${
          isFetching ? "animate-pulse" : ""
        } bg-secondary-2 p-2`}
      >
        {isFetching ? (
          "Calculating"
        ) : (
          <Typewriter text={summarize} speed={50} />
        )}
      </div>
    </div>
  );
}
