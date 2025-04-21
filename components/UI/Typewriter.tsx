import React, { useEffect, useState } from "react";
import { text } from "stream/consumers";

export default function Typewriter({
  text,
  speed = 100,
}: {
  text: string;
  speed: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const words = text.split(" "); // Split the text into words

  // Effect to type the text word by word
  useEffect(() => {
    if (isTyping) {
      if (index < words.length) {
        const timer = setInterval(() => {
          setDisplayText((prev) => prev + words[index] + " "); // Add the word with a space
          setIndex((prevIndex) => prevIndex + 1);
        }, speed);

        return () => clearInterval(timer); // Cleanup the interval
      } else {
        setIsTyping(false); // Once all words are typed, stop the typing
      }
    }
  }, [index, words, speed, isTyping]);

  useEffect(() => {
    setDisplayText("");
    setIndex(0);
    setIsTyping(true);
  }, [text, speed]);

  return (
    <span className={`${isTyping && "animate-pulse"}`}>{displayText}</span>
  );
}
