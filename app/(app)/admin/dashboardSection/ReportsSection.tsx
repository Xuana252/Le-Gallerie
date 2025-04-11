import { fetchSystemReportData } from "@actions/reportActions";
import Chart from "@components/UI/Layout/Chart";
import { NumberLoader } from "@components/UI/Loader";
import { formatNumber } from "@lib/format";
import { ReportData, UserData } from "@lib/types";
import { faResolving } from "@node_modules/@fortawesome/free-brands-svg-icons";
import { faCheckSquare } from "@node_modules/@fortawesome/free-regular-svg-icons";
import {
  faCalendar,
  faUserPlus,
  faUserClock,
  faCalendarDay,
  faAnglesUp,
  faAnglesDown,
  faAnglesRight,
  faTrophy,
  faClock,
  faCheckCircle,
  faCheckDouble,
  faBorderAll,
  faImage,
  faComment,
  faListCheck,
  faFlagCheckered,
  faFlag,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { resolve } from "path";
import React, { useEffect, useState } from "react";

export default function ReportsSection() {
  const [data, setData] = useState<ReportData | null>(null);

  const fetchReportData = async () => {
    const res = await fetchSystemReportData();

    setData(res);
  };

  function generateMockReportData(months = 6) {
    const now = new Date();

    const todayCount = Math.floor(Math.random() * 200);
    const todayResolved = Math.floor(Math.random() * (todayCount + 1));

    const totalPost = Math.floor(Math.random() * 5000) + 5000;
    const totalComment = Math.floor(Math.random() * 5000) + 5000;
    const totalResolved = Math.floor(
      Math.random() * (totalPost + totalComment + 1)
    );

    const monthly = Array.from({ length: months }, (_, i) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (months - i - 1),
        1
      );

      const post = Math.floor(Math.random() * 300) + 300;
      const comment = Math.floor(Math.random() * 300) + 300;
      const maxResolved = post + comment;
      const resolved = Math.floor(Math.random() * (maxResolved + 1));

      return {
        _id: {
          year: date.getFullYear(),
          month: date.getMonth() + 1, // JS months are 0-indexed
        },
        count: {
          post,
          comment,
          resolved,
        },
      };
    });

    return {
      today: todayCount,
      todayResolved,
      post: totalPost,
      comment: totalComment,
      resolved: totalResolved,
      monthly,
    };
  }

  useEffect(() => {
    // fetchReportData();
    setData(generateMockReportData(12));
  }, []);

  return (
    <div className="panel flex flex-col gap-2">
      <div className="font-bold text-xl panel">
        <FontAwesomeIcon icon={faFlag} /> Reports
      </div>
      <div className="grid grid-cols-1 grow items-center gap-2 md:grid-cols-[60%_auto] ">
        <Chart
          type="Line"
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> Monthly Reports{" "}
            </div>
          }
          data={
            data?.monthly?.map((item) => {
              return {
                id: `${item._id.year}/${item._id.month}`,
                value: {
                  post: item.count.post,
                  comment: item.count.comment,
                  resolved: item.count.resolved,
                },
              };
            }) || null
          }
        />
        <div className="flex flex-wrap gap-2 h-full grow">
          <div className="panel_2 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faClock} /> Today count
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.today ?? null) ?? <NumberLoader />}
            </span>
          </div>
          <div className="panel_2 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faCheckSquare} /> Resolved
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.todayResolved ?? null) ?? <NumberLoader />}
            </span>
          </div>
          <div className="panel_2 grow flex flex-wrap gap-2 items-start">
            <div className="grow basis-[40%]">
              <span>
                <FontAwesomeIcon icon={faBorderAll} /> Total
              </span>
              <div className="font-mono text-2xl font-bold">
                {typeof data?.post === "number" &&
                typeof data?.comment === "number" ? (
                  formatNumber(data.post + data.comment)
                ) : (
                  <NumberLoader />
                )}
              </div>
            </div>
            {(["post", "comment", "resolved"] as const).map((key) => {
              const value = data?.[key];

              return (
                <div key={key} className="grow basis-[40%]">
                  <span className="">{key}</span>{" "}
                  <div className="font-mono text-2xl font-bold">
                    {formatNumber(value ?? null) ?? <NumberLoader />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="panel_2 text-sx grow flex flex-wrap items-start">
            {(() => {
              const monthly = data?.monthly ?? [];
              const latestCount =
                (monthly.at(-1)?.count as Record<string, number>) || {};
              const previousCount =
                (monthly.at(-2)?.count as Record<string, number>) || {};

              const latestMonth = `${monthly?.at(-1)?._id.year}/${
                monthly?.at(-1)?._id.month
              }`;
              const latestMonthly = monthly?.at(-1)?.count;
              const totalMonth =
                latestMonthly?.comment != null && latestMonthly?.post != null
                  ? latestMonthly.comment + latestMonthly.post
                  : null;

              const allKeys = new Set([
                ...Object.keys(latestCount),
                ...Object.keys(previousCount),
              ]);

              const diff: Record<string, number> = {};

              for (const key of Array.from(allKeys)) {
                const latestVal = (latestCount[key] as number) ?? 0;
                const prevVal = (previousCount[key] as number) ?? 0;
                diff[key] = latestVal - prevVal;
              }

              const monthdiff = diff["comment"] + diff["post"];

              return (
                <>
                  <div className="grow basis-[40%]">
                    <span>
                      <FontAwesomeIcon icon={faCalendarDay} /> {latestMonth}{" "}
                      <span
                        className={`inline-block text-xs ${
                          monthdiff < 0
                            ? "text-green-600"
                            : monthdiff > 0
                            ? "text-red-600"
                            : "text-yellow-600"
                        } p-1 rounded-lg bg-black `}
                      >
                        <FontAwesomeIcon
                          icon={
                            monthdiff > 0
                              ? faAnglesUp
                              : monthdiff < 0
                              ? faAnglesDown
                              : faAnglesRight
                          }
                        />{" "}
                        {Math.abs(monthdiff)}
                      </span>
                    </span>

                    <div className="font-mono text-2xl font-bold">
                      {totalMonth ?? <NumberLoader />}
                    </div>
                  </div>
                  {(["post", "comment", "resolved"] as const).map((key) => {
                    const value = data?.monthly.at(-1)?.count[key];
                    const change = diff[key] ?? 0;
                    return (
                      <div key={key} className="grow basis-[40%]">
                        <span className="">{key}</span>{" "}
                        <span className="ml-2 text-sm font-bold">
                          <span
                            className={`inline-block text-xs ${
                              change < 0
                                ? key !== "resolved"
                                  ? "text-green-600"
                                  : "text-red-600"
                                : change > 0
                                ? key !== "resolved"
                                  ? "text-red-600"
                                  : "text-green-600"
                                : "text-yellow-600"
                            } p-1 rounded-lg bg-black`}
                          >
                            <FontAwesomeIcon
                              icon={
                                change > 0
                                  ? faAnglesUp
                                  : change < 0
                                  ? faAnglesDown
                                  : faAnglesRight
                              }
                            />{" "}
                            {formatNumber(Math.abs(change))}
                          </span>
                        </span>
                        <div className="font-mono text-2xl font-bold">
                          {formatNumber(value ?? null) ?? <NumberLoader />}
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
