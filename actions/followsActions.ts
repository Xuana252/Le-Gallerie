"use server";
export const followUser = async (user: string, follower: string) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/follows`, {
      method: "PATCH",
      body: JSON.stringify({ userId: follower }),
    });
  } catch (error) {
    console.error("Failed to update user follower", error);
  }
};

export const checkFollowState = async (user: string, follower: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${follower}/follows/${user}`
    );
    const data = await response.json();
    if (response.ok) return data.followed ?? false;
  } catch (error) {
    console.log("Failed to check user followed state", error);
    return false;
  }
};

export const fetchUserFollowers = async (user: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/follows/followers`
    );
    const data = await response.json();
    if (response.ok) return { users: data.users, length: data.length };
  } catch (error) {
    console.log("Failed to check user followed state", error);
    return null;
  }
};

export const fetchUserFollowing = async (user: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/users/${user}/follows`
    );
    const data = await response.json();
    if (response.ok) return { users: data.users, length: data.length };
  } catch (error) {
    console.log("Failed to check user followed state", error);
    return null;
  }
};
