import { fetchUserWithId } from "@actions/accountActions";
import { Comment, Post, Report, User } from "@lib/types";
import React, { useEffect, useMemo, useState } from "react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faArrowDownAZ,
  faArrowDownZA,
  faArrowUpAZ,
  faBoxArchive,
  faCalendar,
  faCameraRetro,
  faCheck,
  faClose,
  faHammer,
  faIdBadge,
  faIdCard,
  faList,
  faSquare,
  faSquareCheck,
  faTrash,
  IconDefinition,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { UserRole } from "@enum/userRolesEnum";
import {
  approveReport,
  deleteReport,
  fetchCommentReportId,
  fetchPostReportId,
  fetchUserReportId,
  fetchUsersReportId,
} from "@actions/reportActions";

import Link from "@node_modules/next/link";
import { renderRole } from "@lib/Admin/render";
import ReportCard from "./ReportCard";
import FilterButton from "@components/Input/FilterButton";
import { faCircle } from "@node_modules/@fortawesome/free-regular-svg-icons";
import DateTimePicker from "@components/Input/DateTimePicker";
import { formatDateFromString } from "@lib/dateFormat";
import SubmitButton from "@components/Input/SubmitButton";
import { SubmitButtonState } from "@enum/submitButtonState";
import { confirm, toastMessage } from "@components/Notification/Toaster";
import MultipleChoiceButton from "@components/Input/MultipleChoiceButton";
import { reportIcons, ReportPrompt } from "@enum/reportPromptEnum";

