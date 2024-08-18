"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faCircleHalfStroke,
  faRightFromBracket,
  faImage,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import InputBox from "./Input/InputBox";
import DropDownButton from "./Input/DropDownButton";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import UserProfileIcon from "./UserProfileIcon";
import { createContext } from "react";
import ThemeList from "@theme/ThemesList";

export const SearchContext = createContext("");

export default function Nav({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [pendingText, setPendingText] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingText(e.target.value);
  };
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const finalText = pendingText
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      localStorage.setItem("searchText", finalText);
      setSearchText(finalText);
    }
  };

  const pathName = usePathname();

  const ButtonSet = (
    <>
      {session?.user && (<>
        
        <Link href={"/post/create"}>
          <button className="Icon">
            <FontAwesomeIcon icon={faImage} />
          </button>
        </Link>
        <button className="Icon">
          <FontAwesomeIcon icon={faBell} />
        </button>
        <button className="Icon">
          <FontAwesomeIcon icon={faCommentDots} />
        </button>
      </>
      )}
      <DropDownButton dropDownList={<ThemeList />} dropDirection="left">
        <FontAwesomeIcon icon={faCircleHalfStroke} />
      </DropDownButton>
      {pathName === "/profile" ? (
        <button className="Icon relative" onClick={() => signOut()}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      ) : (
        <UserProfileIcon currentUser={true} />
      )}
    </>
  );

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

          {pathName === "/" && (
            <InputBox
              onTextChange={handleSearchTextChange}
              onKeyDown={handleSearchKeyPress}
              value={pendingText}
              type="SearchBox"
            >
              Search for titles...
            </InputBox>
          )}

          {/* On desktop */}
          <div className="Buttons_container">
            {session?.user && (
              <>
                <Link href={"/post/create"}>
                  <button className="Icon">
                    <FontAwesomeIcon icon={faImage} />
                  </button>
                </Link>
                <button className="Icon">
                  <FontAwesomeIcon icon={faBell} />
                </button>
                <button className="Icon">
                  <FontAwesomeIcon icon={faCommentDots} />
                </button>
              </>
            )}

            <DropDownButton dropDownList={<ThemeList />}>
              <FontAwesomeIcon icon={faCircleHalfStroke} />
            </DropDownButton>

            {pathName === "/profile" ? (
              <button className="Icon relative" onClick={() => signOut()}>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            ) : (
              <UserProfileIcon currentUser={true} />
            )}
          </div>

          {/* On mobile */}
          <div className="sm:hidden">
            <DropDownButton dropDownList={ButtonSet}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </DropDownButton>
          </div>
        </div>
      </nav>
      <SearchContext.Provider value={searchText}>
        {children}
      </SearchContext.Provider>
    </>
  );
}
