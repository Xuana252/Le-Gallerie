import {
  fetchUserFollowers,
  fetchUserFollowing,
  followUser,
} from "@actions/followsActions";
import PopupButton from "@components/Input/PopupButton";
import { User } from "@lib/types";
import { useSession } from "@node_modules/next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserProfileIcon from "./UserProfileIcon";
import { confirm } from "@components/Notification/Toaster";
import { fetchUserFriends } from "@actions/friendActions";

export default function UserStatBar({
  userId,
  updateFlag,
}: {
  userId: string;
  updateFlag: boolean;
}) {
  const TIME_OUT_TIME = 2000;
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [friends, setFriends] = useState<User[]>();
  const [followers, setFollowers] = useState<User[]>();
  const [following, setFollowing] = useState<User[]>();
  const [curUserFriends, setCurUserFriends] = useState<User[]>();
  const [curUserFollowers, setCurUserFollowers] = useState<User[]>();
  const [curUserFollowing, setCurUserFollowing] = useState<User[]>();
  const [followTimeOut, setFollowTimeout] = useState(false);
  const [followType, setFollowType] = useState<
    "Followers" | "Following" | "Friends"
  >("Followers");

  const fetchFriends = async () => {
    const response = await fetchUserFriends(userId);
    if (session?.user.id) {
      const curUserFriends = await fetchUserFriends(session.user.id);
      setCurUserFriends(curUserFriends?.users);
    }
    setFriends(response?.users);
  };

  const fetchFollowers = async () => {
    const response = await fetchUserFollowers(userId);
    if (session?.user.id) {
      const curUserFollowers = await fetchUserFollowers(session.user.id);
      setCurUserFollowers(curUserFollowers?.users);
    }
    setFollowers(response?.users);
  };

  const fetchFollowing = async () => {
    const response = await fetchUserFollowing(userId);
    if (session?.user.id) {
      const curUserFollowing = await fetchUserFollowing(session.user.id);
      setCurUserFollowing(curUserFollowing?.users);
    }
    setFollowing(response?.users);
  };

  const handleFollow = async (user: User) => {
    if (followTimeOut) return;

    if (!session?.user.id) {
      const loginConfirm = await confirm("you need to login first");
      if (loginConfirm) {
        router.push("/sign-in");
      }
      return;
    }

    setCurUserFollowing((prev) => [...(prev ? prev : []), user]);
    setFollowTimeout(true);

    try {
      await followUser(user._id, session.user.id);
    } catch (error) {
      console.log("Failed to update user follows");
    }
    setTimeout(() => {
      setFollowTimeout(false);
    }, TIME_OUT_TIME);
  };

  const handleUnfollow = async (user: User) => {
    if (!session?.user.id || followTimeOut) return;

    const unfollowConfirmation = await confirm(
      `You do want to unfollow ${user.username}?`
    );
    if (unfollowConfirmation) {
      setCurUserFollowing((prev) =>
        prev ? prev.filter((u) => u._id !== user._id) : []
      );
    } else {
      return;
    }
    setFollowTimeout(true);
    try {
      await followUser(user._id, session.user.id);
    } catch (error) {
      console.log("Failed to update user follows");
    }
    setTimeout(() => {
      setFollowTimeout(false);
    }, TIME_OUT_TIME);
  };

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
    fetchFriends();
  }, [userId, updateFlag]);

  const FollowList = () => {
    const list =
      followType === "Followers"
        ? followers
        : followType === "Following"
        ? following
        : followType === "Friends"
        ? friends
        : [];

    return (
      <div className="text-base mt-2">
        <div className="grid grid-cols-3">
          <button
            name="Following"
            onClick={() => setFollowType("Following")}
            className={`font-bold ${
              followType === "Following" &&
              "bg-secondary-1 mb-[-10px] text-primary rounded-lg pt-1 pb-3 font-bold"
            }`}
          >
            Following
          </button>
          <button
            name="Followers"
            onClick={() => setFollowType("Followers")}
            className={`font-bold ${
              followType === "Followers" &&
              "bg-secondary-1 mb-[-10px] text-primary rounded-lg pt-1 pb-3 font-bold"
            }`}
          >
            Followers
          </button>
          <button
            name="Friends"
            onClick={() => setFollowType("Friends")}
            className={`font-bold ${
              followType === "Friends" &&
              "bg-secondary-1 mb-[-10px] text-primary rounded-lg pt-1 pb-3 font-bold"
            }`}
          >
            Friends
          </button>
        </div>
        <ul className={`bg-secondary-1 w-[300px] h-[400px] sm:w-[400px] sm:h-[500px] rounded-lg py-4 px-2 ${followType==="Friends"?"grid grid-cols-2":"flex flex-col"} gap-2`}>
          {list?.map((item) => (
            <li
              key={item._id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-2 h-fit w-full border-l-4 border-accent pl-1 rounded-md"
            >
           
                <UserProfileIcon user={item} />
       
              <p className="font-bold break-all whitespace-normal">
                {item.username}
              </p>
              {item._id === session?.user.id || followType==="Friends" ? null : curUserFollowing?.find(
                  (follow) => follow._id === item._id
                ) ? (
                <button
                  className="Button_variant_1 ml-auto"
                  onClick={() => handleUnfollow(item)}
                  disabled={followTimeOut}
                >
                  Unfollow
                </button>
              ) : curUserFollowers?.find(
                  (follow) => follow._id === item._id
                ) ? (
                <button
                  className="Button_variant_1 ml-auto"
                  onClick={() => handleFollow(item)}
                  disabled={followTimeOut}
                >
                  Follow back
                </button>
              ) : (
                <button
                  className="Button_variant_1 ml-auto"
                  onClick={() => handleFollow(item)}
                  disabled={followTimeOut}
                >
                  Follow
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <div className="User_Profile_Page_Stat_Bar">
      <PopupButton popupItem={<FollowList />}>
        <h1
          className="flex flex-col items-center justify-start"
          onClick={() => setFollowType("Followers")}
        >
          {followers ? (
            <span className="font-bold">{followers.length || 0}</span>
          ) : (
            <span className=" w-6 rounded-lg animate-pulse bg-accent">
              <div className="opacity-0">9999</div>
            </span>
          )}
          Followers
        </h1>
      </PopupButton>
      <PopupButton popupItem={<FollowList />}>
        <h1
          className="flex flex-col items-center justify-start"
          onClick={() => setFollowType("Following")}
        >
          {following ? (
            <span className="font-bold">{following.length || 0}</span>
          ) : (
            <span className=" w-6 rounded-lg animate-pulse bg-accent">
              <div className="opacity-0">9999</div>
            </span>
          )}
          Following
        </h1>
      </PopupButton>
      <PopupButton popupItem={<FollowList />}>
        <h1
          className="flex flex-col items-center justify-start"
          onClick={() => setFollowType("Friends")}
        >
          {friends ? (
            <span className="font-bold">{friends.length || 0}</span>
          ) : (
            <span className=" w-6 rounded-lg animate-pulse bg-accent">
              <div className="opacity-0">9999</div>
            </span>
          )}
          Friends
        </h1>
      </PopupButton>
    </div>
  );
}
