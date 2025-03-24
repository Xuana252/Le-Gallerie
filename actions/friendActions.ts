"use server";

import { FriendState } from "@enum/friendStateEnum";

export const checkFriendState = async (userId1: string, userId2: string) => {
  try {
    const response = await fetch(
      `${process.env.DOMAIN_NAME}/api/users/${userId1}/friends/${userId2}`
    );
    const data = await response.json();
    if (response.ok) return data.state ?? FriendState.UNFRIEND;
  } catch (error) {
    console.log(error);
    return FriendState.UNFRIEND;
  }
};

export const sendFriendRequest = async (userId1: string, userId2: string) => {
  try {
    await fetch(`${process.env.DOMAIN_NAME}/api/friends`, {
      method: "PATCH",
      body: JSON.stringify({ userId1: userId1, userId2: userId2 }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const removeFriendRequest = async (userId1: string, userId2: string) => {
  try {
    await fetch(`${process.env.DOMAIN_NAME}/api/friends`, {
      method: "DELETE",
      body: JSON.stringify({ userId1: userId1, userId2: userId2 }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchFriendRequest = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.DOMAIN_NAME}/api/user/${userId}/friends/request`
    );
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchUserFriends = async (userId:string) => {
  try {
    const response = await fetch(
      `${process.env.DOMAIN_NAME}/api/users/${userId}/friends`
    );
    const data = await response.json();
    if (response.ok) return { users: data.users, length: data.length };
  } catch (error) {
    console.log("Failed to check user followed state", error);
    return null;
  }
}
