import { blockUser } from "@actions/accountActions";
import toastError, { confirm } from "@components/Notification/Toaster";
import CustomImage from "@components/UI/Image";
import { db } from "@lib/firebase";
import { removeImage } from "@lib/upload";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import {
  faUser,
  faUsers,
  faUserPlus,
  faImage,
  faBan,
  faRightFromBracket,
  faTrash,
  faPallet,
  faPalette,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { getSession, useSession } from "@node_modules/next-auth/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "@node_modules/next/navigation";
import { deleteChat, leaveChat } from "@lib/Chat/chat";
import { User } from "@lib/types";
import { ChatBoxView } from "@app/enum/chatBoxView";

export default function SettingView({
  chatInfo,
  chat,
  isBlocked,
  blocked,
  isLoading,
  setBlocked,
  setChatInfo,
  setChatBoxView,
  setIsLoading,
}: {
  chatInfo: any;
  chat: any;
  isBlocked: boolean;
  blocked: boolean;
  isLoading: boolean;
  setBlocked: (state: boolean) => void;
  setChatInfo: (info: any) => void;
  setChatBoxView: Dispatch<
    SetStateAction<ChatBoxView>
  >;
  setIsLoading: (state: boolean) => void;
}) {
  const { data: session, update } = useSession();
  const router = useRouter();

  const handleChangeBlockState = async (userId: string) => {
    if (!session?.user.id) return;
    if (!blocked) {
      const result = await confirm(
        `Do you want to block ${chatInfo.users[0].username}`
      );
      if (result) {
        setBlocked(true);
      } else {
        return;
      }
    } else {
      setBlocked(false);
    }
    try {
      const response = await blockUser(session.user.id, userId);
      const newSession = await getSession();
      await update(newSession);
      if (!response) {
        setBlocked(!blocked);
      }
    } catch (error) {
      toastError("Error");
    }
  };

  const handleLeaveChat = async (chatId: string) => {
    if (!session) return;
    if (chat.admin === session.user.id) {
      toastError(
        "You are an admin of this chat and cannot leave. Please assign another admin before leaving."
      );
      return;
    }
    const confirmation = await confirm("Do you want to leave this chat");
    if (!confirmation) return;
    setIsLoading(true);

    await leaveChat(chatId, session.user.id || "");

    setChatInfo(null);
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!session) return;
    const confirmation = await confirm("Do you want to remove this chat?");
    if (!confirmation) return;
    console.log();
    setIsLoading(true);

    await deleteChat(session.user.id || "", chatId);

    setChatInfo(null);
  };
  return (
    <div
      className={`grid grid-cols-1 gap-4 backdrop-blur-sm bg-primary/70 overflow-y-scroll no-scrollbar absolute top-0 left-0 z-40 items-center p-4 size-full  `}
    >
      <div className="grid grid-cols-1 place-items-center">
        <div
          className={`${
            chatInfo.type === "group" && !chatInfo.image
              ? "grid grid-cols-2 gap-1"
              : ""
          } size-28 rounded-full overflow-hidden max-w-28 max-h-28 items-center justify-between pointer-events-none`}
        >
          {chatInfo.type === "single" ? (
            chatInfo.users[0].image ? (
              <CustomImage
                src={chatInfo.users[0].image}
                alt="profile picture"
                className="size-full"
                width={0}
                height={0}
                transformation={[{ quality: 10 }]}
                style={{ objectFit: "cover" }}
              ></CustomImage>
            ) : (
              <FontAwesomeIcon icon={faUser} className="size-full" />
            )
          ) : chatInfo.image ? (
            <CustomImage
            src={chatInfo.image}
            alt="profile picture"
            className="size-full"
            width={0}
            height={0}
            transformation={[{ quality: 10 }]}
            style={{ objectFit: "cover" }}
          ></CustomImage>
          ) : (
            chatInfo.users
              .slice(0, 4)
              .map((user: User, index: number) => (
                <div
                  className={`${
                    chatInfo.users.length === 3 && index === 2
                      ? "col-span-2"
                      : "flex-1"
                  } rounded-2xl flex items-center justify-center h-full  overflow-hidden bg-secondary-2 text-accent`}
                >
                  {user.image ? (
                    <CustomImage
                      src={user.image}
                      alt="profile picture"
                      className="size-full"
                      width={0}
                      height={0}
                      transformation={[{ quality: 10 }]}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="size-full" />
                  )}
                </div>
              ))
          )}
        </div>
        <span className="text-3xl font-bold">
          {chatInfo.type === "single"
            ? chatInfo.users[0].username
            : chatInfo.name}
        </span>
      </div>

      <div>
        <div className="font-bold text-accent/70 indent-3">Action</div>
        <div className="grid grid-cols-1 w-full rounded-lg bg-secondary-1/60 font-bold text-lg ">
          {chat?.type === "single" ? (
            <button
              className="outline-none flex gap-2 w-full h-fit min-h-[54px] items-center  p-2 border-b-2 border-accent last:border-none hover:bg-primary   first:rounded-t-lg last:rounded-b-lg overflow-hidden"
              onClick={() => {
                router.push(`/profile/${chatInfo.users[0]._id}`);
              }}
            >
              <div className="Icon_small">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <span className="grow text-md text-left">View user profile</span>
            </button>
          ) : (
            <>
              <button
                className="outline-none flex gap-2 w-full h-fit min-h-[54px] items-center  p-2 border-b-2 border-accent last:border-none hover:bg-primary   first:rounded-t-lg last:rounded-b-lg overflow-hidden"
                onClick={() => {}}
              >
                <div className="Icon_small">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <span className="grow text-md text-left">View members</span>
              </button>
              <button
                className="outline-none flex gap-2 w-full h-fit min-h-[54px] items-center  p-2 border-b-2 border-accent last:border-none hover:bg-primary   first:rounded-t-lg last:rounded-b-lg overflow-hidden"
                onClick={() => setChatBoxView(ChatBoxView.ADDMEMBER)}
              >
                <div className="Icon_small">
                  <FontAwesomeIcon icon={faUserPlus} />
                </div>
                <span className="grow text-md text-left">Add member</span>
              </button>
            </>
          )}
          <button
            className="outline-none flex gap-2 w-full min-h-[54px] items-center p-2 border-b-2 border-accent last:border-none hover:bg-primary first:rounded-t-lg last:rounded-b-lg overflow-hidden"
            onClick={() => setChatBoxView(ChatBoxView.MEDIA)}
          >
            <div className="Icon_small">
              <FontAwesomeIcon icon={faImage} />
            </div>
            <span className="grow text-md text-left">View media</span>
          </button>
          <button
            className="outline-none flex gap-2 w-full min-h-[54px] items-center p-2 border-b-2 border-accent last:border-none hover:bg-primary first:rounded-t-lg last:rounded-b-lg overflow-hidden"
            onClick={() => setChatBoxView(ChatBoxView.THEME)}
          >
            <div className="Icon_small">
              <FontAwesomeIcon icon={faPalette} />
            </div>
            <span className="grow text-md text-left">Change theme</span>
            <div className=" size-6 rounded-lg grid grid-cols-2 grid-rows-2  overflow-hidden clip-[circle(50%_at_50%_50%)]">
              <div className="bg-primary"></div>
              <div className="bg-secondary-1"></div>
              <div className="bg-secondary-2"></div>
              <div className="bg-accent"></div>
            </div>
          </button>
        </div>
      </div>
      <div>
        <div className="font-bold text-accent/70 indent-3">
          Privacy & Support
        </div>
        <div className="grid grid-cols-1 w-full rounded-lg bg-secondary-1/60 font-bold text-lg ">
          {chat?.type === "single" ? (
            <button
              className="outline-none flex gap-2 w-full h-fit min-h-[54px] items-center p-2 border-b-2 border-accent last:border-none hover:bg-primary first:rounded-t-lg last:rounded-b-lg overflow-hidden"
              onClick={() => handleChangeBlockState(chatInfo.users[0]._id)}
            >
              <div className="Icon_small">
                <FontAwesomeIcon icon={faBan} />
              </div>
              <span className="grow text-md text-left text-red-500">
                {blocked ? "Unblock" : "Block"} user
              </span>
            </button>
          ) : (
            <button
              className="outline-none flex gap-2 w-full min-h-[54px] items-center p-2 border-b-2 border-accent last:border-none hover:bg-primary first:rounded-t-lg last:rounded-b-lg overflow-hidden"
              onClick={() => handleLeaveChat(chatInfo.chatId)}
            >
              <div className="Icon_small">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </div>
              <span className="grow text-md text-left text-red-500">
                Leave chat
              </span>
            </button>
          )}
          {(chat?.type === "single" ||
            (chat?.type === "group" && chat?.admin === session?.user.id)) && (
            <button
              className="outline-none flex gap-2 w-full min-h-[54px] items-center p-2 border-b-2 border-accent last:border-none hover:bg-primary first:rounded-t-lg last:rounded-b-lg overflow-hidden"
              onClick={() => handleDeleteChat(chatInfo.chatId)}
            >
              <div className="Icon_small">
                <FontAwesomeIcon icon={faTrash} />
              </div>
              <span className="grow text-md text-left text-red-500">
                Delete chat
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
