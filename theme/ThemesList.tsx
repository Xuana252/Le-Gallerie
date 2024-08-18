"use client";
import React, { useState, useRef, useEffect } from "react";
import { changeTheme } from "@theme/ThemeManager";

const themes = [
  "theme1",
  "theme2",
  "theme3",
  "theme4",
  "theme5",
  "theme6",
  "theme7",
  "theme8",
  "theme9",
  "theme10",
];

export default function ThemeList() {
  const themeList = useRef<HTMLUListElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    if (themeList.current) {
      const { scrollHeight, clientHeight } = themeList.current;
      setIsScrollable(scrollHeight > clientHeight);
    }
  }, []);

  const handleScroll = () => {
    if (themeList.current) {
      const { scrollTop, scrollHeight, clientHeight } = themeList.current;
      setIsScrolledToTop(scrollTop === 0);
      setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight);
    }
  };

  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    themeList.current
    ? themeList.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    : "";
  };
  const handleScrollToBottom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    themeList.current
      ? themeList.current.scrollTo({
          top: themeList.current.scrollHeight,
          behavior: "smooth",
        })
      : "";
  };

  return (
    <div className="relative">
      {isScrollable && !isScrolledToTop && (
        <button
          className="Theme_list_scroll_border top-0"
          onClick={handleScrollToTop}
        >
          ▲
        </button>
      )}
      {isScrollable && !isScrolledToBottom && (
        <button
          className="Theme_list_scroll_border bottom-0"
          onClick={handleScrollToBottom}
        >
          ▼
        </button>
      )}
      <ul className={`Theme_list`} ref={themeList} onScroll={handleScroll}>
        {themes.map((theme) => (
          <div
            key={theme}
            className={`Theme_item ${theme}`}
            onClick={async () => {
              changeTheme(theme);
            }}
          >
            <div className={` bg-primary`}></div>
            <div className={` bg-secondary-1`}></div>
            <div className={` bg-secondary-2`}></div>
            <div className={` bg-accent`}></div>
          </div>
        ))}
      </ul>
    </div>
  );
}
