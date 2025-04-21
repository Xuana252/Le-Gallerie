"use client";
import React, { useEffect, useState } from "react";
import Image from "@components/UI/Image/Image";
import Feed from "@components/UI/Layout/Feed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPen,
  faBorderAll,
  faGear,
  faCheck,
  faHammer,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import PopupButton from "@components/Input/PopupButton";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import { User } from "@lib/types";
import { confirm } from "@components/Notification/Toaster";
import ButtonWithTimeOut from "@components/Input/ButtonWithTimeOut";
import CustomImage from "@components/UI/Image/Image";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  fetchUserFollowers,
  fetchUserFollowing,
  followUser,
} from "@actions/followsActions";
import UserStatBar from "@components/UI/Profile/UserStatBar";
import MultiTabContainer from "@components/UI/Layout/MultiTabContainer";
import { UserRole } from "@enum/userRolesEnum";

export default function MyProfile() {
  const { data: session, update } = useSession();

  return (
    <section className="User_Profile_Layout">
      <div className="User_Info_Container">
        <h1 className="User_Profile_Page_Username">{session?.user?.name}</h1>
        <div className="User_Profile_Page_Picture_Container">
          <div className="relative">
            <div
              className={`${
                session?.user.role?.includes(UserRole.ADMIN)
                  ? "User_Profile_Page_Picture_Admin"
                  : "User_Profile_Page_Picture"
              }`}
            >
              {session?.user?.image ? (
                <CustomImage
                  src={session.user.image}
                  alt={"profile picture"}
                  className="size-full"
                  width={0}
                  height={0}
                  style={{ objectFit: "cover" }}
                  transformation={[{ quality: 80 }]}
                  lqip={{ active: true, quality: 20 }}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="grow" />
              )}
            </div>
            {session?.user?.role?.includes(UserRole.ADMIN) ? (
              <div className="absolute bottom-0 right-0 z-50 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[30%] flex items-center justify-center">
                <FontAwesomeIcon icon={faHammer} className="size-[70%]" />
              </div>
            ) : session?.user?.role?.includes(UserRole.CREATOR) ? (
              <div className="absolute bottom-0 right-0 z-50 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[30%] flex items-center justify-center">
                <FontAwesomeIcon icon={faCheck} className="size-[70%]" />
              </div>
            ) : null}
          </div>
          <UserStatBar userId={session?.user.id || ""} updateFlag={true} />
        </div>

        <h2 className="User_Profile_Page_Fullname">{session?.user.fullname}</h2>
        <h2 className="User_Profile_Page_Bio">{session?.user.bio}</h2>
        <div className="User_Profile_Page_Interactive_Bar">
          <>
            <Link href={"/profile/setting/edit-profile"}>
              <button className="Button_variant_1">
                <FontAwesomeIcon icon={faPen} />
                <span className="font-bold mx-2 text-lg">Edit</span>
              </button>
            </Link>
            <Link href={"/profile/setting"}>
              <button className="Button_variant_1">
                <FontAwesomeIcon icon={faGear} />
                <span className="font-bold mx-2 text-lg">Setting</span>
              </button>
            </Link>
          </>
        </div>
      </div>

      <MultiTabContainer
        tabs={[
          {
            head: (
              <>
                <FontAwesomeIcon icon={faBorderAll} /> All
              </>
            ),
            body: session?.user.id ? (
              <Feed userIdFilter={session.user.id} />
            ) : (
              <div></div>
            ),
          },
          {
            head: (
              <>
                <FontAwesomeIcon icon={faHeart} /> Liked
              </>
            ),
            body: session?.user.id ? (
              <Feed userIdFilter={session.user.id} userIdLikedFilter={true} />
            ) : (
              <div></div>
            ),
          },
        ]}
      />
    </section>
  );
}
