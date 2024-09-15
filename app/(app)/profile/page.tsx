"use client";
import React, { useEffect, useState } from "react";
import Image from "@components/UI/Image";
import Feed from "@components/UI/Feed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import PopupButton from "@components/Input/PopupButton";
import {
  fetchUserFollowers,
  fetchUserFollowing,
  followUser,
} from "@server/accountActions";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import { User } from "@lib/types";
import { confirm } from "@components/Notification/Toaster";
import ButtonWithTimeOut from "@components/Input/ButtonWithTimeOut";
import CustomImage from "@components/UI/Image";

export default function MyProfile() {
  const TIME_OUT_TIME = 1000;
  const { data: session,update } = useSession();
  const [followers, setFollowers] = useState<User[]>();
  const [followerCount, setFollowersCount] = useState<number>(0);
  const [followTimeOut,setFollowTimeout] = useState(false)
  const [following, setFollowing] = useState<User[]>();
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);
  const [followType, setFollowType] = useState<"Followers" | "Following">(
    "Followers"
  );

  const fetchFollowers = async () => {
    const response = await fetchUserFollowers(session?.user.id || "");
    setFollowers(response?.users || []);
    setFollowersCount(response?.users.length || 0);
  };
  const fetchFollowing = async () => {
    const response = await fetchUserFollowing(session?.user.id || "");
    setFollowing(response?.users || []);
    setFollowingCount(response?.users.length || 0);
  };

  const handleUnfollow = async (user: User) => {
    if (!session?.user.id||followTimeOut) return;
    setFollowTimeout(true)
    const unfollowConfirmation = await confirm(
      `You do want to unfollow ${user.username}?`
    );
    if (unfollowConfirmation) {
      setFollowingCount((c) => c - 1);
      setFollowing(prev=> prev ? prev.filter((u) => u._id !== user._id) : [])
    } else {
      return;
    }
    try {
      await followUser(user._id, session.user.id);
    } catch (error) {
      console.log("Failed to update user follows");
    }
    setTimeout(()=>{
      setFollowTimeout(false)
    },TIME_OUT_TIME)
  };

  const handleFollow = async (user: User) => {
    if (!session?.user.id||followTimeOut) return;
    setFollowTimeout(true)

    setFollowingCount((c) => c + 1);
    setFollowing((prev) => [...prev?prev:[], user])

    try {
      await followUser(user._id, session.user.id);
    } catch (error) {
      console.log("Failed to update user follows");
    }
    setTimeout(()=>{
      setFollowTimeout(false)
    },TIME_OUT_TIME)
  };


  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
  }, [session?.user.id]);

  const FollowList = () => {
    const list = (followType === "Followers" ? followers : following) || [];
    return (
      <div className="text-base">
        <div className="grid grid-cols-2">
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
        </div>
        <ul className="bg-secondary-1 w-[300px] h-[400px] sm:w-[400px] sm:h-[500px] rounded-lg py-4 px-2 flex flex-col gap-2">
          {list.map((item) => (
            <div key={item._id} className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <UserProfileIcon currentUser={false} user={item} />
                {item.username}
              </label>
              {followType === "Following" ||
              following?.find((follow) => follow._id === item._id) ? (
                <button
                  className="Button_variant_1 ml-auto"
                  onClick={()=>handleUnfollow(item)}
                  disabled={followTimeOut}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="Button_variant_1 ml-auto"
                  onClick={()=>handleFollow(item)}
                  disabled={followTimeOut}
                >
                  Follow back
                </button>
              )}
            </div>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section className="text-accent">
      <div className="User_Profile_Layout">
        <div className="relative">
          <div className="User_Profile_Page_Picture ">
            {session?.user?.image ? (
             <CustomImage
             src={session.user.image}
             alt={'profile picture'}
             className='size-full'
             width={0}
             height={0}
             style={{ objectFit: "cover" }}
             transformation={[{quality:80}]}
             lqip={{active:true,quality:20}}
             />
            ) : (
              <FontAwesomeIcon icon={faUser} size="xl" className="size-full" />
            )}
          </div>
          <Link href={"/profile/edit"}>
            <button className="Icon_small absolute border-[4px] border-primary right-1 bottom-1 bg-secondary-1">
              <FontAwesomeIcon icon={faPen} />
            </button>
          </Link>
        </div>
        <div>
          <h1 className="User_Profile_Page_Username">{session?.user?.name}</h1>
          <br />
          <h2 className="User_Profile_Page_Bio">{session?.user.bio}</h2>
        </div>
        <div className="User_Profile_Page_Stat_Bar">
          <PopupButton popupItem={<FollowList />}>
            <h1
              className="flex flex-col items-center justify-start"
              onClick={() => setFollowType("Followers")}
            >
              <span className="font-semibold">{followerCount}</span>
              Followers
            </h1>
          </PopupButton>
          <PopupButton popupItem={<FollowList />}>
            <h1
              className="flex flex-col items-center justify-start"
              onClick={() => setFollowType("Following")}
            >
              <span className="font-semibold">{followingCount}</span>
              Following
            </h1>
          </PopupButton>
          <h1 className="flex flex-col items-center justify-start">
            <span className="font-semibold">{postCount}</span>Posts
          </h1>
        </div>
      </div>
      <h1 className="text-center text-xl my-4">See your posts</h1>
      {session?.user.id && (
         <div className="shadow-inner bg-secondary-2/20 rounded-xl">
        <Feed userIdFilter={session.user.id} showCateBar={false} setPostCount={setPostCount}></Feed>
        </div>
      )}
    </section>
  );
}
