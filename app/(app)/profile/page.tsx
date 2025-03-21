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
import UserPostFeed from "@components/UI/Profile/UserPostFeed";

export default function MyProfile() {
  const { data: session, update } = useSession();

  return (
    <section className="text-accent">
      <div className="px-4 py-2">
        <h1 className="User_Profile_Page_Username">{session?.user?.name}</h1>
      </div>
      <div className="User_Profile_Layout">
        <div className="relative">
          <div className="User_Profile_Page_Picture ">
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
              <FontAwesomeIcon icon={faUser} size="xl" className="size-full" />
            )}
          </div>
        </div>
        <UserStatBar
          userId={session?.user.id || ""}
          updateFlag={true}

        />
      </div>
      <div className="px-4 py-2">
        <h2 className="User_Profile_Page_Fullname">{session?.user.fullname}</h2>
        <h2 className="User_Profile_Page_Bio">{session?.user.bio}</h2>
      </div>
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
      <UserPostFeed userId={session?.user.id||""}/>
    </section>
  );
}
