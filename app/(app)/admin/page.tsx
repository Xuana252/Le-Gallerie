"use client";
import { fetchSystemUserData } from "@actions/accountActions";
import { fetchSystemCategoryData } from "@actions/categoriesActions";
import { fetchSystemPostData } from "@actions/postActions";
import Chart from "@components/UI/Layout/Chart";
import { NumberLoader } from "@components/UI/Loader";
import { adminRoutes } from "@constant/adminRoutes";
import { Post } from "@lib/types";
import {
  faAnglesDown,
  faAnglesRight,
  faAnglesUp,
  faBorderAll,
  faCalendar,
  faCalendarDay,
  faChartPie,
  faClock,
  faTags,
  faTimeline,
  faTrophy,
  faUserClock,
  faUserPlus,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { SpanStatus } from "@node_modules/next/dist/trace";
import Link from "@node_modules/next/link";
import React, { useEffect, useState } from "react";

type PostData = {
  total: number;
  today: number;
  monthly: { _id: { year: number; month: number }; count: number }[];
};

type UserData = {
  total: number;
  today: number;
  monthly: { _id: { year: number; month: number }; count: number }[];
};
type CategoryDataItem = {
  categoryId: string;
  count: number;
  name: string;
};
type CategoryData = {
  category: CategoryDataItem[];
  thisMonth: CategoryDataItem[];
};

export default function Dashboard() {
  const sections = adminRoutes.slice(1, adminRoutes.length);
  const [postData, setPostData] = useState<PostData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);

  const fetchPostData = async () => {
    const res = await fetchSystemPostData();
    console.log(res);
    setPostData(res);
  };

  const fetchUserData = async () => {
    const res = await fetchSystemUserData();
    console.log(res);
    setUserData(res);
  };

  const fetchCategoryData = async () => {
    const res = await fetchSystemCategoryData();
    console.log(res);
    setCategoryData(res);
  };

  const fetchData = async () => {
    await Promise.all([fetchPostData(), fetchCategoryData(), fetchUserData()]);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <section className="flex flex-col gap-4">
      <div className="title">
        <FontAwesomeIcon icon={faChartPie} /> Dashboard{" "}
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="panel flex flex-col gap-2  grow basis-[400px]">
          <span>Posts</span>
          <div className="grid grid-cols-1 items-center grow gap-2 md:grid-cols-[60%_auto] ">
            <Chart
              type="Bar"
              name={
                <div>
                  <FontAwesomeIcon icon={faCalendar} /> Monthly Posts{" "}
                </div>
              }
              data={
                postData?.monthly?.map((item) => {
                  return {
                    id: `${item._id.year}/${item._id.month}`,
                    value: item.count,
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
                  {postData?.total ?? <NumberLoader />}
                </span>
              </div>
              <div className="panel_2 grow flex flex-col items-start">
                <span>
                  <FontAwesomeIcon icon={faClock} /> Today count
                </span>
                <span className="font-mono text-2xl font-bold">
                  {postData?.today ?? <NumberLoader />}
                </span>
              </div>
              <div className="panel_2 grow flex flex-col items-start">
                <span>
                  <FontAwesomeIcon icon={faCalendarDay} /> This month{" "}
                  <span className="ml-2 text-sm font-normal ">
                    {(() => {
                      const latest = postData?.monthly.at(-1)?.count ?? 0;
                      const previous = postData?.monthly.at(-2)?.count ?? 0;
                      const diff = latest - previous;
                      return (
                        <span
                          className={
                            diff > 0
                              ? "text-green-600"
                              : diff < 0
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
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
                          {Math.abs(diff)}
                        </span>
                      );
                    })()}
                  </span>
                </span>

                {(postData?.monthly?.length || 0) >= 2 ? (
                  <span className="font-mono text-2xl font-bold">
                    {postData?.monthly.at(-1)?.count}
                  </span>
                ) : (
                  <NumberLoader />
                )}
              </div>

              <div className="panel_2 grow flex flex-col items-start">
                <span>
                  <FontAwesomeIcon icon={faTrophy} /> Peak count{" "}
                </span>

                {postData?.monthly ? (
                  (() => {
                    const sorted = [...postData.monthly].sort(
                      (a, b) => b.count - a.count
                    );
                    const peak = sorted[0];

                    return (
                      <>
                        <span className="font-mono text-2xl font-bold">
                          {peak.count}
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

        <div className="panel flex flex-col gap-2 grow basis-[400px]">
          <span>Categories</span>
          <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[60%_auto] ">
            <Chart
              type={"Pie"}
              name={
                <div>
                  <FontAwesomeIcon icon={faCalendar} /> Monthly Categories
                </div>
              }
              data={
                categoryData?.category.slice(0, 10)?.map((item) => {
                  return {
                    id: `${item.name}`,
                    value: item.count,
                  };
                }) || null
              }
            />
            <div className="flex flex-col gap-2 h-full grow    panel_2">
              <div>
                <FontAwesomeIcon icon={faTags} /> All time
              </div>
              <div className=" overflow-y-auto flex flex-wrap gap-2 font-mono">
                {categoryData?.category
                  ?.sort((a, b) => b.count - a.count)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="border-2 border-primary px-2 rounded-full max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
                      title={item.name}
                    >
                       {item.count} {item.name}
                    </div>
                  )) ||
                  Array.from({ length: 10 }).map((item, index) => (
                    <div
                      key={index}
                      className="border-2 text-transparent animate-pulse border-primary bg-primary px-2 rounded-full"
                    >
                      Category
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="panel flex flex-col gap-2  grow basis-[400px]">
          <span>Users</span>
          <div className="grid grid-cols-1 grow items-center gap-2 md:grid-cols-[60%_auto] ">
            <Chart
              type="Line"
              name={
                <div>
                  <FontAwesomeIcon icon={faCalendar} /> Monthly Users{" "}
                </div>
              }
              data={
                userData?.monthly?.map((item) => {
                  return {
                    id: `${item._id.year}/${item._id.month}`,
                    value: item.count,
                  };
                }) || null
              }
            />
            <div className="flex flex-col gap-2 h-full grow">
              <div className="panel_2 grow flex flex-col items-start">
                <span>
                  <FontAwesomeIcon icon={faUserPlus} /> Total Users
                </span>
                <span className="font-mono text-2xl font-bold">
                  {userData?.total ?? <NumberLoader />}
                </span>
              </div>
              <div className="panel_2 grow flex flex-col items-start">
                <span>
                  <FontAwesomeIcon icon={faUserClock} /> Joined today
                </span>
                <span className="font-mono text-2xl font-bold">
                  {userData?.today ?? <NumberLoader />}
                </span>
              </div>
              <div className="panel_2 grow flex flex-col items-start">
                <span>
                  <FontAwesomeIcon icon={faCalendarDay} /> This month{" "}
                  <span className="ml-2 text-sm font-normal ">
                    {(() => {
                      const latest = userData?.monthly.at(-1)?.count ?? 0;
                      const previous = userData?.monthly.at(-2)?.count ?? 0;
                      const diff = latest - previous;
                      return (
                        <span
                          className={
                            diff > 0
                              ? "text-green-600"
                              : diff < 0
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
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
                          {Math.abs(diff)}
                        </span>
                      );
                    })()}
                  </span>
                </span>

                {(userData?.monthly?.length || 0) >= 2 ? (
                  <span className="font-mono text-2xl font-bold">
                    {userData?.monthly.at(-1)?.count}
                  </span>
                ) : (
                  <NumberLoader />
                )}
              </div>

              <div className="panel_2 grow flex flex-col items-start">
                <span>
                  <FontAwesomeIcon icon={faTrophy} /> Peak count{" "}
                </span>

                {userData?.monthly ? (
                  (() => {
                    const sorted = [...userData.monthly].sort(
                      (a, b) => b.count - a.count
                    );
                    const peak = sorted[0];

                    return (
                      <>
                        <span className="font-mono text-2xl font-bold">
                          {peak.count}
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
      </div>

      <ul className="flex flex-col gap-6 my-8">
        {sections.map((section: any, index) => (
          <div key={index} className="relative">
            <div className="absolute size-full light_bottom_right z-0"></div>
            <div className="absolute size-full bloom_left z-0"></div>
            <div className="w-fit bg-secondary-1/50 px-2 py-1 rounded-t-xl text-secondary-2 font-bold text-base">{section.section}</div>
            <ul className="flex flex-wrap gap-6 p-4 bg-secondary-1/50 rounded-b-xl rounded-tr-xl">
              {section.items.map((item: any, index: number) => (
                <Link
                  href={item.path}
                  key={index}
                  className="grow min-w-[30%] bg-secondary-2/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-start gap-3 hover:bg-secondary-2/70 transition-transform duration-200"
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-xl sm:text-3xl text-accent/70"
                  />
                  <span className="font-bold text-accent text-xl">
                    {item.name}
                  </span>
                  <p className="text-accent/80 text-base">{item.description}</p>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </section>
  );
}
