"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDownload,
  faPenToSquare,
  faShare,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { type User } from "@lib/types";
import { checkFollowState } from "@server/accountActions";
import Image from "./Image";

// Define the base type for the props
type BaseUserProfileIconProps = {
  currentUser: boolean;
  size?: "Icon" | "Icon_small" | "Icon_big";
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
    if (currentUser) {
      router.push("/profile");
    } else {
      let storeUser = { ...user };
      if (session?.user.id) {
        const followed = await checkFollowState(user?._id, session?.user.id);
        storeUser = { ...user, followed: followed };
      }
      localStorage.setItem("user", JSON.stringify(storeUser));
      router.push(`/profile/${user._id}`);
    }
  };
  const profileImage = currentUser ? session?.user.image : user.image;

  return (
    <button className={`bg-secondary-2 relative ${size}`} onClick={handleClick}>
      {profileImage ? (
          <Image
            src={profileImage}
            alt="profile picture"
            className="size-full"
            width={0}
            height={0}
            transformation={[{ quality: 30 }]}
            style={{ objectFit: "cover" }}
          ></Image>
      ) : (
        <FontAwesomeIcon icon={faUser} />
      )}
    </button>
  );
}
