import { User } from "@lib/types";
import React from "react";
import CustomImage from "../Image/Image";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faAt,
  faCalendar,
  faCameraRetro,
  faHammer,
  faIdBadge,
  faUser,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { formatDate } from "@lib/dateFormat";
import Link from "@node_modules/next/link";
import { UserRole } from "@enum/userRolesEnum";
import { renderRole } from "@lib/Admin/render";
import UserProfileIcon from "../Profile/UserProfileIcon";

export default function UserReportCard({
  user,
  isLoading = false,
}: {
  user?: User;
  isLoading?: boolean;
}) {


  if (isLoading)
    return (
      <div className="flex flex-col grow p-1 gap-1 rounded-md bg-secondary-2/20">
        <div className="text-xs bg-accent/50  p-1 text-transparent rounded-lg animate-pulse ">
          id
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className={`relative animate-pulse Icon_small `}></div>

          <div className="flex flex-col items-start   gap-1">
            <div className="bg-secondary-2 text-transparent rounded-lg animate-pulse">
              mockname
            </div>
            <div className=" bg-secondary-2 text-xs text-transparent rounded-lg animate-pulse ">
              mockfullname
            </div>
          </div>
        </div>

        <div className="bg-secondary-2 text-xs text-transparent rounded-lg animate-pulse">
          email
        </div>
        <div className="bg-secondary-2 text-xs  text-transparent rounded-lg animate-pulse">
          joined
        </div>
      </div>
    );
  return (
    <Link
      href={`/admin/reports/users/${user?._id}`}
      className="flex flex-col grow rounded-md bg-secondary-2 gap-1 p-1 overflow-hidden text-sm shadow-sm"
    >
      <div className="text-xs bg-accent/50 text-primary p-1 rounded-lg ">
        <span className="flex flex-row gap-1 items-center">
          {renderRole(user?.role||[])}
          {user?._id}
        </span>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <UserProfileIcon user={user} size="Icon_small" redirect={false} />

        <div className="flex flex-col items-start overflow-hidden whitespace-nowrap text-ellipsis">
          <div className="font-semibold underline ">{user?.username}</div>
          <div className=" text-xs text-accent/50 ">{user?.fullname}</div>
        </div>
      </div>

      <div className="text-xs">
        <FontAwesomeIcon icon={faAt} /> {user?.email}
      </div>
      <div className="text-xs text-right italic text-accent/80">
        {user?.createdAt && formatDate(user.createdAt.toString())}{" "}
        <FontAwesomeIcon icon={faCalendar} />
      </div>
    </Link>
  );
}