export default function ReportTab({
  target,
  type,
}: {
  target: Post | Comment | null;
  type: "Post" | "Comment";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report[]>([]);
  const [stateFilter, setStateFilter] = useState<-1 | 0 | 1>(0);
  const [createdAtSort, setCreatedAtSort] = useState<-1 | 0 | 1>(0);
  const [startCreatedAt, setStartDateCreatedAt] = useState("");
  const [endCreatedAt, setEndDateCreatedAt] = useState("");
  const [reportIds, setReportIds] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [prompt, setPrompt] = useState<ReportPrompt[]>([]);
  const [approveState, setApproveState] = useState<SubmitButtonState>(
    SubmitButtonState.IDLE
  );
  const [rejectState, setRejectState] = useState<SubmitButtonState>(
    SubmitButtonState.IDLE
  );

  useEffect(() => {
    setReportIds([]);
  }, [isSelecting]);

  const handleReject = async () => {
    const selectedReportsIds = visibleReports
      .filter((report) => reportIds.includes(report._id))
      .map((report) => report._id);

    if (selectedReportsIds.length === 0) {
      toastMessage("No reports selected for rejection");
      return;
    }

    const result = await confirm("Do you want to delete selected reports? ");

    if (!result) return;

    setRejectState(SubmitButtonState.PROCESSING);
    try {
      const res = await deleteReport(selectedReportsIds);
      if (res) {
        setRejectState(SubmitButtonState.SUCCESS);
        toastMessage("Reports Rejected");

        setReport((prevReports) =>
          prevReports.filter(
            (report) => !selectedReportsIds.includes(report._id)
          )
        );
      }
    } catch (error) {
      toastMessage("Failed to reject ");
      setRejectState(SubmitButtonState.FAILED);
    }
  };

  const handleApprove = async () => {
    const selectedReportsIds = visibleReports
      .filter((report) => reportIds.includes(report._id))
      .map((report) => report._id);

    if (selectedReportsIds.length === 0) {
      toastMessage("No reports selected for approval");
      return;
    }

    const result = await confirm("Do you want to approve selected reports?");

    if (!result) return;

    setApproveState(SubmitButtonState.PROCESSING);
    try {
      const res = await approveReport(selectedReportsIds);
      if (res) {
        setApproveState(SubmitButtonState.SUCCESS);
        toastMessage("Reports Approved");

        setReport((prevReports) =>
          prevReports.map((report) =>
            selectedReportsIds.includes(report._id)
              ? { ...report, state: true }
              : report
          )
        );
      }
    } catch (error) {
      toastMessage("Failed to approve ");
      setApproveState(SubmitButtonState.FAILED);
    }
  };

  const handleSelectAll = () => {
    const visibleIds = visibleReports.map((r) => r._id);
    const areAllSelected = visibleIds.every((id) => reportIds.includes(id));

    if (areAllSelected) {
      // Unselect all visible
      setReportIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      // Add all visible (merge with prev)
      setReportIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleAddReportId = (id: string) => {
    setReportIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((reportId) => reportId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const fetchReport = async (id: string) => {
    setIsLoading(true);
    const res =
      type === "Post"
        ? await fetchPostReportId(id)
        : type === "Comment"
        ? await fetchCommentReportId(id)
        : { reports: [], counts: 0 };

    setReport(res.reports);
    setIsLoading(false);
  };

  useEffect(() => {
    target?._id && fetchReport(target._id);
  }, [target?._id]);

  const visibleReports = useMemo(() => {
    if (!Array.isArray(report)) return [];

    return report
      .filter((r) => {
        const reportDate = new Date(r.createdAt?.toString() || "");
        const start = startCreatedAt
          ? new Date(formatDateFromString(startCreatedAt))
          : null;
        const end = endCreatedAt
          ? new Date(formatDateFromString(endCreatedAt))
          : null;

        if (prompt.length > 0 && !prompt.some((p) => r.content.includes(p)))
          return false;

        const inDateRange =
          (!start || reportDate >= start) && (!end || reportDate <= end);

        if (!inDateRange) return false;

        if (stateFilter === 0) return true;
        if (stateFilter === 1) return r.state === true;
        if (stateFilter === -1) return r.state === false;

        return true;
      })
      .sort((a, b) => {
        if (createdAtSort === 0) return 0;
        const dateA = new Date(a.createdAt?.toString() || "");
        const dateB = new Date(b.createdAt?.toString() || "");
        return createdAtSort === 1
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });
  }, [
    report,
    stateFilter,
    createdAtSort,
    startCreatedAt,
    endCreatedAt,
    prompt,
  ]);

  return (
    <div className="panel flex flex-col gap-2 grow">
      <div className="text-primary bg-accent rounded p-1 w-full flex flex-row gap-1 items-center ">
        {target?._id || "target id"}
      </div>
      <div className="flex flex-wrap items-center gap-2 panel_2 p-2">
        <span className="subtitle">Action</span>{" "}
        <div className="ml-auto flex flex-row text-sm items-center">
          {isSelecting && (
            <>
              {reportIds.length > 0 && visibleReports.length > 0 && (
                <>
                  <SubmitButton
                    state={rejectState}
                    changeState={setRejectState}
                    variant={"Button_variant_1_5"}
                    onClick={handleReject}
                  >
                    Reject <FontAwesomeIcon icon={faTrash} />
                  </SubmitButton>
                  <SubmitButton
                    state={approveState}
                    changeState={setApproveState}
                    variant={"Button_variant_1_5"}
                    onClick={handleApprove}
                  >
                    Approve <FontAwesomeIcon icon={faCheck} />
                  </SubmitButton>
                </>
              )}
              <button className="Button_variant_1_5" onClick={handleSelectAll}>
                Select All
              </button>
            </>
          )}
          <button
            className="Button_variant_1_5"
            onClick={() => setIsSelecting((prev) => !prev)}
          >
            {isSelecting ? "Unselect" : "Select"}
          </button>
        </div>
      </div>
      <div className="panel flex flex-wrap items-center gap-x-4 gap-2 ">
        <FilterButton
          name="state"
          icon={faCheck}
          option={[
            { text: "All", value: 0, icon: faList },
            { text: "Approved", value: 1, icon: faCheck },
            { text: "Pending", value: -1, icon: faCircle },
          ]}
          onChange={setStateFilter}
        />
        <FilterButton
          name="date"
          icon={faCalendar}
          option={[
            { text: "All", value: 0, icon: faList },
            { text: "Latest", value: 1, icon: faArrowDownAZ },
            { text: "Oldest", value: -1, icon: faArrowUpAZ },
          ]}
          onChange={setCreatedAtSort}
        />

        <MultipleChoiceButton
          name="Prompt"
          option={[
            ...Object.entries(ReportPrompt).map(([key, text]) => ({
              text: text,
              value: text,
              icon: reportIcons[key as keyof typeof ReportPrompt],
            })),
          ]}
          onChange={setPrompt}
        />

        <div className="flex grow flex-wrap p-1 items-center gap-2 justify-around rounded-md border-2 border-secondary-1/50 w-fit">
          <div className="opacity-60 font-bold">Create date:</div>
          <div className=" flex flex-wrap items-center gap-2">
            <span>from:</span>
            <DateTimePicker
              name={"start"}
              value={startCreatedAt}
              showName={false}
              onChange={(s) => setStartDateCreatedAt(s)}
            />
          </div>
          <div className=" flex flex-wrap items-center gap-2">
            <span>to:</span>
            <DateTimePicker
              name={"end"}
              value={endCreatedAt}
              showName={false}
              onChange={(s) => setEndDateCreatedAt(s)}
            />
          </div>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto bg-secondary-1 p-2 rounded-lg">
        {!isLoading && target ? (
          report?.length > 0 ? (
            visibleReports.map((reportItem, idx) =>
              isSelecting ? (
                <span
                  key={idx}
                  onClick={() => handleAddReportId(reportItem._id)}
                  className={`${
                    reportIds.includes(reportItem._id) ? "bg-accent/20" : ""
                  } p-1 rounded-md  cursor-pointer relative size-fit border-2 border-accent transition-all duration-200 ease-in-out flex flex-col gap-1 `}
                >
                  <div
                    className={`size-3 border-2 rounded-full border-accent ${
                      reportIds.includes(reportItem._id) && "bg-accent"
                    } transition-all duration-200 ease-in-out`}
                  ></div>
                  <span className="pointer-events-none size-fit">
                    <ReportCard report={reportItem} />
                  </span>
                </span>
              ) : (
                <ReportCard key={idx} report={reportItem} />
              )
            )
          ) : (
            <div className="size-full flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faBoxArchive} size="2xl" />
              <p>No report found:/</p>
            </div>
          )
        ) : (
          Array.from({ length: 10 }).map((_, index) => (
            <span
              key={index}
              className="rounded-lg  animate-pulse bg-secondary-2 grow min-w-[250px] min-h-[200px] "
            ></span>
          ))
        )}
      </ul>
    </div>
  );
}
