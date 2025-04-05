import { blockUser } from "@actions/accountActions";
import toastError, { confirm } from "@components/Notification/Toaster";
import CustomImage from "@components/UI/Image/Image";
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
import { getSession, signIn, useSession } from "@node_modules/next-auth/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "@node_modules/next/navigation";
import { deleteChat, leaveChat } from "@lib/Chat/chat";
import { User } from "@lib/types";
import { ChatBoxView } from "@enum/chatBoxView";
import ImageGroupDisplay from "@components/UI/Image/ImageGroupDisplay";

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
  setChatBoxView: Dispatch<SetStateAction<ChatBoxView>>;
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
      update()
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
      className={`grid grid-cols-1 w-full gap-4 backdrop-blur-sm bg-primary/70 overflow-y-scroll no-scrollbar items-center p-4 size-full`}
    >
      <div className="grid grid-cols-1 place-items-center">
        <div className="size-28">
          <ImageGroupDisplay
            images={
              chat.type === "group"
                ? chat.image
                  ? [chat.image]
                  : chatInfo.users
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
        </div>
        <span className="text-3xl font-bold">
          {chat.type === "single" ? chatInfo.users[0].username : chat.name}
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
                onClick={() => setChatBoxView(ChatBoxView.MEMBER)}
              >
                <div className="Icon_small">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <span className="grow text-md text-left">View members</span>
              </button>
              {chat.admin === session?.user.id && (
                <button
                  className="outline-none flex gap-2 w-full h-fit min-h-[54px] items-center  p-2 border-b-2 border-accent last:border-none hover:bg-primary   first:rounded-t-lg last:rounded-b-lg overflow-hidden"
                  onClick={() => setChatBoxView(ChatBoxView.ADDMEMBER)}
                >
                  <div className="Icon_small">
                    <FontAwesomeIcon icon={faUserPlus} />
                  </div>
                  <span className="grow text-md text-left">Add member</span>
                </button>
              )}
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
