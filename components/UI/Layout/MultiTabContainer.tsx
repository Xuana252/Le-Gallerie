"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function MultiTabContainer({
  tabs = [],
}: {
  tabs: { head: any; body: any }[];
}) {
  const [gridCols, setGridCols] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const viewRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    viewRefs.current = tabs.map((_, i) => viewRefs.current[i] || null);
  }, [tabs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tabIndex = viewRefs.current.findIndex(
              (tab) => tab === entry.target
            );
            if (tabIndex !== -1) {
              setSelectedIndex(tabIndex);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    viewRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      viewRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const scrollToView = (index: number) => {
    viewRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <div
      className="w-full flex flex-col  h-full  "
      style={{ height: `calc(100vh - 60px)` }}
    >
      <div
        className={`w-full grid  ${`grid-cols-${tabs.length}`} justify-center items-center h-fit relative  p-2 shadow-md`}
      >
        <div
          className={` absolute bottom-0 h-1 bg-accent left-0 transition-all duration-300 ease-in-out rounded-full`}
          style={{
            transform: `translateX(${selectedIndex * 100}%)`,
            width: `${100 / tabs.length}%`,
          }}
        ></div>
        {tabs.map((tab: any, index) => (
          <button
            key={index}
            className={`
                 hover:text-accent flex flex-row gap-2 items-center justify-center`}
            onClick={() => scrollToView(index)}
          >
            {tab.head}
          </button>
        ))}
      </div>

      <div className="shadow-inner grow overflow-x-scroll flex flex-row snap-x snap-mandatory no-scrollbar">
        {tabs.map((tab: any, index) => (
          <div
          key={index}
            ref={(el) => {
              viewRefs.current[index] = el;
            }}
            className={` snap-start min-w-full overflow-y-scroll no-scrollbar`}
          >
            {tab.body}
          </div>
        ))}
      </div>
    </div>
  );
}
