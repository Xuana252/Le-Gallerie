"use client";
import React, { useState, useRef, useEffect } from "react";

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
  const themeList = useRef(null);
  const [theme, setTheme] = useState<string>("");
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("Theme");
    storedTheme ? setTheme(storedTheme) : setTheme("light");
    if (themeList.current) {
        const {scrollHeight, clientHeight } = themeList.current;
        setIsScrollable(scrollHeight > clientHeight);
    }
    
  }, []);

  useEffect(() => {
    if (theme) {
      document.body.className = theme;
      localStorage.setItem("Theme", theme);
    }
  }, [theme]);

  const handleScroll = () => {
    if (themeList.current) {
      const { scrollTop, scrollHeight, clientHeight } = themeList.current;
      setIsScrolledToTop(scrollTop === 0);
      setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight);
    }
  };

  return (
    <ul
      className={`flex gap-2 flex-wrap ${
        !isScrolledToTop && isScrollable
          ? 'before:left-0 before:top-0 before:rounded-t-xl before:bg-accent before:shadow-xl  before:h-[15px] before:content-[" "] before:w-full before:absolute before:box-border'
          : ""
      }  ${
        !isScrolledToBottom && isScrollable
          ? 'after:left-0 after:rounded-b-xl after:bottom-0 after:bg-accent after:h-[15px] after:content-[" "] after:w-full after:absolute after:box-border'
          : ""
      }  h-48 w-full rounded-lg overflow-y-scroll no-scrollbar`}
      ref={themeList}
      onScroll={handleScroll}
    >
      {themes.map((theme) => (
        <div
          key={theme}
          className="cursor-pointer w-full h-8 grid-cols-4 grid rounded-lg overflow-hidden "
          onClick={() => {
            setTheme(theme);
          }}
        >
          <div className={`w-full h-full ${theme} bg-primary`}></div>
          <div className={`w-full h-full ${theme} bg-secondary-1`}></div>
          <div className={`w-full h-full ${theme} bg-secondary-2`}></div>
          <div className={`w-full h-full ${theme} bg-accent`}></div>
        </div>
      ))}
    </ul>
  );
}
