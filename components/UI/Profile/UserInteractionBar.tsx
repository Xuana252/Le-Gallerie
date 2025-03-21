import { blockUser } from "@actions/accountActions";
import { checkFollowState, followUser } from "@actions/followsActions";
import MultipleOptionsButton from "@components/Input/MultipleOptionsButton";
import toastError, { confirm } from "@components/Notification/Toaster";
import { startChat } from "@lib/Chat/chat";
import {
  faUserPlus,
  faComment,
  faUserMinus,
  faCancel,
  faRemove,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession, getSession } from "@node_modules/next-auth/react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Layout/Nav";
import { User } from "@lib/types";
import { FriendState } from "@enum/friendStateEnum";
import {
  checkFriendState,
  removeFriendRequest,
  sendFriendRequest,
} from "@actions/friendActions";

export default function UserInteractionBar({
  user,
  updateCallback,
}: {
  user: User;
  updateCallback: any;
}) {
  const TIME_OUT_TIME = 1000;
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [postCount, setPostCount] = useState<number>(0);
  const [isFollowed, setIsFollowed] = useState<boolean | null>(null);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false);
  const [followTimeOut, setFollowTimeout] = useState(false);
  const [friendState, setFriendState] = useState<FriendState | null>(null);
  const { setChatInfo } = useContext(ChatContext);

  const handleFriendButtonAction = async () => {
    if (friendState === null) return;
    if (!session?.user.id) {
      const loginConfirm = await confirm("you need to login first");
      if (loginConfirm) {
        router.push("/sign-in");
      }
      return;
    }
    switch (friendState) {
      case FriendState.UNFRIEND:
        setFriendState(FriendState.SENT);
        sendFriendRequest(session.user.id, user._id);
        break;
      case FriendState.PENDING:
        setFriendState(FriendState.SENT);
        sendFriendRequest(session.user.id, user._id);
        break;
      case FriendState.FRIEND:
        const confirmation = await confirm("Do you want to unfriend");
        if (!confirmation) break;
        setFriendState(FriendState.UNFRIEND);
        removeFriendRequest(session.user.id, user._id);
        break;
      case FriendState.SENT:
        setFriendState(FriendState.UNFRIEND);
        removeFriendRequest(session.user.id, user._id);
        break;
    }
  };

  useEffect(() => {
    fetchFollowState();
    fetchFriendState();
  }, [user]);

  const fetchFollowState = async () => {
    if (!session?.user.id) return;
    const response = await checkFollowState(user._id, session?.user.id);

    setIsFollowed(response);
  };

  const fetchFriendState = async () => {
    if (!session?.user.id) return;
    const response = await checkFriendState(session?.user.id, user._id);
    setFriendState(response);
  };

  const handleChangeBlockState = async () => {
    if (!session?.user.id) {
      const loginConfirm = await confirm("you need to login first");
      if (loginConfirm) {
        router.push("/sign-in");
      }
      return;
    }
    const result = await confirm(`Do you want to block ${user?.username}`);
    if (result) {
      setBlocked(true);
    } else {
      return;
    }
    try {
      const response = await blockUser(session.user.id, user._id);
      const newSession = await getSession();
      await update(newSession);
      if (!response) {
        setBlocked((prev) => !prev);
      }
    } catch (error) {
      toastError("Error while blocking user");
    }
  };

  const handleChangeFollowState = async () => {
    if (followTimeOut || isFollowed === null) return;
    setFollowTimeout(true);
    if (!session?.user.id) {
      const loginConfirm = await confirm("you need to login first");
      if (loginConfirm) {
        router.push("/sign-in");
      }
      return;
    }
    if (isFollowed) {
      const unfollowConfirmation = await confirm(
        `You do want to unfollow ${user?.username}?`
      );
      if (unfollowConfirmation) {
        setIsFollowed(false);
      } else {
        setTimeout(() => {
          setFollowTimeout(false);
        }, TIME_OUT_TIME);
        return;
      }
    } else {
      setIsFollowed(true);
    }

    try {
      await followUser(user._id, session.user.id);
    } catch (error) {
      console.log("Failed to update user follows");
    } finally {
      updateCallback();
    }
    setTimeout(() => {
      setFollowTimeout(false);
    }, TIME_OUT_TIME);
  };

  const renderFollowState = (state: boolean | null) => {
    switch (state) {
      case true:
        return <>Unfollow</>;
      case false:
        return <>Follow</>;
      default:
        return (
          <div className=" rounded-md text-transparent animate-pulse bg-accent">
            NullState
          </div>
        );
    }
  };

  const renderFriendMessage = (state: FriendState | null) => {
    switch (state) {
      case FriendState.UNFRIEND:
        return (
          <>
            Add Friend <FontAwesomeIcon icon={faUserPlus} />{" "}
          </>
        );
      case FriendState.FRIEND:
        return (
          <>
            Unfriend <FontAwesomeIcon icon={faUserMinus} />{" "}
          </>
        );
      case FriendState.PENDING:
        return <>Accept Request</>;
      case FriendState.SENT:
        return <>Cancel Request</>;
      default:
        return (
          <div className=" rounded-md text-transparent animate-pulse bg-accent">
            NullState
          </div>
        );
    }
  };
  return (
    <div className="User_Profile_Page_Interactive_Bar">
      {user && (
        <>
          <MultipleOptionsButton>
            <button
              className={`size-full px-2 py-1 flex flex-row items-center gap-2 p-1 text-sm font-bold justify-center text-nowrap`}
              onClick={handleChangeFollowState}
            >
              {renderFollowState(isFollowed)}
            </button>
            <button
              className={`size-full font-bold px-2 py-1 flex flex-row items-center gap-2 p-1 text-sm justify-center text-nowrap`}
              onClick={handleFriendButtonAction}
            >
              {renderFriendMessage(friendState)}
            </button>
            <button
              className={`size-full font-bold px-2 py-1 flex flex-row items-center gap-2 p-1 text-sm justify-center text-nowrap`}
              onClick={handleChangeBlockState}
            >
              Block
            </button>
          </MultipleOptionsButton>
          <button
            className="Button_variant_1"
            onClick={() => startChat(user, setChatInfo, router)}
          >
            Message <FontAwesomeIcon icon={faComment} />
          </button>
        </>
      )}
    </div>
  );
}
