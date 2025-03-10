"use client";
import React, { useState, useRef, useEffect } from "react";
import { changeTheme } from "@theme/ThemeManager";

const themeCategories = [
  { name: "System", list: ["theme1", "theme2"] },
  { name: "Retro", list: ["theme3", "theme4", "theme5"] },
  { name: "Vintage", list: ["theme6","theme7","theme8","theme9"] },
  { name: "Space", list: ["theme10","theme11","theme12","theme13"] },
  { name: "Pastel", list: ["theme14", "theme15", "theme16"] },
];
export const themes = [
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
  "theme11",
  "theme12",
  "theme13",
  "theme14",
  "theme15",
  "theme16",
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



  return (
    <div className="relative">
      {/* {isScrollable && !isScrolledToTop && (
        <button
          className="Theme_list_scroll_border top-0 rounded-t-lg"
          onClick={handleScrollToTop}
        >
          ▲
        </button>
      )}
      {isScrollable && !isScrolledToBottom && (
        <button
          className="Theme_list_scroll_border bottom-0 rounded-b-lg"
          onClick={handleScrollToBottom}
        >
          ▼
        </button>
      )} */}
      <ul className={`Theme_list `} ref={themeList} onScroll={handleScroll}>
        {themeCategories.map((category,index) => (
          <div key={index} className="w-full">
            <div className="sticky top-0 bg-accent text-primary my-2 font-bold px-2 pb-1">{category.name}</div>
            <div className="flex flex-wrap gap-2">
              {
                category.list.map((theme) =>
                  <div
                key={theme}
                className={`Theme_item  ${theme}`}
                onClick={async () => {
                  changeTheme(theme);
                }}
              >
                <div className={` bg-primary`}></div>
                <div className={` bg-secondary-1`}></div>
                <div className={` bg-secondary-2`}></div>
                <div className={` bg-accent`}></div>
              </div>)
              }
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
