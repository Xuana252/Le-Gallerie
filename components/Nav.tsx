"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faUser,
  faCircleHalfStroke,
  faRightFromBracket,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import InputBox from "./InputBox";
import Image from "next/image";
import DropDownButton from "./DropDownButton";
import { signOut, useSession, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import { image } from "@nextui-org/theme";

export default function Nav() {
  const { data: session } = useSession();

  const ListItem = (
    <ul>
      <div>A</div>
      <div>B</div>
      <div>C</div>
      <div>C</div>
    </ul>
  );

  const pathName = usePathname();
  return (
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

        {pathName === "/" && <InputBox type="SearchBox" style={{ flex: 1 }}>Search for titles...</InputBox>}

        <div className="Buttons_container">
          {session?.user && (
            <Link href={"/create-post"}>
              <button className="Icon">
                <FontAwesomeIcon icon={faPen} size="xl"/>
              </button>
            </Link>)}


          <DropDownButton dropDownList={ListItem}>
            <FontAwesomeIcon icon={faCircleHalfStroke} size="xl" />
          </DropDownButton>

          <button className="Icon">
            <FontAwesomeIcon icon={faBell} size="xl" />
          </button>
          <button className="Icon">
            <FontAwesomeIcon icon={faCommentDots} size="xl" />
          </button>

          {pathName === "/profile" ? (
            <button className="Icon relative" onClick={() => signOut()}>
              <FontAwesomeIcon icon={faRightFromBracket} size="xl" />
            </button>
          ) : (
            <Link href={"/profile"}>
              <button className="Icon relative">
                {session?.user?.image ? (
                  <Image
                    src={session?.user.image}
                    alt="profle picture"
                    fill
                    style={{ objectFit: "cover" }}
                  ></Image>
                ) : (
                  <FontAwesomeIcon icon={faUser} size="xl" />
                )}
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
