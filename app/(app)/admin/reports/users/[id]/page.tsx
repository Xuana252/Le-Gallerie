"use client";
import { fetchUserWithId } from "@actions/accountActions";
import InputBox from "@components/Input/InputBox";
import Feed from "@components/UI/Layout/Feed";
import MultiTabContainer from "@components/UI/Layout/MultiTabContainer";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import UserStatBar from "@components/UI/Profile/UserStatBar";
import UserReportTab from "@components/UI/Report/UserReportTab";
import UsersReportTab from "@components/UI/Report/UsersReportTab";
import { renderRole } from "@lib/Admin/render";
import { formatDate } from "@lib/dateFormat";
import { User } from "@lib/types";
import {
  faAt,
  faBirthdayCake,
  faBorderAll,
  faCalendar,
  faHeart,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function UserDetails({ params }: { params: { id: string } }) {
  const [userId, setUserId] = useState(params.id !== "userId" ? params.id : "");
  const [pendingText, setPendingText] = useState(
    params.id !== "userId" ? params.id : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setUserId(pendingText);
    }
  };

  const fetchUser = async () => {
    setIsLoading(true);
    const res = await fetchUserWithId(userId);
    setUser(res);
    setIsLoading(false);
  };

  useEffect(() => {
    userId.trim() && fetchUser();
  }, [userId]);

  return (
    <section className="size-full flex flex-col gap-4">
      <div className="title">Users Detail</div>

      <div className="panel">
        <InputBox
          type="SearchBox"
          value={pendingText}
          onTextChange={(e) => setPendingText(e.target.value)}
          onKeyDown={handleKeydown}
          placeholder="userId"
        />
      </div>

      <div
        className="panel h-fit User_Profile_Layout"
        style={{ height: "fit-content" }}
      >
        {user && !isLoading ? (
          <>
            <div className="User_Info_Container">
              <div className="User_Profile_Page_Username">{user.username}</div>
              <UserProfileIcon user={user} size="Icon_bigger" />

              <div className="flex flex-row gap-1">
                {renderRole(user.role||[])}
              </div>
              <div className="italic flex flex-row items-center gap-1">
                <FontAwesomeIcon icon={faAt} />
                <span className="opacity-80">{user.email}</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <FontAwesomeIcon icon={faBirthdayCake} />
                <span className="opacity-80">{user.birthdate}</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <FontAwesomeIcon icon={faCalendar} />
                <span className="opacity-80">{user?.createdAt && formatDate(user.createdAt.toString())}</span>
              </div>
              <div className="User_Profile_Page_Fullname">{user.fullname}</div>
              <div className="User_Profile_Page_Bio">{user.bio}</div>
            </div>
            <MultiTabContainer
              tabs={[
                {
                  head: (
                    <>
                      <FontAwesomeIcon icon={faBorderAll} /> All
                    </>
                  ),
                  body: <Feed userIdFilter={user._id} />,
                },
                {
                  head: (
                    <>
                      <FontAwesomeIcon icon={faHeart} /> Liked
                    </>
                  ),
                  body: (
                    <Feed userIdFilter={user._id} userIdLikedFilter={true} />
                  ),
                },
              ]}
            />
          </>
        ) : (
          <>
            <div className="User_Info_Container">
              <h1 className="User_Profile_Page_Username animate-pulse bg-secondary-2 rounded-lg text-transparent">
                <span className="opacity-0">UserInfo</span>
              </h1>
              <div className="User_Profile_Page_Picture_Container">
                <div className=" Icon_bigger animate-pulse"></div>
              </div>

              <div className="User_Profile_Page_Fullname text-transparent bg-secondary-2 rounded-lg animate-pulse ">
                UserRole
              </div>
              <div className="User_Profile_Page_Fullname text-transparent bg-secondary-2 rounded-lg animate-pulse ">
                UserInfoLong
              </div>
              <div className="User_Profile_Page_Fullname text-transparent bg-secondary-2 rounded-lg animate-pulse ">
                UserInfoLong
              </div>
              <div className="User_Profile_Page_Fullname text-transparent bg-secondary-2 rounded-lg animate-pulse ">
                UserInfoLong
              </div>
              <div className="User_Profile_Page_Bio text-transparent h-10 animate-pulse"></div>
            </div>

            <div className="grow size-full rounded-lg bg-secondary-2/70"></div>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <UsersReportTab user={user} />
        <UserReportTab user={user} />
      </div>
    </section>
  );
}
