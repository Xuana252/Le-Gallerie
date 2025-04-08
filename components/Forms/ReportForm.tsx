import SubmitButton from "@components/Input/SubmitButton";
import TextAreaInput from "@components/Input/TextAreaInput";
import CommentProps from "@components/UI/Props/ComentProps";
import PostProps from "@components/UI/Props/PostProps";
import { Comment, Post } from "@lib/types";
import React, { useState } from "react";

export default function ReportForm({
  type,
  content,
}: {
  type: "Post" | "Comment";
  content: Post | Comment;
}) {
  const reportReasons = [
    "Spam",
    "Harassment or bullying",
    "Inappropriate or offensive content",
    "False information",
    "Intellectual property violation",
  ];
  const [prompt, setPrompt] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-[700px] overflow-auto py-2">
      <div className="flex flex-col">
        <span className="text-lg font-bold">Report {type}</span>
        <div className="flex items-center justify-center overflow-auto max-h-[300px] md:max-h-none grow">
          <div className=" w-[200px]  ">
            {type === "Post" ? (
              <PostProps post={content as Post} />
            ) : type === "Comment" ? (
              <CommentProps comment={content as Comment} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col  gap-2 bg-secondary-2/40  p-2 rounded-lg">
        <div className="flex flex-row gap-2 items-center ">
          <div className="font-bold  ">Prompt </div>
          {prompt.length > 0 && (
            <span className=" aspect-square w-4 text-center text-xs rounded-full  font-semibold bg-accent text-primary">
              {prompt.length}
            </span>
          )}
        </div>

        <ul className="flex flex-wrap gap-2 bg-primary/70 p-1 rounded-lg">
          {reportReasons.map((reason, index) => (
            <li
              key={index}
              className={`px-2 py-1  bg-muted text-sm rounded-full cursor-pointer   font-semibold border-2 border-accent transition-colors ${
                prompt.includes(reason)
                  ? "text-primary bg-accent"
                  : "text-accent"
              }`}
              onClick={() =>
                setPrompt((prev) =>
                  prev.includes(reason)
                    ? prev.filter((r) => r !== reason)
                    : [...prev, reason]
                )
              }
            >
              {reason}
            </li>
          ))}
        </ul>
        <div className="font-bold">Details</div>
        <TextAreaInput
          value={details}
          onTextChange={(t: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDetails(t.target.value)
          }
          height="full"
          placeholder="details..."
        />
        <SubmitButton variant="Button_variant_2_5">Send Report</SubmitButton>
      </div>
    </div>
  );
}
