import { fetchSystemUserData } from "@actions/accountActions";
import Chart from "@components/UI/Layout/Chart";
import { NumberLoader } from "@components/UI/Loader";
import { formatNumber } from "@lib/format";
import { UserData } from "@lib/types";
import {
  faCalendar,
  faUserPlus,
  faUserClock,
  faCalendarDay,
  faAnglesUp,
  faAnglesDown,
  faAnglesRight,
  faTrophy,
  faUserAltSlash,
  faUsers,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function UsersSection() {
  const [data, setData] = useState<UserData | null>(null);

  const fetchUserData = async () => {
    const res = await fetchSystemUserData();

    setData(res);
  };

  function generateMockUserData(months = 6): UserData {
    const now = new Date();

    const monthly: UserData["monthly"] = Array.from(
      { length: months },
      (_, i) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - (months - i - 1),
          1
        );
        return {
          _id: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
          },
          count: Math.floor(Math.random() * 2000) + 500,
        };
      }
    );

    const total = monthly.reduce((acc, curr) => acc + curr.count, 0);
    const today = Math.floor(Math.random() * 300) + 200; // daily new users
    const banned = Math.floor(Math.random() * (total * 0.3)); // up to 30% of total

    return {
      total,
      today,
      banned,
      monthly,
    };
  }

  useEffect(() => {
    // fetchUserData;
    setData(generateMockUserData());
  }, []);

  return (
    <div className="panel flex flex-col gap-2">
      <div className="font-bold text-xl panel">
        <FontAwesomeIcon icon={faUsers} /> Users
      </div>
      <div className="grid grid-cols-1 grow items-center gap-2 md:grid-cols-[60%_auto] ">
        <Chart
          type="Area"
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> Monthly Users{" "}
            </div>
          }
          data={
            data?.monthly?.map((item) => {
              return {
                id: `${item._id.year}/${item._id.month}`,
                value: { users: item.count },
              };
            }) || null
          }
        />
        <div className="flex flex-wrap gap-2 h-full grow">
          <div className="panel_2 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faUserPlus} /> Total Users
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.total ?? null) ?? <NumberLoader />}
            </span>
          </div>
          <div className="panel_2 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faUserClock} /> Joined today
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.today ?? null) ?? <NumberLoader />}
            </span>
          </div>

          <div className="panel_2 grow flex flex-col items-start">
            <span>
              <FontAwesomeIcon icon={faUserAltSlash} /> Banned
            </span>
            <span className="font-mono text-2xl font-bold">
              {formatNumber(data?.banned ?? null) ?? <NumberLoader />}
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
                          ? "text-green-400"
                          : diff < 0
                          ? "text-red-400"
                          : "text-yellow-400"
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
