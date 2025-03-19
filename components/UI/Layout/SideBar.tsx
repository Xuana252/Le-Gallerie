"use client";
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
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isMinimize, setIsMinimize] = useState(true);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);

  useEffect(() => {
    const foundIndex = menuItems.findIndex((item) =>
      pathName.includes(item.path)
    );

    setSelectedMenuIndex(foundIndex !== -1 ? foundIndex : -1);
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
      className="flex flex-col sm:flex-row h-screen"
      style={{
        height: `calc(100vh - 60px)`,
      }}
    >
      <div className="relative">
        <div
          onMouseEnter={() => setIsMinimize(false)}
          onMouseLeave={() => setIsMinimize(true)}
          className={`Side_bar_menu transition-transform duration-200 ${
            isMinimize ? "w-fit" : "sm:max-x-[200px]"
          }`}
        >
          {menuItems.map((menu, index) => (
            <Link href={menu.path} key={index} className={`${
              selectedMenuIndex === index
                ? "Side_bar_selected_item"
                : "Side_bar_item"
            }`}>
                <FontAwesomeIcon icon={menu.icon} />
                {isMinimize ? "" : menu.name}
            </Link>
          ))}
        </div>
      </div>
      <div
        className="w-full overflow-y-scroll p-4"
        style={{
          maxHeight: `${windowHeight - 60}px`,
          height: `${windowHeight - 60}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
