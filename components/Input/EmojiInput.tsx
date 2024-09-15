import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker from "emoji-picker-react";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export default function EmojiInput({
  setEmoji,
  size = "small",
  direction = "top",
}: {
  setEmoji: Dispatch<SetStateAction<string>>;
  size?: "small" | "smaller";
  direction?: "top" | "bottom";
}) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const handleOpenEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };

  const handleEmojiSelect = (emojiData: any, event: MouseEvent) => {
    setEmoji((t) => t + emojiData.emoji);
  };

  const dir = useMemo(() => {
    switch (direction) {
      case "top":
        return "bottom-full right-0";
      case "bottom":
        return "top-full right-0";
      default:
        return "bottom-full right-0";
    }
  }, [direction]);
  return (
    <>
      <div className="relative z-30">
        <div className={`absolute ${dir}`}>
          <EmojiPicker
            lazyLoadEmojis={true}
            width={size === "small" ? "350px" : "250px"}
            height={size === "small" ? "350px" : "300px"}
            onEmojiClick={handleEmojiSelect}
            open={isEmojiPickerOpen}
          />
        </div>
        <button className={`Icon_${size}`} onClick={handleOpenEmojiPicker}>
          <FontAwesomeIcon icon={faFaceSmile} />
        </button>
      </div>
    </>
  );
}
