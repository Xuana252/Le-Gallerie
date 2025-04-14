"use client";
import {
  fetchUserWithId,
  updateUserBanState,
  updateUserCreatorState,
} from "@actions/accountActions";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import toastError, {
  confirm,
  toastMessage,
} from "@components/Notification/Toaster";
import Feed from "@components/UI/Layout/Feed";
import MultiTabContainer from "@components/UI/Layout/MultiTabContainer";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import UserStatBar from "@components/UI/Profile/UserStatBar";
import UserReportTab from "@components/UI/Report/UserReportTab";
import UsersReportTab from "@components/UI/Report/UsersReportTab";
import { PostPrivacy } from "@enum/postPrivacyEnum";
import { SubmitButtonState } from "@enum/submitButtonState";
import { UserRole } from "@enum/userRolesEnum";
import { renderRole } from "@lib/Admin/render";
import { formatDate } from "@lib/dateFormat";
import { renderPrivacy } from "@lib/Post/post";
import { User } from "@lib/types";
import {
  faAt,
  faBirthdayCake,
  faBorderAll,
  faCalendar,
  faCameraRetro,
  faHeart,
  faLock,
  faLockOpen,
  faTrash,
  faUnlock,
  faUserSlash,
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
  const [banningState, setBanningState] = useState<SubmitButtonState>(
    SubmitButtonState.IDLE
  );
  const [creatorState, setCreatorState] = useState<SubmitButtonState>(
    SubmitButtonState.IDLE
  );

  const handleVerifyCreator = async () => {
    if (!user || user._id === process.env.NEXT_PUBLIC_ADMIN_ID) {
      toastError("Unavailable");
      return;
    }

    try {
      setCreatorState(SubmitButtonState.PROCESSING);

      const res = await updateUserCreatorState(user._id);

      if (res) {
        setCreatorState(SubmitButtonState.SUCCESS);
        toastMessage("User creator state update successfully");
        setUser((prev) => {
          if (!prev) return prev;

          const currentRoles = prev.role ?? []; // fallback to empty array
          const hasCreator = currentRoles.includes(UserRole.CREATOR);
          const newRoles = hasCreator
            ? currentRoles.filter((r) => r !== UserRole.CREATOR)
            : [...currentRoles, UserRole.CREATOR];

          return { ...prev, role: newRoles };
        });
      } else {
        setCreatorState(SubmitButtonState.FAILED);
        toastError("Failed to update user creator state");
      }
    } catch (error) {
      setCreatorState(SubmitButtonState.FAILED);
      toastError("Failed to update user creator state");
    }
  };

  const handleBan = async () => {
    if (!user || user._id === process.env.NEXT_PUBLIC_ADMIN_ID) {
      toastError("Unavailable");
      return;
    }

    if (!user.banned) {
      const result = await confirm(`Do you want to ban ${user.username}?`);
      if (!result) {
        return;
      }
    }
    try {
      setBanningState(SubmitButtonState.PROCESSING);

      const res = await updateUserBanState(user._id);

      if (res) {
        setBanningState(SubmitButtonState.SUCCESS);
        toastMessage("User ban state update successfully");
        setUser((prev) => ({ ...prev, banned: !prev?.banned } as User));
      } else {
        setBanningState(SubmitButtonState.FAILED);
        toastError("Failed to update user ban state");
      }
    } catch (error) {
      setBanningState(SubmitButtonState.FAILED);
      toastError("Failed to update user ban state");
    }
  };

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
    <section className="w-full flex flex-col gap-4">
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

      {user?._id !== process.env.NEXT_PUBLIC_ADMIN_ID && !isLoading && (
        <div className="panel_2 flex items-center">
          <span className="mr-auto subtitle">Actions</span>
          <div className={"ml-auto flex items-center gap-2"}>
            <SubmitButton
              state={creatorState}
              changeState={setCreatorState}
              variant="Button_variant_2_5"
              onClick={handleVerifyCreator}
            >
              <FontAwesomeIcon icon={faCameraRetro} />{" "}
              {user?.role?.includes(UserRole.CREATOR)
                ? "Revoke User"
                : "Verify User"}{" "}
            </SubmitButton>
            <SubmitButton
              state={banningState}
              changeState={setBanningState}
              variant="Button_variant_2_5"
              onClick={handleBan}
            >
              <FontAwesomeIcon icon={user?.banned ? faUnlock : faLock} />{" "}
              {user?.banned ? "UnBan" : "Ban"}{" "}
            </SubmitButton>
          </div>
        </div>
      )}

      <div
        className="panel  User_Profile_Layout"
        style={{ height: "100vh", minHeight: "fit-content" }}
      >
        {user && !isLoading ? (
          <>
            <div className="User_Info_Container">
              <div className="User_Profile_Page_Username">{user.username}</div>
              <UserProfileIcon user={user} size="Icon_bigger" redirect={false} />

              <div className="flex flex-row gap-1">
                {renderRole(user.role || [])}
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
                <span className="opacity-80">
                  {user?.createdAt && formatDate(user.createdAt.toString())}
                </span>
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
                  body: <Feed userIdFilter={user._id} adminPage={true}/>,
                },
                {
                  head: (
                    <>
                      <FontAwesomeIcon icon={faTrash} /> Deleted
                    </>
                  ),
                  body: (
                    <Feed userIdFilter={user._id} userIdDeletedFilter={true} adminPage={true} />
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
