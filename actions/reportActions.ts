"use server";
import { Category, Report } from "@lib/types";
import { headers, cookies } from "next/headers";

export const fetchReport = async (
  limit: number,
  currentPage: number,
  searchText: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports?searchText=${searchText}&page=${currentPage}&limit=${limit}`,
      {
        headers: new Headers(headers()),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return { reports: data.reports, counts: data.counts };
    }
    return { reports: [], counts: 0 };
  } catch (error) {
    console.log(error);
    return { reports: [], counts: 0 };
  }
};

export const updateReport = async (report: Report) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports`,
      {
        method: "PATCH",
        body: JSON.stringify(report),
      }
    );

    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const fetchCommentReport = async (
  currentPage: number,
  limit: number,
  searchText: string,
  resolvedFilter: -1 | 0 | 1,
  reportSort: -1 | 0 | 1,
  approvedSort: -1 | 0 | 1,
  pendingSort: -1 | 0 | 1
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/comment?page=${currentPage}&limit=${limit}&searchText=${searchText}&resolvedFilter=${resolvedFilter}&reportSort=${reportSort}&approvedSort=${approvedSort}&pendingSort=${pendingSort}`,
      {
        headers: new Headers(headers()),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return { reports: data.reports, counts: data.counts };
    }
    return { reports: [], counts: 0 };
  } catch (error) {
    console.log(error);
    return { reports: [], counts: 0 };
  }
};

export const fetchCommentReportId = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/comment/${id}`,
      {
        headers: new Headers(headers()),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchPostReport = async (
  currentPage: number,
  limit: number,
  searchText: string,
  categoryFilter: Category[],
  visibilityFilter: -1 | 0 | 1,
  resolvedFilter: -1 | 0 | 1,
  reportSort: -1 | 0 | 1,
  approvedSort: -1 | 0 | 1,
  pendingSort: -1 | 0 | 1
) => {
  const categoryIds = categoryFilter.map((category) => category._id).join(",");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/post?page=${currentPage}&limit=${limit}&searchText=${searchText}&categoryIds=${categoryIds}&visibilityFilter=${visibilityFilter}&resolvedFilter=${resolvedFilter}&reportSort=${reportSort}&approvedSort=${approvedSort}&pendingSort=${pendingSort}`,
      {
        headers: new Headers(headers()),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return { reports: data.reports, counts: data.counts };
    }
    return { reports: [], counts: 0 };
  } catch (error) {
    console.log(error);
    return { reports: [], counts: 0 };
  }
};

export const fetchPostReportId = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/post/${id}`,
      {
        headers: new Headers(headers()),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchUserReport = async (
  currentPage: number,
  limit: number,
  searchText: string,
  resolvedFilter: -1 | 0 | 1,
  reportSort: -1 | 0 | 1,
  approvedSort: -1 | 0 | 1,
  pendingSort: -1 | 0 | 1
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/user?page=${currentPage}&limit=${limit}&searchText=${searchText}&resolvedFilter=${resolvedFilter}&reportSort=${reportSort}&approvedSort=${approvedSort}&pendingSort=${pendingSort}`,
      {
        headers: new Headers(headers()),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return { reports: data.reports, counts: data.counts };
    }
    return { reports: [], counts: 0 };
  } catch (error) {
    console.log(error);
    return { reports: [], counts: 0 };
  }
};

export const fetchUserReportId = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/user/${id}`,
      {
        headers: new Headers(headers()),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return { reports: data.reports, counts: data.counts };
    }
    return { reports: [], counts: 0 };
  } catch (error) {
    console.log(error);
    return { reports: [], counts: 0 };
  }
};

export const fetchUsersReportId = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/user/${id}/made`,
      {
        headers: new Headers(headers()),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return { reports: data.reports, counts: data.counts };
    }
    return { reports: [], counts: 0 };
  } catch (error) {
    console.log(error);
    return { reports: [], counts: 0 };
  }
};

export const fetchSystemReportData = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/admin/reports`,
    {
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
};

export const approveReport = async (reportIds: string[]) => {
  const params = new URLSearchParams();
  reportIds.forEach((id) => params.append("ids", id));

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_DOMAIN_NAME
    }/api/reports/approve?${params.toString()}`,
    {
      method: "PATCH",
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    return true;
  }
  return false;
};

export const deleteReport = async (reportIds: string[]) => {
  const params = new URLSearchParams();
  reportIds.forEach((id) => params.append("ids", id));

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_DOMAIN_NAME
    }/api/reports/delete?${params.toString()}`,
    {
      method: "DELETE",
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    return true;
  }
  return false;
};
