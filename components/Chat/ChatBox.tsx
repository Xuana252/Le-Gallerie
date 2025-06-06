"use client";
import InputBox from "@components/Input/InputBox";
import { ChatContext } from "@components/UI/Layout/Nav";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleDown,
  faAngleLeft,
  faAngleUp,
  faBan,
  faBars,
  faClose,
  faCommentDots,
  faDotCircle,
  faFaceSmile,
  faMinus,
  faPaperPlane,
  faPlus,
  faRightFromBracket,
  faRobot,
  faSmile,
  faTrash,
  faTriangleCircleSquare,
  faTriangleExclamation,
  faUser,
  faUserGraduate,
  faUserGroup,
  faUserPlus,
  faUsers,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "@lib/firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getSession, useSession } from "next-auth/react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { blockUser, fetchUserWithId } from "@actions/accountActions";
import { AppLogoLoader, Spinner } from "@components/UI/Loader";
import MediaView from "./Views/MediaView";
import SettingView from "./Views/SettingView";
import ChatView from "./Views/ChatView/ChatView";
import ThemeView from "./Views/ThemeView";
import { User } from "@lib/types";
import CustomImage from "@components/UI/Image/Image";
import { ChatBoxView } from "@enum/chatBoxView";
import AddMemberView from "./Views/AddMemberView";
import ImageGroupDisplay from "@components/UI/Image/ImageGroupDisplay";
import MemberView from "./Views/MemberView";
import { getAiMessage } from "@actions/aiChatActions";

type ChatBoxContext = {
  chat: any;
  setChat: Dispatch<SetStateAction<any>>;
  isReplying: boolean;
  setIsReplying: Dispatch<SetStateAction<boolean>>
};
export const ChatBoxContext = createContext<ChatBoxContext>({
  chat: null,
  setChat: () => {},
  isReplying:false,
  setIsReplying:() => {}
});

