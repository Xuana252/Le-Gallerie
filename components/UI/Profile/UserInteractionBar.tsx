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
import { ChatContext } from "../Nav";
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
  const [isFollowed, setIsFollowed] = useState(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false); //from the other user
  const [blocked, setBlocked] = useState<boolean>(false); //us blocking the other user
  const [followTimeOut, setFollowTimeout] = useState(false);
  const [friendState, setFriendState] = useState<FriendState>(
    FriendState.UNFRIEND
  );
  const { setChatInfo } = useContext(ChatContext);

  const handleFriendButtonAction = async () => {
    if (!session?.user.id) {
      const loginConfirm = await confirm("you need to login first");
      if (loginConfirm) {
        router.push("/sign-in");
      }
      return;
    }
    switch (friendState) {
      case FriendState.UNFRIEND:
      case FriendState.PENDING:
        sendFriendRequest(session.user.id, user._id);
        break;
      case FriendState.FRIEND:
        const confirmation = await confirm("Do you want to unfriend");
        if (!confirmation) break;
      case FriendState.SENT:
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
    if (followTimeOut) return;
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

  const renderFriendMessage = (state: FriendState) => {
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
    }
  };
  return (
    <div className="User_Profile_Page_Interactive_Bar">
      {user && (
        <>
          <MultipleOptionsButton>
            <button
              className={`size-full font-bold px-2 py-1`}
              onClick={handleChangeFollowState}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </button>
            <button
              className={`size-full font-bold px-2 py-1`}
              onClick={handleFriendButtonAction}
            >
              {renderFriendMessage(friendState)}
            </button>
            <button
              className={`size-full font-bold px-2 py-1`}
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
