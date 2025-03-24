"use server";

import { User } from "@lib/types";
import { headers } from "next/headers";


export const signUp = async (user: any) => {
  const response = await fetch(`${process.env.DOMAIN_NAME}/api/users/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (response.ok) {
    return { status: true, message: "account created" };
  }
  return { status: false, message: data.message };
};

export const updateUser = async (user: User) => {
  const response = await fetch(
    `${process.env.DOMAIN_NAME}/api/users/${user._id}`,
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
  const response = await fetch(`${process.env.DOMAIN_NAME}/api/users/${user}`);
  const data = await response.json();
  return data;
};



export const blockUser = async (user: string, blockUser: string) => {
  try {
    const response = await fetch(
      `${process.env.DOMAIN_NAME}/api/users/${user}/blocks/${blockUser}`,
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
      `${process.env.DOMAIN_NAME}/api/users/${user}/blocks`
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
      `${process.env.DOMAIN_NAME}/api/users/verify/${email}`
    );
    const data = await response.json();
    if (response.ok) return { id: data.id, code: data.code };
  } catch (error) {
    console.log("Failed to send verification", error);
    return { id: "", code: "" };
  }
};

export const changeUserPassword = async (user: string, newpassword: string) => {
  const response = await fetch(
    `${process.env.DOMAIN_NAME}/api/users/${user}/change-password`,
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

export const fetchUsers = async (searchText:string) => {
    const response = await fetch(
      `${process.env.DOMAIN_NAME}/api/users?searchText=${searchText}`,{
        headers: new Headers(headers())
      }
    );
    const data = await response.json();
    if (response.ok) return {users:data.users, counts:data.counts};
    return {users:[],counts:0}
}
