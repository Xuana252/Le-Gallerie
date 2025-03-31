import { formatTimeAgo } from "@lib/dateFormat";
import { db } from "@lib/firebase";
import {
  faUser,
  faCircle,
  faBoxArchive,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { doc, updateDoc } from "firebase/firestore";
import { useSession } from "@node_modules/next-auth/react";
import React, { useContext } from "react";
import { ChatContext } from "@components/UI/Layout/Nav";
import { User } from "@lib/types";
import CustomImage from "@components/UI/Image/Image";
import ImageGroupDisplay from "@components/UI/Image/ImageGroupDisplay";

export default function ChatList({
  chatList,
  isLoading,
}: {
  chatList: any;
  isLoading: boolean;
}) {
  const { data: session } = useSession();
  const { setChatInfo } = useContext(ChatContext);

  const handleSelectChat = async (chat: any) => {
    if (!session) return;
    const usersChat = chatList.map((item: any) => {
      const { users, image, name, type, memberIds, ...rest } = item;
      return rest;
    });

    const chatIndex = usersChat.findIndex(
      (item: any) => item.chatId === chat.chatId
    );

    usersChat[chatIndex].isSeen = true;

    const usersChatRef = doc(db, "usersChat", session?.user.id as string);

    try {
      await updateDoc(usersChatRef, {
        chat: usersChat,
      });
      setChatInfo(chat);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ul
      className={` w-full gap-3 overflow-y-scroll overflow-x-visible no-scrollbar flex flex-col h-full  
    `}
    >
      {!isLoading && chatList.length === 0 ? (
        <div className="size-full flex flex-col items-center justify-center">
          <FontAwesomeIcon icon={faBoxArchive} size="2xl" />
          <p>Nothing's here yet:/</p>
        </div>
      ) : isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <li
            key={index}
            className="bg-accent text-primary rounded-lg p-2 flex gap-3 cursor-pointer hover:bg-accent/80 transition-all duration-200 "
          >
            <div className="Icon_big animate-pulse bg-secondary-2"></div>
            <div className="flex flex-col grow justify-around items-baseline pointer-events-none">
              <div className="animate-pulse rounded-lg h-4 bg-secondary-2 w-20"></div>

              <div className="animate-pulse rounded-lg h-3 bg-secondary-2/50 w-32 "></div>
            </div>
            <div className="flex flex-col items-end justify-end pointer-events-none">
              <span className="animate-pulse rounded-lg h-2 bg-secondary-2/50 w-12 "></span>
            </div>
          </li>
        ))
      ) : (
        chatList.map((chat: any) => (
          <li
            key={chat.chatId}
            className="bg-accent text-primary rounded-lg p-2 flex gap-3 cursor-pointer hover:bg-accent/80 transition-all duration-200 "
            onClick={() => handleSelectChat(chat)}
          >
            <div className={`size-10`}>
              <ImageGroupDisplay
                images={
                  chat.type === "group"
                    ? chat.image
                      ? [chat.image]
                      : chat.users
                          .filter(
                            (user: User) =>
                              chat.memberIds.findIndex(
                                (id: string) => id === user._id
                              ) !== -1
                          )
                          .map((u: User) => u.image)
                    : [chat.users[0].image]
                }
              />
            </div>
            <div className="flex flex-col grow justify-around items-baseline pointer-events-none">
              <span className="font-bold">
                {chat.type === "group" ? chat.name : chat.users[0].username}
              </span>

              <div className=" inline-block whitespace-nowrap max-w-[100px] overflow-x-hidden overflow-ellipsis text-sm">
                {chat.lastMessage}
              </div>
            </div>
            <div className="flex flex-col items-end pointer-events-none">
              <div className="grow content-start flex items-start">
                {chat.isSeen ? null : (
                  <FontAwesomeIcon icon={faCircle} size="xs" />
                )}
              </div>
              <span className="text-xs">{formatTimeAgo(chat.updatedAt)}</span>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}
