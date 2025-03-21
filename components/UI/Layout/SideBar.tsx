"use client";
import { menuItems } from "@constant/settingRoutes";
import {
  faAngleLeft,
  faAngleRight,
  faChartBar,
  faChartSimple,
  faGear,
  faGripLines,
  faKey,
  faUser,
  faUserGear,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { pathToFileURL } from "url";

export default function SideBar({ children }: { children: ReactNode }) {
  const pathName = usePathname();
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isMinimize, setIsMinimize] = useState(false);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  // Handle touch end (detect swipe direction)
  const handleTouchEnd = () => {
    if (touchStartX < touchEndX - 50) {
      setIsMinimize(false); // Swipe Down → Minimize
    } else if(touchEndX<touchStartX-50) {
      setIsMinimize(true); // Swipe Down → Minimize
    }
  };

  const getIndex = (path: string) => {
    let index = -1;

    const items = menuItems.flatMap((section) => section.items);

    index = items.findIndex((items) => items.path === path);

    return index;
  };

  useEffect(() => {
    setSelectedMenuIndex(getIndex(pathName));
  }, [pathName]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    // Set initial window dimensions
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="flex flex-row text-accent"
      style={{
        height: `calc(100vh - 60px)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`Side_bar_menu transition-transform duration-200 absolute sm:static top-[60px] left-0 ${
          isMinimize ? "-translate-x-[100%] sm:translate-x-0" : "translate-x-0"
        }`}
        style={{
          maxHeight: `${windowHeight - 60}px`,
          height: `${windowHeight - 60}px`,
        }}
      >
        <div className="Side_bar_path_list">
          {menuItems.map((section, sectionIndex) => (
            <ul key={sectionIndex} className="Side_bar_section">
              <li className="text-primary text-sm">{section.section}</li>
              <hr className="border-none bg-primary h-[1px]" />
              {section.items.map((item, index) => (
                <Link
                  href={item.path}
                  key={index}
                  className={`${
                    selectedMenuIndex === getIndex(item.path)
                      ? "Side_bar_selected_item"
                      : "Side_bar_item"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  {item.name}
                </Link>
              ))}
            </ul>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-end w-full sm:hidden">
          <button
            className="w-full rounded-lg bg-secondary-1/50 text-accent hover:bg-secondary-1"
            onClick={() => setIsMinimize(true)}
          >
            <FontAwesomeIcon icon={faGripLines} />
          </button>
        </div>
      </div>

      <div
        className="grow overflow-y-scroll p-4"
        style={{
          maxHeight: `${windowHeight - 60}px`,
          height: `${windowHeight - 60}px`,
        }}
      >
        {children}
      </div>

      <button
        className={`${
          isMinimize ? "block" : "hidden"
        } hover:opacity-100 opacity-50 fixed bottom-[10px] left-[10px]  Button_variant_1`}
        onClick={() => setIsMinimize(false)}
      >
        <FontAwesomeIcon icon={faGripLines} />
      </button>
    </div>
  );
}
