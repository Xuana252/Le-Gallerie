"use client";
import InputBox from "@components/Input/InputBox";
import { Category, Post, ReportSearch, User } from "@lib/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchBannedUsers, fetchSystemUsers } from "@actions/accountActions";
import UserReportCard from "@components/UI/Report/UserReportCard";
import MultipleOptionsButton from "@components/Input/MultipleOptionsButton";
import FilterButton from "@components/Input/FilterButton";
import {
  faArrowDown19,
  faArrowDownAZ,
  faArrowUp19,
  faArrowUpAZ,
  faCalendar,
  faCameraRetro,
  faCheck,
  faEye,
  faEyeLowVision,
  faEyeSlash,
  faHammer,
  faIdBadge,
  faImagePortrait,
  faList,
  faSignature,
  faUser,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import DateTimePicker from "@components/Input/DateTimePicker";
import { UserRole } from "@enum/userRolesEnum";
import { formatDateFromString } from "@lib/dateFormat";
import Pagination from "@components/UI/Layout/Pagination";
import UserReportTab from "@components/UI/Report/UserReportTab";
import UserBanCard from "@components/UI/Report/UserBanCard";
import { fetchPostReport } from "@actions/reportActions";
import PostProps from "@components/UI/Props/PostProps";
import PostCard from "@components/UI/Post/PostCard";
import MasonryLayout from "@components/UI/Layout/MansonryLayout";
import { formatNumber } from "@lib/format";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useRouter } from "@node_modules/next/navigation";
import CategoryBar from "@components/UI/Layout/CategoriesBar";
import { faCircle } from "@node_modules/@fortawesome/free-regular-svg-icons";

export default function Posts() {
  const router = useRouter();
  const [reportPosts, setReportPosts] = useState<ReportSearch>();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pendingText, setPendingText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<0 | -1 | 1>(0);
  const [resolvedFilter, setResolvedFilter] = useState<0 | -1 | 1>(0);
  const [reportSort, setReportSort] = useState<0 | -1 | 1>(0);
  const [approvedSort, setApprovedSort] = useState<0 | -1 | 1>(0);
  const [pendingSort, setPendingSort] = useState<0 | -1 | 1>(0);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const LIMIT = 30;

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchText(pendingText);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    const res = await fetchPostReport(
      page,
      LIMIT,
      searchText,
      selectedCategories,
      visibilityFilter,
      resolvedFilter,
      reportSort,
      approvedSort,
      pendingSort
    );

    setReportPosts(res);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [
    searchText,
    page,
    visibilityFilter,
    selectedCategories,
    resolvedFilter,
    reportSort,
    approvedSort,
    pendingSort,
  ]);

  return (
    <section className="w-full flex flex-col gap-2">
      <div className="title">Reported Posts</div>

      <div className="grid grid-cols-1 gap-2">
        <div className="flex flex-col gap-2 order-2 xl:order-1">
          <div className="panel">
            <InputBox
              type="SearchBox"
              value={pendingText}
              onTextChange={(e) => setPendingText(e.target.value)}
              onKeyDown={handleKeydown}
            />
          </div>
          <div className="panel flex flex-wrap items-center gap-x-4 gap-2">
            <FilterButton
              name="visibility"
              icon={faEyeLowVision}
              option={[
                { text: "All", value: 0, icon: faList },
                { text: "Hidden", value: -1, icon: faEyeSlash },
                { text: "Visible", value: 1, icon: faEye },
              ]}
              onChange={setVisibilityFilter}
            />
            <FilterButton
              name="resolve"
              icon={faEyeLowVision}
              option={[
                { text: "All", value: 0, icon: faList },
                { text: "Unresolved", value: -1, icon: faCircle },
                { text: "Resolved", value: 1, icon: faCheck },
              ]}
              onChange={setResolvedFilter}
            />

            <FilterButton
              name="Reports"
              icon={faEyeLowVision}
              option={[
                { text: "All", value: 0, icon: faList },
                { text: "Ascending", value: -1, icon: faArrowUp19 },
                { text: "Descending", value: 1, icon: faArrowDown19 },
              ]}
              onChange={setReportSort}
            />

            <FilterButton
              name="Approved"
              icon={faEyeLowVision}
              option={[
                { text: "All", value: 0, icon: faList },
                { text: "Ascending", value: -1, icon: faArrowUp19 },
                { text: "Descending", value: 1, icon: faArrowDown19 },
              ]}
              onChange={setApprovedSort}
            />
            <FilterButton
              name="Pending"
              icon={faEyeLowVision}
              option={[
                { text: "All", value: 0, icon: faList },
                { text: "Ascending", value: -1, icon: faArrowUp19 },
                { text: "Descending", value: 1, icon: faArrowDown19 },
              ]}
              onChange={setPendingSort}
            />
          </div>

          <div className="static">
            <CategoryBar
              selected={selectedCategories}
              onCategoriesChange={(ct: Category[]) => setSelectedCategories(ct)}
            />
          </div>

          <div className="flex flex-col panel gap-2 ">
            <div className="panel_2 font-mono">{reportPosts?.counts} posts</div>
            <div className="bg-secondary-1 rounded">
              <MasonryLayout
                height={"fit-content"}
                items={reportPosts?.reports || []}
                isLoading={isLoading}
                holder={(item) => (
                  <div
                    className="flex flex-col gap-1 p-1 rounded-md  bg-primary/50 hover:bg-primary/80 cursor-pointer"
                    onClick={() =>
                      router.push(`/admin/reports/posts/${item._id}`)
                    }
                  >
                    <FontAwesomeIcon
                      icon={item.reportTarget.isDeleted ? faEyeSlash : faEye}
                    />
                    <PostProps post={item.reportTarget} />
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
            <Pagination
              limit={LIMIT}
              count={reportPosts?.counts || 0}
              current={page}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
