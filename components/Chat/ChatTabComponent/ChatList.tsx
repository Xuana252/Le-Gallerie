import { formatTimeAgo } from "@lib/dateFormat";
import { db } from "@lib/firebase";
import {
  faUser,
  faCircle,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { doc, updateDoc } from "firebase/firestore";
import { useSession } from "@node_modules/next-auth/react";
import React, { useContext } from "react";
import { ChatContext } from "@components/UI/Nav";
import { User } from "@lib/types";
import CustomImage from "@components/UI/Image";

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
      const { users, image, name, type, ...rest } = item;
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
        <span>you have no chat to show:(</span>
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
            <div
              className={`${
                chat.type === "group" && !chat.image
                  ? "grid grid-cols-2 gap-[2px]"
                  : ""
              } size-12 max-w-12 max-h-12 items-center justify-between pointer-events-none`}
            >
              {chat.type === "single" ? (
                <div className="Icon_big">
                  {chat.users[0].image ? (
                    <CustomImage
                      src={chat.users[0].image}
                      alt="profile picture"
                      className="size-full"
                      width={0}
                      height={0}
                      transformation={[{ quality: 10 }]}
                      style={{ objectFit: "cover" }}
                    ></CustomImage>
                  ) : (
                    <FontAwesomeIcon icon={faUser} />
                  )}
                </div>
              ) : chat.image ? (
                <div className="Icon_big">
                  <CustomImage
                    src={chat.image}
                    alt="profile picture"
                    className="size-full"
                    width={0}
                    height={0}
                    transformation={[{ quality: 10 }]}
                    style={{ objectFit: "cover" }}
                  ></CustomImage>
                </div>
              ) : (
                chat.users
                  .slice(0, 4)
                  .map((user: User, index: number) => (
                    <div
                      className={`${
                        chat.users.length === 3 && index === 2
                          ? "col-span-2"
                          : "flex-1"
                      } rounded-md flex items-center justify-center h-full  overflow-hidden bg-secondary-2 text-accent`}
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
                        ></CustomImage>
                      ) : (
                        <FontAwesomeIcon icon={faUser} />
                      )}
                    </div>
                  ))
              )}
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
