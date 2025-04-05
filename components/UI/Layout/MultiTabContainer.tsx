"use client";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "@node_modules/next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export default function MultiTabContainer({
  tabs = [],
}: {
  tabs: { head: any; body: any }[];
}) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const tabIndex = searchParams.get("tab");
  const tabsStateRef = useRef<Record<number, any>>(
    tabs.reduce((acc, _, i) => ({ ...acc, [i]: {} }), {})
  );

  const updateTabState = useCallback((index: number, newState: any) => {
    // Update the tab state in the ref

    tabsStateRef.current[index] = {
      ...tabsStateRef.current[index],
      ...newState,
    };
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(
    tabIndex ? parseInt(tabIndex) : 0
  );

  const viewRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    viewRefs.current = tabs.map((_, i) => viewRefs.current[i] || null);
  }, [tabs]);

  useEffect(() => {
    if (!tabIndex) return;
    const index = parseInt(tabIndex);
    setSelectedIndex(index >= tabs.length ? 0 : index);
    scrollToView(index);
  }, [tabIndex, tabs.length]);

  const handleSelectTab = (index: number) => {
    const scrollTop = viewRefs.current[selectedIndex]?.scrollTop;

    updateTabState(selectedIndex, {
      scrollTop: scrollTop || 0,
    });
    scrollToView(index);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", index.toString());

    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (viewRefs.current[selectedIndex]) {
      const scrollTop = tabsStateRef.current[selectedIndex]?.scrollTop || 0;

      setTimeout(() => {
        viewRefs.current[selectedIndex]?.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }, 500);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const handleScroll = () => {
        const scrollLeft = scrollContainerRef.current?.scrollLeft ?? 0;
        const tabWidth = scrollContainerRef.current?.clientWidth ?? 1;

        const currentIndex = Math.round(scrollLeft / tabWidth);
        const gap = Math.abs(scrollLeft -currentIndex - selectedIndex );

        if (gap > tabWidth * 0.3) {
          setSelectedIndex(currentIndex);
        }
      };

      const container = scrollContainerRef.current;
      container.addEventListener("scroll", handleScroll);

      // Clean up the event listener
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const scrollToView = (index: number) => {
    viewRefs.current[index]?.scrollIntoView({
      behavior: "auto",
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
            onClick={() => handleSelectTab(index)}
          >
            {tab.head}
          </button>
        ))}
      </div>

      <div
        ref={scrollContainerRef}
        className="shadow-inner grow overflow-x-scroll flex flex-row snap-x snap-mandatory no-scrollbar"
      >
        {tabs.map((tab: any, index) => (
          <div
            key={index}
            ref={(el) => {
              viewRefs.current[index] = el;
            }}
            className="snap-start min-w-full overflow-y-scroll no-scrollbar"
          >
            {index === selectedIndex ? (
              React.cloneElement(tab.body, {
                state: tabsStateRef.current[index],
                updatestate: (newState: any) => updateTabState(index, newState),
              })
            ) : (
              <div className="size-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
