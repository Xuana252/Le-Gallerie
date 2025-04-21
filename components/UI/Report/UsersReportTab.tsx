import { fetchUserWithId } from "@actions/accountActions";
import { Report, User } from "@lib/types";
import React, { useEffect, useState } from "react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faCameraRetro,
  faHammer,
  faIdBadge,
  faIdCard,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { UserRole } from "@enum/userRolesEnum";
import { fetchUserReportId, fetchUsersReportId } from "@actions/reportActions";
import ReportCard from "./ReportCard";
import Link from "@node_modules/next/link";
import { renderRole } from "@lib/Admin/render";

export default function UsersReportTab({ user }: { user: User | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report[]>([]);


  const fetchUserReport = async (id: string) => {
    setIsLoading(true);
    const res = await fetchUsersReportId(id);

    setReport(res.reports);
    setIsLoading(false);
  };

  useEffect(() => {
    user && fetchUserReport(user._id);
  }, [user?._id]);

  return (
    <div className="panel flex flex-col gap-2 grow">
      <div className="text-primary bg-accent rounded p-1 w-full flex flex-row gap-1 items-center ">
        {renderRole(user?.role||[])}
        {user?._id || "user id"}
      </div>
      <div className="flex flex-wrap items-center gap-2 panel_2 p-2">
        {user ? (
          <>
            <UserProfileIcon user={user} size="Icon_big" redirect={false} />
            <div className="flex flex-col justify-around items-start gap-1 grow-[3]">
              <span className="font-semibold">{user.username}</span>
              <span className="italic opacity-50 text-xs">{user.email}</span>
            </div>
            <Link
              href={`/admin/reports/users/${user?._id}`}
              className="Button_variant_2_5 grow items-center justify-center flex gap-2"
            >
              <FontAwesomeIcon icon={faIdCard} /> View Detail
            </Link>
          </>
        ) : (
          <>
            {" "}
            <div className="Icon_big"></div>{" "}
            <div className="flex flex-col justify-around items-start gap-1">
              <span className="font-semibold">username</span>
              <span className="italic opacity-50">email</span>
            </div>
          </>
        )}
      </div>
      <div className="font-semibold font-mono">User's Reports</div>

      <ul className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto bg-secondary-1 p-2 rounded-lg">
        {!isLoading && user ? (
          report.length > 0 ? (
            report?.map((reportItem, idx) => (
              <ReportCard key={idx} report={reportItem} />
            ))
          ) : (
            <div className="size-full flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faBoxArchive} size="2xl" />
              <p>No report found:/</p>
            </div>
          )
        ) : (
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg animate-pulse bg-secondary-2 grow min-w-[250px] min-h-[200px] "
            ></div>
          ))
        )}
      </ul>
    </div>
  );
}
