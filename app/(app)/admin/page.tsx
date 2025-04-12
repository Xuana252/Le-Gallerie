"use client";
import { fetchSystemUserData } from "@actions/accountActions";
import { fetchSystemCategoryData } from "@actions/categoriesActions";
import { fetchSystemPostData } from "@actions/postActions";
import Chart from "@components/UI/Layout/Chart";
import { SubPathContext } from "@components/UI/Layout/SideBar";
import { NumberLoader } from "@components/UI/Loader";
import { adminRoutes } from "@constant/adminRoutes";
import { CategoryData, Post, PostData, Report, ReportData, UserData } from "@lib/types";
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
import React, { useContext, useEffect, useRef, useState } from "react";
import PostSection from "./dashboardSection/PostSection";
import CategorySection from "./dashboardSection/CategorySection";
import UsersSection from "./dashboardSection/UsersSection";
import ReportsSection from "./dashboardSection/ReportsSection";
import { fetchReport, fetchSystemReportData } from "@actions/reportActions";
import NewReportSection from "./dashboardSection/NewReportSection";

export default function Dashboard() {
  const { subPath, setSubPath } = useContext(SubPathContext);

  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({
    "Posts": null,
    "Categories": null,
    "Users": null,
    "Reports": null,
    "New Report": null
  });

  const sectionKeys = Object.keys(sectionsRef.current);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute("data-section");
            if (section) {
              setSubPath({ path: section, scroll: false });
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    sectionKeys.forEach((key) => {
      const section = sectionsRef.current[key];
      if (section) {
        section.setAttribute("data-section", key);
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (subPath.path && subPath.scroll && sectionsRef.current[subPath.path]) {
      const section = sectionsRef.current[subPath.path];
      if (!section) return;

      section.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [subPath]);

  return (
    <section className="flex flex-col gap-4">
      <div className="title">
        <FontAwesomeIcon icon={faChartPie} /> Dashboard{" "}
      </div>
      <div className="flex flex-wrap gap-4">
        <div
          ref={(el) => {
            sectionsRef.current["Posts"] = el;
          }}
          className="grow basis-[500px] h-full"
        >
          <PostSection />
        </div>

        <div
          ref={(el) => {
            sectionsRef.current["Categories"] = el;
          }}
          className="grow basis-[500px] h-full"
        >
          <CategorySection  />
        </div>

        <div
          ref={(el) => {
            sectionsRef.current["Users"] = el;
          }}
          className="grow basis-[500px] h-full"
        >
          <UsersSection />
        </div>

        <div
          ref={(el) => {
            sectionsRef.current["Reports"] = el;
          }}
          className="grow basis-[500px] h-full"
        >
          <ReportsSection />
        </div>

        <div
          ref={(el) => {
            sectionsRef.current["New Report"] = el;
          }}
          className="grow basis-[500px] h-full"
        >
          <NewReportSection  />
        </div>
      </div>
    </section>
  );
}
