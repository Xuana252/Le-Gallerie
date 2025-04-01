import { User } from "@lib/types";
import Link from "@node_modules/next/link";
import React from "react";
import UserProfileIcon from "./UserProfileIcon";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faHeart,
  faUser,
  faUserGroup,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import CustomImage from "../Image/Image";

export default function UserCard({ user }: { user: User }) {
  return (
    <label className="cursor-pointer shadow-sm  grid grid-cols-[auto_1fr] overflow-hidden gap-2 p-2 h-fit text-accent w-auto  bg-gradient-to-br from-secondary-2/20 to-secondary-1/20 ">
        <UserProfileIcon currentUser={false} user={user} size="Icon_big"/>
      <div className="flex flex-col gap-2  overflow-hidden text-ellipsis">
          <div className="w-full flex flex-row gap-2 justify-between relative ">
              <div className="flex flex-col items-start overflow-hidden whitespace-nowrap text-ellipsis">
                  <div className="font-semibold underline ">{user.username}</div>
                  <div className="text-sm text-accent/50 ">{user.fullname}</div>
              </div>
              <div className="flex flex-row gap-2 justify-around items-center  text-sm">
                <div className="flex flex-row gap-2 items-center" title="followers">
                    {user.follower}
                    <FontAwesomeIcon icon={faUserGroup}/>
                </div>
                <div className="flex flex-row gap-2 items-center" title="following">
                    {user.following}
                    <FontAwesomeIcon icon={faHeart}/>
                </div>
              </div>
          </div>
          <div className="text-xs font-mono">{user.bio}</div>
      </div>
    </label>
  );
}
