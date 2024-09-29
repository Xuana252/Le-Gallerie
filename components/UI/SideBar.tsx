'use client'
import {
  faAngleLeft,
  faAngleRight,
  faGear,
  faKey,
  faUser,
  faUserGear,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

export default function SideBar({ children }: { children: ReactNode }) {
  const pathName = usePathname();
  const menuItems = [
    { path: "/profile/setting/info", name: "Account Info", icon: faUser },
    {
      path: "/profile/setting/edit-profile",
      name: "Edit Profile",
      icon: faUserGear,
    },
    {
      path: "/profile/setting/block-list",
      name: "Block List",
      icon: faUserLock,
    },
    {
      path: "/profile/setting/change-password",
      name: " Change Password",
      icon: faKey,
    },
  ];
  const [windowSize, setSize] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isMinimize, setIsMinimize] = useState(true);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);

  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set initial height when component mounts
      setWindowHeight(window.innerHeight);

      // Update height on window resize
      const handleResize = () => {
        setWindowHeight(window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup event listener on component unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    setSize(window.innerWidth);
  }, []);

  useEffect(() => {
    const foundIndex = menuItems.findIndex((item) =>
      pathName.includes(item.path)
    );

    setSelectedMenuIndex(foundIndex !== -1 ? foundIndex : -1);
  }, [pathName]);

  return (
    <div
      className={`flex flex-col sm:flex-row h-full`}
      style={{
        minHeight: `${windowHeight  - 60}px`,
        height: `${windowHeight  - 60}px`,
      }}
    >
      <div className="relative">
        <div
          className={`flex h-full justify-start ${
            windowSize < 640
              ? "flex-row w-full items-center overflow-x-scroll no-scrollbar"
              : isMinimize
              ? "w-fit flex-col"
              : "flex-col w-[200px]"
          } bg-secondary-2 gap-3 py-2 sm:py-4 px-2`}
        >
          {menuItems.map((menu, index) => (
            <Link href={menu.path} key={index}>
              <button
                className={`${
                  selectedMenuIndex === index
                    ? "Side_bar_selected_item"
                    : "Side_bar_item"
                }`}
              >
                <FontAwesomeIcon icon={menu.icon} />
                {isMinimize ? "" : menu.name}
              </button>
            </Link>
          ))}
        </div>

        <button
          className={`text-accent text-xl ml-auto sm:h-fit h-full bg-secondary-2 sm:mt-auto absolute sm:bottom-0 top-0 right-0 flex items-center px-2 py-2`}
          onClick={() => setIsMinimize((prev) => !prev)}
        >
          <FontAwesomeIcon icon={isMinimize ? faAngleRight : faAngleLeft} />
        </button>
      </div>
      <div
        className="w-full overflow-y-scroll p-4"
        style={{
          maxHeight: `${windowHeight  - 60}px`,
          height: `${windowHeight  - 60}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
