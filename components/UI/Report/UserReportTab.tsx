import { fetchUserWithId } from "@actions/accountActions";
import { Comment, Post, Report, User } from "@lib/types";
import React, { useEffect, useState } from "react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faCameraRetro,
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

export default function UserReportTab({ user }: { user: User | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<
    Record<
      string,
      {
        reports: Report[];
        type: "Post" | "Comment";
        targetData: Post | Comment;
      }
    >
  >({});

  const [typeCount, setTypeCount] = useState<Record<string, number>>({});

  const fetchUserReport = async (id: string) => {
    setIsLoading(true);
    const res = await fetchUserReportId(id);
    const grouped = res.reports.reduce(
      (acc: Record<string, Report[]>, report: Report) => {
        if (!acc[report.reportId]) {
          acc[report.reportId] = [];
        }
        acc[report.reportId].push(report);
        return acc;
      },
      {}
    );

    // For each group, fetch related post/comment
    const entries = await Promise.all(
      Object.entries(grouped as Record<string, Report[]>).map(
        async ([reportId, reports]) => {
          const type = reports[0]?.type; // e.g. 'post' or 'comment'

          let targetData = null;
          try {
            if (type === "Post") {
              const res = await fetchPostWithId(reportId);
              targetData = res.data;
            } else if (type === "Comment") {
              const res = await fetchCommentWithId(reportId);
              targetData = res.data;
            }
          } catch (err) {
            console.error(`Failed to fetch ${type} with ID ${reportId}`, err);
          }

          return [reportId, { reports, type, targetData }];
        }
      )
    );

    const detailsMap = Object.fromEntries(entries);

    const typeCount = (
      Object.values(detailsMap) as {
        reports: Report[];
        type: string;
        targetData: any;
      }[]
    ).reduce((acc: Record<string, number>, { type }) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    setTypeCount(typeCount);

    setReport(detailsMap);
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
      <div className="font-semibold">
        User Reports (
        {typeCount["Post"] && (
          <span>
            {typeCount["Post"]} <FontAwesomeIcon icon={faImage} />
          </span>
        )}
        {typeCount["Comment"] && (
          <span>
            {typeCount["Comment"]} <FontAwesomeIcon icon={faComment} />
          </span>
        )}
        )
      </div>
      <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto bg-secondary-1 p-2 rounded-lg">
        {!isLoading && user ? (
          Object.entries(report).length > 0 ? (
            Object.entries(report).map(([reportId, detail], index) => (
              <li
                key={reportId}
                className="w-full bg-secondary-2/50 rounded-md p-1 flex flex-col gap-2 "
              >
                <h3 className="text-sm opacity-80 mb-1">
                  Report ID: {reportId}
                </h3>
                {detail.type === "Post" ? (
                  <div className="w-[200px] mx-auto">
                    <PostProps post={detail.targetData as Post} />
                  </div>
                ) : (
                  <div className="mx-auto">
                    <CommentProps comment={detail.targetData as Comment} />
                  </div>
                )}

                <div className="text-left font-mono">
                  {detail.reports.length} reports
                </div>
                <div className="flex flex-row gap-2 w-full overflow-x-auto bg-primary rounded-md">
                  {detail.reports.map((reportItem, idx) => (
                    <ReportCard key={idx} report={reportItem} />
                  ))}
                </div>
              </li>
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
              className="rounded-lg animate-pulse bg-secondary-2 w-full min-h-[200px] "
            ></div>
          ))
        )}
      </ul>
    </div>
  );
}
