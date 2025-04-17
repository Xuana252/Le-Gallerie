import { User } from "@lib/types";
import {
  faUserGroup,
  faHeart,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React from "react";
import UserProfileIcon from "../Profile/UserProfileIcon";

export default function UserProps({ user }: { user?: User }) {
  return (
    <label className="cursor-pointer shadow-sm  flex flex-col sm:flex-row items-center sm:items-start overflow-hidden gap-2 p-2 h-fit text-accent w-auto  bg-gradient-to-br from-secondary-2/20 to-secondary-1/20 ">
      <UserProfileIcon user={user} size="Icon_big" />
      <div className="flex flex-col gap-2  overflow-hidden text-ellipsis items-center sm:items-start">
        <div className="flex flex-col items-center sm:items-start  text-center sm:text-left ">
          <div className="font-semibold underline ">{user?.username}</div>
          {user?.email&&<div className="text-xs text-accent/80 italic ">{user?.email}</div>}
          <div className="text-sm text-accent/50 ">{user?.fullname}</div>
        </div>

        <div className="text-xs font-mono">{user?.bio}</div>
      </div>
    </label>
  );
}
