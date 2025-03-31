"use client";
import React, { useContext, useEffect, useState } from "react";
import Feed from "@components/UI/Layout/Feed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faComment,
  faLineChart,
  faLinesLeaning,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { User } from "@lib/types";
import { blockUser, fetchUserWithId } from "@actions/accountActions";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@lib/firebase";
import { getSession, useSession } from "next-auth/react";
import { ChatContext } from "@components/UI/Layout/Nav";
import toastError, { confirm } from "@components/Notification/Toaster";
import { useRouter } from "next/navigation";
import PopupButton from "@components/Input/PopupButton";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import CustomImage from "@components/UI/Image/Image";
import MultipleOptionsButton from "@components/Input/MultipleOptionsButton";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { startChat } from "@lib/Chat/chat";
import {
  fetchUserFollowers,
  fetchUserFollowing,
  checkFollowState,
  followUser,
} from "@actions/followsActions";
import UserStatBar from "@components/UI/Profile/UserStatBar";
import UserInteractionBar from "@components/UI/Profile/UserInteractionBar";
import UserPostFeed from "@components/UI/Profile/UserPostFeed";

export default function UserProfile({ params }: { params: { id: string } }) {
  const { data: session, status, update } = useSession();
  const [isBlocked, setIsBlocked] = useState<boolean>(false); //from the other user
  const [blocked, setBlocked] = useState<boolean>(false); //us blocking the other user
  const [interactFlag, setInteractFlag] = useState(true);

  const [user, setUser] = useState<User | null>({
    _id: "",
    username: "",
    image: "",
    bio: "",
  });

  const fetchUser = async () => {
    try {
      const data = await fetchUserWithId(params.id);
      if (session?.user?.id) {
        const blockedByUser = !!(
          data.blocked &&
          data.blocked.find((userId: string) => userId === session?.user.id)
        );
        const blockedUser = !!(
          session?.user.blocked &&
          session?.user.blocked.find((userId) => userId === data._id)
        );
        setIsBlocked(blockedByUser);
        setBlocked(blockedUser);
        if (blockedByUser || blockedUser) {
          setUser(null);
        } else if (JSON.stringify(data) !== JSON.stringify(user)) {
          setUser(data);
        }
      } else if (JSON.stringify(data) !== JSON.stringify(user)) {
        setUser(data);
      }
    } catch (error) {
      console.log("Failed to fetch for user info");
    }
  };
  useEffect(() => {
    if (status !== "loading") {
      fetchUser();
    }
  }, [params.id, session]);

  useEffect(() => {
    const storeUser = localStorage.getItem("user");
    if (storeUser && JSON.parse(storeUser)._id === params.id) {
      const user = JSON.parse(storeUser);
      const blockedByUser = !!(
        user.blocked &&
        user.blocked.find((userId: string) => userId === session?.user.id)
      );
      const blockedUser = !!(
        session?.user.blocked &&
        session?.user.blocked.find((userId) => userId === user._id)
      );
      if (blockedByUser || blockedUser) {
        setIsBlocked(blockedByUser);
        setBlocked(blockedUser);
      } else {
        setUser(user);
      }
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <>
      {status === "loading" || blocked || isBlocked || !user?._id ? (
        <section className="User_Profile_Layout">
          <div className="User_Info_Container">
            <h1 className="User_Profile_Page_Username animate-pulse bg-secondary-2 rounded-lg text-transparent">
              <span className="opacity-0">UserInfo</span>
            </h1>
            <div className="User_Profile_Page_Picture_Container">
              <div className=" User_Profile_Page_Picture ">
                <div className="size-full animate-pulse bg-secondary-2" />
              </div>
              <div className="User_Profile_Page_Stat_Bar">
                <span className="flex flex-col items-center justify-start bg-secondary-2 rounded-lg animate-pulse text-transparent">
                  <span className="font-semibold">0</span>
                  UserStat
                </span>
                <span className="flex flex-col items-center justify-start bg-secondary-2 rounded-lg animate-pulse text-transparent">
                  <span className="font-semibold">0</span>
                  UserStat
                </span>
                <span className="flex flex-col items-center justify-start bg-secondary-2 rounded-lg animate-pulse text-transparent">
                  <span className="font-semibold">0</span>
                  UserStat
                </span>
              </div>
            </div>

            <div className="User_Profile_Page_Fullname text-transparent bg-secondary-2 rounded-lg animate-pulse ">
              UserInfoLong
            </div>
            <div className="User_Profile_Page_Bio text-transparent bg-secondary-2 rounded-lg animate-pulse">
              UserInfo
            </div>

            <div className="User_Profile_Page_Interactive_Bar">
              <div className="rounded-lg bg-accent animate-pulse p-2 ">
                <span className="opacity-0">User Button</span>
              </div>
              <div className="rounded-lg bg-accent animate-pulse p-2 ">
                <span className="opacity-0">User Button</span>
              </div>
            </div>
          </div>

          <div className="shadow-inner bg-secondary-2/20 grow h-full w-full rounded-xl">
            {isBlocked || blocked ? (
              <div className="text-4xl font-semibold text-center">
                You're not allowed to view this user profile
              </div>
            ) : (
              <div className="h-[500px]"></div>
            )}
          </div>
        </section>
      ) : (
        <section className="User_Profile_Layout">
          <div className="User_Info_Container">
            <h1 className="User_Profile_Page_Username">{user?.username}</h1>
            <div className="User_Profile_Page_Picture_Container">
              <div className=" User_Profile_Page_Picture ">
                {user?.image ? (
                  <CustomImage
                    src={user?.image}
                    alt={"profile picture"}
                    className="size-full"
                    width={0}
                    height={0}
                    style={{ objectFit: "cover" }}
                    transformation={[{ quality: 80 }]}
                    lqip={{ active: true, quality: 20 }}
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="grow" />
                )}
              </div>
              <UserStatBar userId={params.id} updateFlag={interactFlag} />
            </div>

            <h2 className="User_Profile_Page_Fullname">{user?.fullname}</h2>
            <h2 className="User_Profile_Page_Bio">{user?.bio}</h2>
            <UserInteractionBar
              user={user}
              updateCallback={() => setInteractFlag((prev) => !prev)}
            />
          </div>

          <UserPostFeed userId={user._id || ""} />
        </section>
      )}
    </>
  );
}
