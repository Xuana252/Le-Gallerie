"use client";
import { Tooltip } from "@nextui-org/tooltip";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faUser,
  faCircleHalfStroke,
  faMagnifyingGlass,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

const Nav = () => {
  const pathName = usePathname();
  return (
    <nav className="Nav_bar">
      <div className="justify-between pointer-events-auto h-full w-full gap-1 px-2 items-center flex">
        <Tooltip content="App logo" delay={0} closeDelay={0} placement="bottom">
          <Link href={"/"} className="flex gap-2 items-center px-2">
            <div className="font-AppLogo text-3xl">AppLogo</div>
            <div className="hidden lg:block font-AppName h-full">Le Gallerie</div>
          </Link>
        </Tooltip>

        {pathName === "/" ? (
          <div className="Input_box">
            <button className="size-8">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size="sm"
                className=""
              />
            </button>
            <input
              type="text"
              className="bg-transparent outline-none w-full px-2"
              placeholder="Add some text"
            />
            <button className="size-8">
              {" "}
              <FontAwesomeIcon icon={faX} size="sm" />
            </button>
          </div>
        ) : null}

        <div className="Buttons_container">
          <button className="Icon">
            <FontAwesomeIcon icon={faCircleHalfStroke} size="xl" />
          </button>
          <button className="Icon">
            <FontAwesomeIcon icon={faBell} size="xl" />
          </button>
          <button className="Icon">
            <FontAwesomeIcon icon={faCommentDots} size="xl" />
          </button>
          <Link href={"/profile"}>
            <button className="Icon">
              <FontAwesomeIcon icon={faUser} size="xl" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
