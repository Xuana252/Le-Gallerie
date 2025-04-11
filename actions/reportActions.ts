"use server";
import { Report } from "@lib/types";
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

export const fetchCommentReport = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/comment`
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

export const fetchCommentReportId = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/${id}`
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

export const fetchPostReport = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/post`
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

export const fetchPostReportId = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/post/${id}`
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

export const fetchUserReport = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/user`
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

export const fetchUserReportId = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/user/${id}`
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

export const fetchUserReportMade = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/reports/${id}/made`
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
