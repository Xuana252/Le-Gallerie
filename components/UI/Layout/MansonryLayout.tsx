import { Post } from "@lib/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PostCard from "../Post/PostCard";
import PostProps from "../Props/PostProps";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { faBoxArchive } from "@node_modules/@fortawesome/free-solid-svg-icons";

export default function MasonryLayout({
  height,
  items,
  isLoading,
  holder,
}: {
  height: string;
  items: any[];
  isLoading: boolean;
  holder: (item: any) => React.ReactNode;
}) {
  const feedRef = useRef<HTMLUListElement>(null); // Ref to the feed container
  const [gridColStyle, setGridColStyle] = useState("grid-cols-2");
  const [colsNum, setColsNum] = useState(2);

  const handleResize = useCallback(() => {
    const width = feedRef.current?.offsetWidth || window.innerWidth;

    if (width > 1600) {
      setGridColStyle("grid-cols-7");
      setColsNum(7);
    } else if (width > 1280) {
      setGridColStyle("grid-cols-6");
      setColsNum(6);
    } else if (width > 900) {
      setGridColStyle("grid-cols-5");
      setColsNum(5);
    } else if (width > 720) {
      setGridColStyle("grid-cols-4");
      setColsNum(4);
    } else if (width > 600) {
      setGridColStyle("grid-cols-3");
      setColsNum(3);
    } else {
      setGridColStyle("grid-cols-2");
      setColsNum(2);
    }
  }, []);

  useEffect(() => {
    if (feedRef.current) handleResize();
  }, [feedRef.current]);

  useEffect(() => {
    handleResize();

    // Listen to window resize
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {isLoading || items?.length>0? (
        <ul
          ref={feedRef}
          className={`grid ${gridColStyle} gap-x-3 min-w-full max-h-screen p-2 justify-center overflow-auto`}
          style={{
            maxHeight: height,
          }}
        >
          {Array.from(Array(colsNum).keys()).map((columnIndex) => (
            <ul key={columnIndex} className="flex flex-col w-full h-fit gap-3 ">
              {isLoading
                ? Array.from({ length: 10 }).map((_, index) => {
                    if (index % colsNum === columnIndex) {
                      return (
                        <div key={index}>
                          <PostCard isLoading={true} />
                        </div>
                      );
                    }
                    return null;
                  })
                : items.map((item: any, index: number) => {
                    if (index % colsNum === columnIndex) {
                      return (
                        <div
                          key={index}
                          className={`transition-all duration-300 ease-out animate-slideUp`}
                        >
                          {holder(item)}
                        </div>
                      );
                    }
                    return null;
                  })}
            </ul>
          ))}
        </ul>
      ) : !isLoading ? (
        <div className="size-full flex flex-col items-center justify-center p-4">
          <FontAwesomeIcon icon={faBoxArchive} size="2xl" />
          <p>Empty:/</p>
        </div>
      ):null}
    </>
  );
}
