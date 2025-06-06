import EmojiInput from "@components/Input/EmojiInput";
import ImageInput from "@components/Input/ImageInput";
import InputBox from "@components/Input/InputBox";
import CustomImage from "@components/UI/Image/Image";
import { formatTimeAgoWithoutAgo } from "@lib/dateFormat";
import { db } from "@lib/firebase";
import { uploadImage } from "@lib/upload";
import { updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import {
  faArrowDown,
  faArrowRightFromFile,
  faHandPointRight,
  faMapPin,
  faMinus,
  faPalette,
  faPallet,
  faPaperPlane,
  faPuzzlePiece,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  faUserTie,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import { User } from "@lib/types";
import ReactionButton from "@components/Input/ReactionInput";
import { Reaction } from "@enum/reactionEnum";
import ChatItem from "./ChatItem";
import {
  addChatItemReaction,
  pinMessage,
  removeChatItem,
} from "@lib/Chat/chat";
import { faUsb } from "@node_modules/@fortawesome/free-brands-svg-icons";
import { v4 as uuidv4 } from "uuid";
import ChatBar from "./ChatBar";

import { AppLogoLoader } from "@components/UI/Loader";
import { RenderBackground, RenderLog } from "@lib/Chat/render";

import { getAiMessage } from "@actions/aiChatActions";
import { ChatBoxContext } from "@components/Chat/ChatBox";
import { ChatContext } from "@components/UI/Layout/Nav";

export default function ChatView({
  isBlocked,
  blocked,
}: {
  isBlocked: boolean;
  blocked: boolean;
}) {
  const { data: session, update } = useSession();

  const { chat, isReplying } = useContext(ChatBoxContext);
  const { chatInfo } = useContext(ChatContext);

  const messageListRef = useRef<HTMLUListElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const [messages, setMessages] = useState(chat?.message || []);

  const chatItemRef = useRef<{ [key: string]: HTMLLIElement | null }>({});

  useEffect(() => {
    setMessages(chat?.message || []);
  }, [chat?.message]);

  const handleMoveToPin = () => {
    chatItemRef.current[chat.pinned] &&
      chatItemRef.current[chat.pinned]?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  };

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const element = e.currentTarget;

    if (Math.abs(element.scrollTop) > 300) {
      setShowScrollToBottom(true);
    } else {
      setShowScrollToBottom(false);
    }
  };

  const handleScrollToBottom = () => {
    messageListRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [chat?.message?.length, chatInfo]);

  


  const getMessageClass = (message: any) => {
    const isMine =
      message.senderId === session?.user.id || message.senderId === "user";
    const baseClass = isMine ? "My_message" : "Other_message";

    const currentIndex = chat.message.findIndex(
      (msg: any) => msg.id === message.id
    );
    // Get previous and next messages
    const prevMessage = chat.message[currentIndex - 1];
    const nextMessage = chat.message[currentIndex + 1];

    // Check if the previous and next messages belong to the same sender
    const isPrevSameSender = prevMessage?.senderId === message.senderId;
    const isNextSameSender = nextMessage?.senderId === message.senderId;

    // Determine message shape based on position in the sequence
    if (!isPrevSameSender && !isNextSameSender)
      return `${baseClass} rounded-2xl`;
    if (!isPrevSameSender)
      return `${isMine ? "My_message_upper" : "Other_message_upper"}`;
    if (!isNextSameSender)
      return `${isMine ? "My_message_under" : "Other_message_under"}`;
    return `${isMine ? "My_message_middle" : "Other_message_middle"}`;
  };

  return (
    <div className="relative h-[400px] w-full ">
      <div className="absolute inset-0 z-0 opacity-70 ">
        {RenderBackground(chat?.theme)}
      </div>
      {chat.pinned && (
        <div
          className="absolute left-[50%] -translate-x-[50%] rounded-full bg-accent w-fit p-2 mt-2 text-primary flex flex-row items-center gap-2 hover:-translate-y-[4px] hover:opacity-100 opacity-50 z-50 duration-200 ease-in-out "
          onClick={handleMoveToPin}
        >
          <FontAwesomeIcon icon={faMapPin} size="xs" />
          <div className="Icon_message">
            {chatInfo.users.find(
              (user: User) =>
                user._id ===
                chat.message.find((msg: any) => msg.id === chat.pinned).senderId
            ).image ? (
              <CustomImage
                src={
                  chatInfo.users.find(
                    (user: User) =>
                      user._id ===
                      chat.message.find((msg: any) => msg.id === chat.pinned)
                        .senderId
                  ).image
                }
                alt="profile picture"
                className="size-full"
                width={0}
                height={0}
                transformation={[{ quality: 10 }]}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <FontAwesomeIcon icon={faUser} className="m-0" />
            )}
          </div>
        </div>
      )}

      <ul
        ref={messageListRef}
        className={`h-[400px] w-full flex flex-col-reverse justify-items-end gap-1 py-4 px-2 overflow-y-scroll overflow-x-auto no-scrollbar relative z-40`}
        onScroll={handleScroll}
      >
        {showScrollToBottom && (
          <button
            className="Icon_small fixed left-[50%] -translate-x-[50%]"
            onClick={handleScrollToBottom}
            style={{ zIndex: 100 }}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        )}
        {isLoading ? (
          <AppLogoLoader />
        ) : (
          <>
            {isReplying && (
              <div className="OtherMessageRow">
                <div className="Other_message_upper px-2 py-1 animate-pulse">
                  . . .
                </div>
              </div>
            )}
            {[
              ...messages.map((message: any) => ({
                ...message,
                variant: "message",
              })),
              ...chat.log.map((log: any) => ({ ...log, variant: "log" })),
            ]
              .sort((a: any, b: any) => b.createdAt - a.createdAt)
              .map((message: any, index: number) =>
                message.variant === "message" ? (
                  <li
                    ref={(el) => {
                      chatItemRef.current[message.id] = el;
                    }}
                    key={message.createdAt}
                    className="flex flex-col"
                    style={{ zIndex: 99 - index }}
                  >
                    <ChatItem
                      message={{
                        ...message,
                        reactions: message.reactions.map((reaction: any) => ({
                          ...reaction,
                          user: chatInfo.users.find(
                            (user: User) => user._id === reaction.userId
                          ),
                        })),
                      }}
                      isPinned={
                        !!chat.pinned &&
                        !!message.id &&
                        chat.pinned === message.id
                      }
                      user={chatInfo.users?.find(
                        (user: User) => user._id === message.senderId
                      )}
                      messageClass={getMessageClass(message)}
                      handleDelete={() =>
                        removeChatItem(chatInfo.chatId, message.id)
                      }
                      handleAddReaction={(reaction: Reaction) =>
                        addChatItemReaction(
                          chatInfo.chatId,
                          message.id,
                          reaction,
                          session?.user.id || ""
                        )
                      }
                      handlePin={() =>
                        pinMessage(
                          chatInfo.chatId,
                          message.id,
                          session?.user.id || ""
                        )
                      }
                    />
                    {index === 0 && (
                      <span
                        className={`${
                          message.senderId === session?.user.id ||
                          message.senderId === "user"
                            ? "text-right"
                            : "text-left"
                        } text-xs`}
                      >
                        {formatTimeAgoWithoutAgo(
                          chatInfo.type === "ai"
                            ? message.createdAt // Nếu từ AI (MongoDB)
                            : message.createdAt?.toDate?.() ||
                                new Date(message.createdAt) // Nếu từ người dùng (Firestore)
                        )}
                      </span>
                    )}
                  </li>
                ) : (
                  <li
                    key={index}
                    className="text-xs text-center opacity-70 rounded-lg py-[2px] px-[6px] bg-secondary-2 w-fit mx-auto my-2"
                  >
                    {
                      //0: create chat
                      //1: pin message
                      //2: leave chat
                      //3: join chat
                      //4: kick user
                      //5: change theme
                      message.type === 0 ? (
                        <FontAwesomeIcon icon={faPuzzlePiece} />
                      ) : message.type === 1 ? (
                        <FontAwesomeIcon icon={faMapPin} />
                      ) : message.type === 2 ? (
                        <FontAwesomeIcon icon={faRightFromBracket} />
                      ) : message.type === 3 ? (
                        <FontAwesomeIcon icon={faRightToBracket} />
                      ) : message.type === 4 ? (
                        <FontAwesomeIcon icon={faHandPointRight} />
                      ) : message.type === 5 ? (
                        <FontAwesomeIcon icon={faPalette} />
                      ) : message.type === 6 ? (
                        <FontAwesomeIcon icon={faUserTie} />
                      ) : (
                        ""
                      )
                    }{" "}
                    {RenderLog(
                      message.type,
                      chatInfo.users?.find(
                        (user: User) => user._id === message.userId
                      )?.username
                    )}
                  </li>
                )
              )}
          </>
        )}
      </ul>
      <ChatBar isBlocked={isBlocked} blocked={blocked} setMessage={setMessages} />
    </div>
  );
}
