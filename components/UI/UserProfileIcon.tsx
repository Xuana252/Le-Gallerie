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

// Define the base type for the props
type BaseUserProfileIconProps = {
  currentUser: boolean;
  size?: 'Icon'|'Icon_small'|'Icon_big';
};

// Define the type for when currentUser is false
type UserProfileIconPropsWhenNotCurrentUser = BaseUserProfileIconProps & {
  currentUser: false;
  user: User;
};

// Define the type for when currentUser is true
type UserProfileIconPropsWhenCurrentUser = BaseUserProfileIconProps & {
  currentUser: true;
  user?:never
};
type UserProfileIconProps =
  | UserProfileIconPropsWhenCurrentUser
  | UserProfileIconPropsWhenNotCurrentUser;

export default function UserProfileIcon({
  currentUser,
  user,
  size = 'Icon',
}: UserProfileIconProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentUser) {
      router.push("/profile");
    } else {
      localStorage.setItem("user", JSON.stringify(user));
      router.push(`/profile/${user._id}`);
    }
  };
  const profileImage = currentUser ? session?.user.image : user.image;

  return (
    <button className={`bg-secondary-2 ${size}`} onClick={handleClick}>
      {profileImage ? (
        <img src={profileImage} alt="profile picture" className="size-full"></img>
      ) : (
        <FontAwesomeIcon icon={faUser} />
      )}
    </button>
  );
}
