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
import { Ultra } from "@node_modules/next/font/google";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export const SubPathContext = createContext<{
  subPath: {path:string,scroll:boolean};
  setSubPath: (subPath: {path:string,scroll:boolean}) => void;
}>({
  subPath: {path:"",scroll:false},
  setSubPath: () => {},
});

export default function SideBar({ children }: { children: ReactNode }) {
  const pathName = usePathname();
  const [subPath, setSubPath] = useState<{path:string,scroll:boolean}>({path:"",scroll:false});
  const [windowHeight, setWindowHeight] = useState(0);
  const [isMinimize, setIsMinimize] = useState(false);

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
    } else if (touchEndX < touchStartX - 50) {
      setIsMinimize(true); // Swipe Down → Minimize
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMinimize(window.innerWidth < 720);
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
    <SubPathContext.Provider value={{ subPath, setSubPath }}>
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
          className={`Side_bar_menu transition-transform duration-200 absolute sm:static top-[60px] left-0 h-full ${
            isMinimize
              ? "-translate-x-[100%] sm:translate-x-0"
              : "translate-x-0"
          }`}
          style={{
            maxHeight: `${windowHeight - 60}px`,
            height: `${windowHeight - 60}px`,
          }}
        >
          <div className="Side_bar_path_list">
            {menuItems.map((section, sectionIndex) => (
              <ul
                key={sectionIndex}
                className="Side_bar_section transition-all duration-200 ease-in-out"
              >
                <li className="text-primary text-sm">{section.section}</li>
                <hr className="border-none bg-primary h-[1px]" />
                {section.items.map((item, index) => (
                  <div className="w-full" key={index}>
                    <Link
                      href={item.path}
                      className={`${
                        item.path === pathName
                          ? "Side_bar_selected_item"
                          : "Side_bar_item"
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      {item.name}
                    </Link>
                    {item.subPath.length > 0 && (
                      <ul
                        className={`flex flex-col overflow-hidden transition-all duration-200 origin-top ${
                          pathName === item.path
                            ? "scale-y-100 ease-in-out"
                            : "scale-y-0 h-0"
                        }`}
                      >
                        {item.subPath.map((sub, subIndex) => (
                          <div
                            onClick={() => setSubPath({path:sub,scroll:true})}
                            key={subIndex}
                            className={`${
                              item.path === pathName && sub === subPath.path
                                ? "Side_bar_selected_sub_item "
                                : "Side_bar_sub_item "
                            } `}
                          >
                            {sub}
                          </div>
                        ))}
                      </ul>
                    )}
                  </div>
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
          className="grow overflow-y-scroll p-4 overflow-x-hidden z-30 relative bg-gradient-to-b from-secondary-1/30  to-secondary-2 "
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
          } hover:opacity-100 opacity-50 z-40 fixed bottom-[10px] left-[10px]  Button_variant_1`}
          onClick={() => setIsMinimize(false)}
        >
          <FontAwesomeIcon icon={faGripLines} />
        </button>
      </div>
    </SubPathContext.Provider>
  );
}
