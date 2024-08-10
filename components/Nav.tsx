"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faUser,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import InputBox from "./InputBox";
import DropDownButton from "./DropDownButton";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";


export default function Nav() {
  
  const ListItem = <ul>
    <div>A</div>
    <div>B</div>
    <div>C</div>
    <div>C</div>
  </ul>

  const pathName = usePathname();
  return (
    <nav className="Nav_bar">
      <div className="justify-between pointer-events-auto h-full w-full gap-1 px-2 items-center flex">
          <div className="flex items-center">
            <Link href={"/"} className="flex gap-2 items-center px-2">
              <div className="font-AppLogo text-3xl">AppLogo</div>
              <div className="hidden lg:block font-AppName h-full">Le Gallerie</div>
            </Link>
            <Link href={'/create-post'} className="Button">Create Post</Link>
          </div>

        {pathName === "/" && <InputBox type="SearchBox" style={{flex:1}}/>}

        <div className="Buttons_container">
            <DropDownButton dropDownList={ListItem}>
              <FontAwesomeIcon icon={faCircleHalfStroke} size="xl" />
            </DropDownButton>
          
          <button className="Icon">
            <FontAwesomeIcon icon={faBell} size="xl" />
          </button>
          <button className="Icon">
            <FontAwesomeIcon icon={faCommentDots} size="xl" />
          </button>
          <Link href={"http://localhost:3000/api/auth/signin/credentials"}>
            <button className="Icon">
              <FontAwesomeIcon icon={faUser} size="xl" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