export default function ChatBox() {
  const { chatInfo, setChatInfo } = useContext(ChatContext);
  const [chat, setChat] = useState<any>(null);
  const [isReplying,setIsReplying] = useState<boolean>(false)

  const [chatBoxView, setChatBoxView] = useState<ChatBoxView>(ChatBoxView.CHAT);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isBlocked, setIsBlocked] = useState<boolean>(false); //from the other user
  const [blocked, setBlocked] = useState<boolean>(false); //us blocking the other user

  const checkChatUserBLock = async (userId: string) => {
    if (!session?.user.id) return;
    try {
      const user = await fetchUserWithId(userId);
      const userBlock = !!user.blocked.find(
        (userId: string) => userId === session?.user.id
      );
      const blockUser = !!session.user.blocked?.find(
        (blockedId: string) => userId === blockedId
      );
      setIsBlocked(userBlock);
      setBlocked(blockUser);
      return userBlock || blockUser;
    } catch (error) {
      console.log("Error while checking block state", error);
      return false;
    }
  };

  const toggleMinimized = () => {
    setIsMinimized((prev) => !prev);
  };

  const handleChatView = () => {
    setIsMinimized(false);
    setChatBoxView(ChatBoxView.CHAT);
  };

  const handleSettingView = () => {
    setIsMinimized(false);
    setChatBoxView(ChatBoxView.SETTING);
  };
  const handleCloseChat = () => {
    if (isLoading) return;
    setChatInfo(null);
  };

  useEffect(() => {
    if (chatInfo.type === "ai") {
      setChatBoxView(ChatBoxView.CHAT);
      getAiMessage(session?.user.id).then((messages) => {
        setChat({
          admin: session?.user.id,
          type: "ai",
          log: [],
          message: messages,
        });
      });
      return;
    }

    const unSub = onSnapshot(doc(db, "chat", chatInfo.chatId), (res) => {
      if (res.exists()) {
        const data = res.data();
        setChat(data);
        data.type === "single" && checkChatUserBLock(chatInfo.users[0]._id);

        setBlocked(
          !!(
            data.type === "single" &&
            session?.user.blocked &&
            session.user.blocked.find(
              (userId: string) => userId === chatInfo.users[0]._id
            )
          )
        );
        setIsBlocked(
          !!(
            data.type === "single" &&
            chatInfo.users[0].blocked.find(
              (userId: string) => userId === session?.user.id
            )
          )
        );
      } else {
        setChatInfo(null);
      }
    });

    setChatBoxView(ChatBoxView.CHAT);
    return () => {
      unSub();
    };
  }, [chatInfo.chatId]);

  return (
    <>
      {!chat || !chatInfo ? (
        <div></div>
      ) : (
        <ChatBoxContext.Provider value={{ chat, setChat,isReplying,setIsReplying }}>
          <div className={`${chat?.theme}`}>
            <div
              className={`fixed text-accent bottom-0 sm:right-0 sm:mx-[20px]  sm:w-[400px] sm:max-h-[500px] w-screen   flex flex-col rounded-t-2xl z-40 backdrop-blur-lg border-x-[2px] border-t-[2px] shadow-xl border-primary`}
            >
              <div className="flex flex-row items-center  bg-secondary-2/70 p-2 gap-4 shadow-md h-[50px] rounded-t-2xl ">
                <label className="flex flex-row items-center gap-2 bg-primary rounded-full pr-4">
                  <div className={`size-9`}>
                    {chatInfo.type === "ai" ? (
                      <div className="Icon_small">
                        <FontAwesomeIcon icon={faRobot} />
                      </div>
                    ) : (
                      <ImageGroupDisplay
                        images={
                          chatInfo.type === "group"
                            ? chat.image
                              ? [chat.image]
                              : chatInfo?.users
                                  .filter(
                                    (user: User) =>
                                      chat.memberIds.findIndex(
                                        (id: string) => id === user._id
                                      ) !== -1
                                  )
                                  .map((u: User) => u.image)
                            : [chatInfo.users[0].image]
                        }
                      />
                    )}
                  </div>
                  <h1 className="font-semibold max-w-[150px] overflow-x-hidden overflow-ellipsis whitespace-nowrap">
                    {chatInfo.type === "single"
                      ? chatInfo.users[0].username
                      : chatInfo.type === "ai"
                      ? (chat.name = "Le Gallarie bot")
                      : chat.name}
                  </h1>
                </label>
                <div className="ml-auto flex flex-row rounded-xl bg-primary gap-2 p-1 h-full items-center">
                  {chat.type !== "ai" && (
                    <button
                      className="Icon_smaller"
                      onClick={
                        chatBoxView === "Setting"
                          ? handleChatView
                          : handleSettingView
                      }
                    >
                      <FontAwesomeIcon
                        icon={
                          chatBoxView === "Setting" ? faCommentDots : faBars
                        }
                      />
                    </button>
                  )}
                  <button className="Icon_smaller" onClick={toggleMinimized}>
                    <FontAwesomeIcon
                      icon={isMinimized ? faAngleUp : faAngleDown}
                    />
                  </button>
                  <button className="Icon_smaller" onClick={handleCloseChat}>
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </div>
              </div>
              <div
                className={`${
                  isMinimized ? "hidden" : "inline-block"
                } relative h-[450px] w-full`}
              >
                {((isBlocked || blocked) && chatBoxView !== "Setting") ||
                isLoading ? (
                  <div className="size-full top-0 left-0 absolute text-primary text-[1.5em] font-semibold bg-primary/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    {isLoading ? (
                      <div className="size-24 bg-accent/50 rounded-full">
                        <AppLogoLoader></AppLogoLoader>
                      </div>
                    ) : (
                      <>
                        <span className="bg-accent/40  px-2">
                          Oops can't do that right now:/
                        </span>
                        <button
                          className="font-bold underline bg-accent/40 px-2"
                          onClick={() => setChatBoxView(ChatBoxView.SETTING)}
                        >
                          See setting
                        </button>
                      </>
                    )}
                  </div>
                ) : null}
                {chatBoxView === ChatBoxView.MEDIA && (
                  <MediaView
                    setChatBoxView={setChatBoxView}
                    isBlocked={isBlocked}
                    blocked={blocked}
                  />
                )}
                {chatBoxView === ChatBoxView.SETTING && (
                  <SettingView
                    isBlocked={isBlocked}
                    blocked={blocked}
                    isLoading={isLoading}
                    setBlocked={setBlocked}
                    setChatInfo={setChatInfo}
                    setIsLoading={setIsLoading}
                    setChatBoxView={setChatBoxView}
                  />
                )}
                {chatBoxView === ChatBoxView.CHAT && (
                  <ChatView isBlocked={isBlocked} blocked={blocked} />
                )}
                {chatBoxView === ChatBoxView.THEME && (
                  <ThemeView setChatBoxView={setChatBoxView} />
                )}
                {chatBoxView === ChatBoxView.ADDMEMBER && (
                  <AddMemberView
                    setChatBoxView={setChatBoxView}
                    setIsLoading={setIsLoading}
                  />
                )}
                {chatBoxView === ChatBoxView.MEMBER && (
                  <MemberView setChatBoxView={setChatBoxView} />
                )}
              </div>
            </div>
          </div>
        </ChatBoxContext.Provider>
      )}
    </>
  );
}
