import { fetchReport } from "@actions/reportActions";
import ReportCard from "@components/UI/Report/ReportCard";
import { Report } from "@lib/types";
import {
  faComment,
  faFlag,
  faImage,
  faTags,
  faUser,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import Link from "@node_modules/next/link";
import React, { useEffect, useState } from "react";

export default function NewReportSection() {
  const [data, setData] = useState<Report[] | null>(null);

  const fetchNewReportData = async () => {
    const res = await fetchReport(10, 1, "");
    setData(res?.reports);
  };

  useEffect(() => {
    fetchNewReportData();
  }, []);

  return (
    <div className="panel flex flex-col gap-2 ">
      <div className="font-bold text-xl panel flex flex-row items-center justify-between ">
        <div className=" flex flex-row gap-1 items-center">
          <FontAwesomeIcon icon={faFlag} /> New Report
        </div>
        <div className="flex flex-row items-center gap-2 ">
          <Link
            href="/admin/reports/posts"
            className=" Icon_small"
            title="Post Report"
          >
            <FontAwesomeIcon icon={faImage} />
          </Link>
          <Link
            href="/admin/reports/comments"
            className=" Icon_small"
            title="Comment Report"
          >
            <FontAwesomeIcon icon={faComment} />
          </Link>
          <Link
            href="/admin/reports/users"
            className=" Icon_small"
            title="User Report"
          >
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-2  ">
        {data
          ? data.map((report, index) => (
              <ReportCard key={index} report={report} />
            ))
          : Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg animate-pulse bg-secondary-2 w-[200px] h-[100px]"
              ></div>
            ))}
      </div>
    </div>
  );
}
