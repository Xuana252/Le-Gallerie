import { fetchUserWithId } from "@actions/accountActions";
import {
  Comment,
  Post,
  Report,
  ReportItem,
  ReportSearch,
  User,
} from "@lib/types";
import React, { useEffect, useState } from "react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faCameraRetro,
  faCheck,
  faComment,
  faHammer,
  faIdBadge,
  faIdCard,
  faImage,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { UserRole } from "@enum/userRolesEnum";
import { fetchUserReportId } from "@actions/reportActions";
import ReportCard from "./ReportCard";
import Link from "@node_modules/next/link";
import { renderRole } from "@lib/Admin/render";
import { fetchPostWithId } from "@actions/postActions";
import { fetchCommentWithId } from "@actions/commentAction";
import PostProps from "../Props/PostProps";
import CommentProps from "../Props/ComentProps";
import { faCircle } from "@node_modules/@fortawesome/free-regular-svg-icons";
import { formatNumber } from "@lib/format";
import { count } from "console";
import { useRouter } from "next/navigation";
import MasonryLayout from "../Layout/MansonryLayout";

export default function UserReportTab({ user }: { user: User | null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userReport, setUserReport] = useState<ReportSearch | null>(null);
  const router = useRouter();

  const [typeCount, setTypeCount] = useState<Record<string, number>>({});

  const fetchUserReport = async (id: string) => {
    setIsLoading(true);
    const res = await fetchUserReportId(id);

    const counts: Record<string, number> = { Post: 0, Comment: 0 };

    res.reports.forEach((reportItem: ReportItem) => {
      if (reportItem.type === "Post") {
        counts.Post += 1;
        if (user) {
          (reportItem.reportTarget as Post).creator = user;
        }
      } else if (reportItem.type === "Comment") {
        counts.Comment += 1;
        if (user) {
          (reportItem.reportTarget as Comment).user = user;
        }
      }
    });


    setTypeCount(counts);

    setUserReport(res);
    setIsLoading(false);
  };

  useEffect(() => {
    user && fetchUserReport(user._id);
  }, [user?._id]);

  return (
    <div className="panel flex flex-col gap-2 grow">
      <div className="text-primary bg-accent rounded p-1 w-full flex flex-row gap-1 items-center ">
        {renderRole(user?.role || [])}
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
      <div className="font-semibold font-mono">
        User Reports (
        {typeCount["Post"] > 0 && (
          <span>
            {formatNumber(typeCount["Post"])} <FontAwesomeIcon icon={faImage} />
          </span>
        )}{" "}
        {typeCount["Comment"] > 0 && (
          <span>
            {formatNumber(typeCount["Comment"])}{" "}
            <FontAwesomeIcon icon={faComment} />
          </span>
        )}
        )
      </div>
      <div className="bg-secondary-1 rounded p-1">
        <MasonryLayout
          height={"400px"}
          items={userReport?.reports || []}
          isLoading={isLoading}
          holder={(item) => (
            <div
              className="flex flex-col gap-1 p-1 rounded-md bg-primary/50 hover:bg-primary/80 cursor-pointer"
              onClick={() => router.push(`/admin/reports/${item.type.toLowerCase()}s/${item._id}`)}
            >
              {item.type === "Post" ? (
                <PostProps post={item.reportTarget as Post} />
              ) : (
                <CommentProps comment={item.reportTarget as Comment} />
              )}

              <div className="text-xs font-mono panel w-fit flex flex-wrap gap-2 items-center justify-center mx-auto">
                {item.falseCount + item.trueCount} reports
                <span className="flex flex-row gap-1">
                  [
                  <span className="flex flex-row gap-1 items-center font-bold w-fit">
                    {formatNumber(item.trueCount)}{" "}
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className="flex flex-row gap-1 items-center font-bold w-fit">
                    {formatNumber(item.falseCount)}{" "}
                    <FontAwesomeIcon icon={faCircle} />
                  </span>
                  ]
                </span>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
