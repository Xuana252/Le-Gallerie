import { fetchSystemPostData } from "@actions/postActions";
import Chart from "@components/UI/Layout/Chart";
import { NumberLoader } from "@components/UI/Loader";
import { formatNumber } from "@lib/format";
import { PostData } from "@lib/types";
import {
  faCalendar,
  faBorderAll,
  faClock,
  faCalendarDay,
  faAnglesUp,
  faAnglesDown,
  faAnglesRight,
  faTrophy,
  faImage,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function PostSection() {
  const [data, setData] = useState<PostData | null>(null);

  const fetchPostData = async () => {
    const res = await fetchSystemPostData();

    setData(res);
  };

  type PostData = {
    total: number;
    today: number;
    monthly: {
      _id: {
        year: number;
        month: number;
      };
      count: number;
    }[];
  };

  function generateMockPostData(months = 6): PostData {
    const now = new Date();
    const monthly: PostData["monthly"] = [];

    let total = 0;

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const count = Math.floor(Math.random() * 3000) + 2000; // Random posts for the month
      total += count;

      monthly.push({
        _id: {
          year: date.getFullYear(),
          month: date.getMonth() + 1, // JS months are 0-based
        },
        count,
      });
    }

    const today = Math.floor(Math.random() * 20); // Posts today

    return {
      total,
      today,
      monthly,
    };
  }

  useEffect(() => {
    // fetchPostData()
    setData(generateMockPostData(12));
  }, []);
  return (
    <div className="panel flex flex-col gap-2  ">
      <div className="font-bold text-xl panel ">
        <FontAwesomeIcon icon={faImage} /> Posts
      </div>
      <div className="grid grid-cols-1 items-center grow gap-2 md:grid-cols-[60%_auto] ">
        <Chart
          type="Bar"
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> Monthly Posts{" "}
            </div>
          }
          data={
            data?.monthly?.map((item) => {
              return {
                id: `${item._id.year}/${item._id.month}`,
                value: {
                  posts: item.count,
                },
              };
            }) || null
          }
        />
        <div className="flex flex-wrap gap-2 h-full grow">
          <div className="panel_2 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faBorderAll} /> Total Posts
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.total ?? null) ?? <NumberLoader />}
            </span>
          </div>
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
              <FontAwesomeIcon icon={faCalendarDay} /> This month{" "}
              <span className="ml-2 text-sm font-bold ">
                {(() => {
                  const latest = data?.monthly.at(-1)?.count ?? 0;
                  const previous = data?.monthly.at(-2)?.count ?? 0;
                  const diff = latest - previous;
                  return (
                    <span
                      className={`inline-block text-xs ${
                        diff > 0
                          ? "text-green-600"
                          : diff < 0
                          ? "text-red-600"
                          : "text-yellow-600"
                      } p-1 rounded-lg bg-black `}
                    >
                      <FontAwesomeIcon
                        icon={
                          diff > 0
                            ? faAnglesUp
                            : diff < 0
                            ? faAnglesDown
                            : faAnglesRight
                        }
                      />{" "}
                      {formatNumber(Math.abs(diff))}
                    </span>
                  );
                })()}
              </span>
            </span>

            {(data?.monthly?.length || 0) >= 2 ? (
              <span className="font-mono text-2xl font-bold">
                {formatNumber(data?.monthly.at(-1)?.count ?? null)}
              </span>
            ) : (
              <NumberLoader />
            )}
          </div>

          <div className="panel_2 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faTrophy} /> Peak count{" "}
            </span>

            {data?.monthly ? (
              (() => {
                const sorted = [...data.monthly].sort(
                  (a, b) => b.count - a.count
                );
                const peak = sorted[0];

                return (
                  <>
                    <span className="font-mono text-2xl font-bold">
                      {formatNumber(peak.count)}
                    </span>
                    <span className="font-mono text-sm text-primary/80 ml-auto mt-auto">
                      {peak._id.year}/{peak._id.month}
                    </span>
                  </>
                );
              })()
            ) : (
              <NumberLoader />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
