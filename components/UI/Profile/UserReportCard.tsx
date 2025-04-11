import { User } from "@lib/types";
import React from "react";
import CustomImage from "../Image/Image";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faAt,
  faCalendar,
  faIdBadge,
  faUser,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { formatDate } from "@lib/dateFormat";
import Link from "@node_modules/next/link";

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
      href={`/admin/users/${user?._id}`}
      className="flex flex-col grow rounded-md bg-secondary-2 gap-1 p-1 overflow-hidden text-sm shadow-sm"
    >
      <div className="text-xs bg-accent/50 text-primary p-1 rounded-lg ">
        <FontAwesomeIcon icon={faIdBadge} /> {user?._id}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <div className={`bg-secondary-2 relative Icon_small`}>
          {user?.image ? (
            <CustomImage
              src={user.image}
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
        </div>

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
