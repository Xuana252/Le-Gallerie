"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDownload,
  faHammer,
  faPenToSquare,
  faShare,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { type User } from "@lib/types";
import CustomImage from "../Image/Image";
import { useEffect, useState } from "react";
import { checkFollowState } from "@actions/followsActions";
import { UserRole } from "@enum/userRolesEnum";

// Define the base type for the props
type BaseUserProfileIconProps = {
  currentUser: boolean;
  size?:
    | "Icon"
    | "Icon_small"
    | "Icon_big"
    | "Icon_smaller"
    | "Icon_message"
    | "Icon_bigger";
};

// Define the type for when currentUser is false
type UserProfileIconPropsWhenNotCurrentUser = BaseUserProfileIconProps & {
  currentUser: false;
  user: User;
};

// Define the type for when currentUser is true
type UserProfileIconPropsWhenCurrentUser = BaseUserProfileIconProps & {
  currentUser: true;
  user?: never;
};
type UserProfileIconProps =
  | UserProfileIconPropsWhenCurrentUser
  | UserProfileIconPropsWhenNotCurrentUser;

export default function UserProfileIcon({
  currentUser,
  user,
  size = "Icon",
}: UserProfileIconProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentUser || session?.user.id === user._id) {
      router.push("/profile");
    } else {
      let storeUser = { ...user };
      if (session?.user.id) {
        const followed = await checkFollowState(user?._id, session?.user.id);
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

  const userImg = currentUser ? session?.user.image ?? "" : user?.image ?? "";

  return (
    <div className="relative">
      <button
        className={`bg-secondary-2 relative ${size} ${
          user?.role?.includes(UserRole.ADMIN) ? "border-2 border-white" : ""
        }`}
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
      {user?.role?.includes(UserRole.ADMIN) && (
        <div className="absolute text-xs bottom-0 right-0 z-50 text-white rounded-full bg-black">
          <FontAwesomeIcon icon={faHammer} />
        </div>
      )}
    </div>
  );
}
