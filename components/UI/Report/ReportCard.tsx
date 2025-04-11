import { Report } from "@lib/types";
import {
  faComment,
  faImage,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import Link from "@node_modules/next/link";
import React from "react";

export default function ReportCard({ report }: { report: Report }) {
  const match = report.content.match(/\[(.*?)\]([\s\S]*)/);

  const prompts =
    match?.[1]
      ?.split(",")
      .map((p) => p.trim())
      .filter(Boolean) || [];
  const details = match?.[2]?.trim() || report.content;
  return (
    <Link
      href={`/admin/reports/${report.type.toLowerCase()}/${report.reportId}`}
      className="text_panel"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="text-lg">
          {report.type === "Post" ? (
            <FontAwesomeIcon icon={faImage} />
          ) : (
            <FontAwesomeIcon icon={faComment} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs">{report.reportId}</span>
          <ul className="flex flex-wrap gap-2">
            {prompts.map((item, index) => (
              <li
                key={index}
                className="bg-accent text-secondary-1 px-2 py-1 rounded text-xs font-mono"
              >
                {item}
              </li>
            ))}
          </ul>
          <span className="text-xs font-semibold">{report.user.username}</span>
          <div className="text-sm whitespace-pre-wrap">{details}</div>
        </div>
      </div>
    </Link>
  );
}
