"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faDownload,
  faHammer,
  faPenToSquare,
  faShare,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { type User } from "@lib/types";
import CustomImage from "../Image/Image";
import { useContext, useEffect, useState } from "react";
import { checkFollowState } from "@actions/followsActions";

import { UserRole } from "@enum/userRolesEnum";

// Define the base type for the props
type UserProfileIconProps = {
  user?: User;
  size?:
    | "Icon"
    | "Icon_small"
    | "Icon_big"
    | "Icon_smaller"
    | "Icon_message"
    | "Icon_bigger";
  redirect?: boolean;
};

export default function UserProfileIcon({
  user,
  size = "Icon",
  redirect = true,
}: UserProfileIconProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!redirect || !user) return;
    if (session?.user.id === user._id) {
      router.push("/profile");
    } else {
      let storeUser = { ...user };
      if (session?.user.id) {
        const followed = await checkFollowState(user._id, session?.user.id);
        storeUser = { ...user, followed: followed };
        if (
          !!!user.blocked?.find((userId) => userId === session.user.id) &&
          !!!session.user.blocked?.find((userId) => userId === user._id)
        )
          localStorage.setItem("user", JSON.stringify(storeUser));
      }
      router.push(`/profile/${user._id}`);
    }
  };

  const userImg = user?.image ?? "";

  return (
    <div className="relative size-fit">
      <button
        className={`bg-secondary-2 relative ${size} ${
          user?.role?.includes(UserRole.ADMIN) ? "border-2 border-white" : ""
        }`}
        style={{
          borderRadius: user?.role?.includes(UserRole.ADMIN) ? "15%" : "50%",
        }}
        onClick={handleClick}
      >
        {userImg ? (
          <CustomImage
            src={userImg}
            alt="profile picture"
            className="size-full"
            width={0}
            height={0}
            transformation={[{ quality: 10 }]}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <FontAwesomeIcon icon={faUser} className="m-0" />
        )}
      </button>
      {user?.role?.includes(UserRole.ADMIN) ? (
        <div className="absolute bottom-0 right-0 z-40 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[40%] max-w-[50px] flex items-center justify-center">
          <FontAwesomeIcon icon={faHammer} className="size-[70%]" />
        </div>
      ) : user?.role?.includes(UserRole.CREATOR) ? (
        <div className="absolute bottom-0 right-0 z-40 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[40%] max-w-[50px] flex items-center justify-center">
          <FontAwesomeIcon icon={faCheck} className="size-[70%]" />
        </div>
      ) : null}
    </div>
  );
}
