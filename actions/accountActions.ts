"use server";

import { UserRole } from "@enum/userRolesEnum";
import { User } from "@lib/types";
import { headers } from "next/headers";

export const signUp = async (user: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );
  const data = await response.json();
  if (response.ok) {
    return { status: true, message: "account created" };
  }
  return { status: false, message: data.message };
};

export const updateUser = async (user: User) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user._id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );
  if (response.ok) return true;
  return false;
};

export const fetchUserWithId = async (user: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}`,
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

export const blockUser = async (user: string, blockUser: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/blocks/${blockUser}`,
      {
        method: "PATCH",
        body: JSON.stringify({}),
      }
    );
    if (response.ok) return true;
    return false;
  } catch (error) {
    console.log("Failed to change block state", error);
    return false;
  }
};

export const fetchUserBlockedList = async (user: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/blocks`
    );
    const data = await response.json();
    if (response.ok) return data;
  } catch (error) {
    console.log("Failed to check user followed state", error);
    return null;
  }
};

export const sendVerificationCode = async (email: String) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/verify/${email}`
    );
    const data = await response.json();
    if (response.ok) return { id: data.id, code: data.code };
  } catch (error) {
    console.log("Failed to send verification", error);
    return { id: "", code: "" };
  }
};

export const checkExistingEmail = async (email: String) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/verify/${email}/exist`
    );
    if (response.ok) return true;
    return false;
  } catch (error) {
    console.log("Failed to check existing email", error);
    return false;
  }
};

export const changeUserPassword = async (user: string, newpassword: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/change-password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: newpassword,
      }),
    }
  );
  if (response.ok) return true;
  return false;
};

export const fetchUsers = async (
  limit: number,
  currentPage: number,
  searchText: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users?searchText=${searchText}&page=${currentPage}&limit=${limit}`,
    {
      headers: new Headers(headers()),
    }
  );
  const data = await response.json();
  if (response.ok) return { users: data.users, counts: data.counts };
  return { users: [], counts: 0 };
};

export const fetchSystemUsers = async (
  limit: number,
  currentPage: number,
  searchText: string,
  nameSort: -1 | 0 | 1,
  joinSort: -1 | 0 | 1,
  roleFilter: UserRole,
  startDate: Date | string,
  endDate: Date | string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/admin/users/search?searchText=${searchText}&page=${currentPage}&limit=${limit}&nameSort=${nameSort}&joinSort=${joinSort}&roleFilter=${roleFilter}&startDate=${startDate}&endDate=${endDate}`,
    {
      headers: new Headers(headers()),
    }
  );
  const data = await response.json();
  if (response.ok) return { users: data.users, counts: data.counts };
  return { users: [], counts: 0 };
};

export const fetchBannedUsers = async (
  limit: number,
  currentPage: number,
  searchText: string,
  nameSort: -1 | 0 | 1,
  joinSort: -1 | 0 | 1,
  roleFilter: UserRole,
  startDate: Date | string,
  endDate: Date | string,
  startDateBan: Date | string,
  endDateBan: Date | string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/admin/users/banned?searchText=${searchText}&page=${currentPage}&limit=${limit}&nameSort=${nameSort}&joinSort=${joinSort}&roleFilter=${roleFilter}&startDate=${startDate}&endDate=${endDate}&startDateBan=${startDateBan}&endDateBan=${endDateBan}`,
    {
      headers: new Headers(headers()),
    }
  );
  const data = await response.json();
  if (response.ok) return { users: data.users, counts: data.counts };
  return { users: [], counts: 0 };
};

export const fetchSystemUserData = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/admin/users`,
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

export const updateUserBanState = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${userId}/ban`,
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
export const updateUserCreatorState = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${userId}/creator`,
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
