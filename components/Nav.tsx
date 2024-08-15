"use client";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faUser,
  faCircleHalfStroke,
  faRightFromBracket,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import InputBox from "./InputBox";
import Image from "next/image";
import DropDownButton from "./DropDownButton";
import { signOut, useSession, getProviders } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import UserProfileIcon from './UserProfileIcon';
import { createContext } from 'react';
import ThemeList from './ThemesList';

export const SearchContext = createContext('')
export default function Nav({children}:{children:React.ReactNode}) {
  const { data: session } = useSession();
  const router = useRouter()
  const [pendingText,setPendingText] = useState('')
  const [searchText, setSearchText] = useState('')


  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingText(e.target.value)
  }
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      const finalText = pendingText.trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
      localStorage.setItem('searchText',finalText)
      setSearchText(finalText)
      router.push('/')
    }
  }

  const pathName = usePathname();
  return (
    <>
    <nav className="Nav_bar">
      <div className="justify-between pointer-events-auto h-full w-full gap-1 px-2 items-center flex">
        <div className="flex items-center">
          <Link href={"/"} className="flex gap-2 items-center px-2">
            <div className="font-AppLogo text-3xl">AppLogo</div>
            <div className="hidden lg:block font-AppName h-full">
              Le Gallerie
            </div>
          </Link>
        </div>

        {pathName === "/" && <InputBox onTextChange={handleSearchTextChange} onKeyDown={handleSearchKeyPress} value={pendingText} type="SearchBox">Search for titles...</InputBox>}

        <div className="Buttons_container">
          {session?.user && (
            <Link href={"/post/create"}>
              <button className="Icon">
                <FontAwesomeIcon icon={faImage}/>
              </button>
            </Link>)}


          <DropDownButton dropDownList={<ThemeList/>}>
            <FontAwesomeIcon icon={faCircleHalfStroke} />
          </DropDownButton>

          <button className="Icon">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="Icon">
            <FontAwesomeIcon icon={faCommentDots} />
          </button>

          {pathName === "/profile" ? (
            <button className="Icon relative" onClick={() => signOut()}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          ) : (
            <UserProfileIcon currentUser={true}/>
          )}
        </div>
      </div>
    </nav>
    <SearchContext.Provider value={searchText}>
      {children}
    </SearchContext.Provider>
    </>
  );
}
