import EmojiInput from "@components/Input/EmojiInput";
import ImageInput from "@components/Input/ImageInput";
import InputBox from "@components/Input/InputBox";
import CustomImage from "@components/UI/Image";
import { formatTimeAgoWithoutAgo } from "@lib/dateFormat";
import { db } from "@lib/firebase";
import { uploadImage } from "@lib/upload";
import { updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import {
  faArrowDown,
  faArrowRightFromFile,
  faHandPointRight,
  faMapPin,
  faPalette,
  faPallet,
  faPaperPlane,
  faPuzzlePiece,
  faRightFromBracket,
  faRightToBracket,
  faUser,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import { User } from "@lib/types";
import ReactionButton from "@components/Input/ReactionInput";
import { Reaction } from "@app/enum/reactionEnum";
import ChatItem from "../ChatItem";
import {
  addChatItemReaction,
  pinMessage,
  removeChatItem,
  RenderLog,
} from "@lib/Chat/chat";
import { faUsb } from "@node_modules/@fortawesome/free-brands-svg-icons";
import { v4 as uuidv4 } from "uuid";

export default function ChatView({
  chat,
  chatInfo,
  isBlocked,
  blocked,
}: {
  chat: any;
  chatInfo: any;
  isBlocked: boolean;
  blocked: boolean;
}) {
  const [text, setText] = useState("");
  const { data: session, update } = useSession();
  const messageListRef = useRef<HTMLUListElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const chatItemRef = useRef<{ [key: string]: HTMLLIElement | null }>({});

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
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, [chatInfo?.chatId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setText(e.target.value);
  };

  const handleSendClick = () => {
    if (text === "" || !session) return;
    handleSend({ file: null, url: "" });
  };

  const handleSend = async (image: { file: File | null; url: string }) => {
    setText("");
    if (!session) return;
    if ((!image.file && text === "") || isBlocked) return;
    let imageURL = "";
    if (image.file) imageURL = await uploadImage(image.file);
    try {
      await updateDoc(doc(db, "chat", chatInfo.chatId), {
        message: arrayUnion({
          id: uuidv4(),
          senderId: session.user.id,
          text,
          image: imageURL ? imageURL : null,
          delete: false,
          reactions: [],
          createdAt: new Date(),
        }),
      });

      const usersIds = [
        session.user.id,
        ...chatInfo.users.map((user: User) => user._id),
      ];

      usersIds.forEach(async (id) => {
        const usersChatRef = doc(db, "usersChat", id);
        const usersChatSnapShot = await getDoc(usersChatRef);

        if (usersChatSnapShot.exists()) {
          const usersChatData = usersChatSnapShot.data();

          const chatIndex = usersChatData.chat.findIndex(
            (c: any) => c.chatId === chatInfo.chatId
          );

          if(chatIndex!==-1) {
            usersChatData.chat[chatIndex].lastMessage = text ? text : "new image";
            usersChatData.chat[chatIndex].isSeen = id === session.user.id;
            usersChatData.chat[chatIndex].updatedAt = Date.now();
  
            await updateDoc(usersChatRef, {
              chat: usersChatData.chat,
            });
          }
          
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [chat?.message?.length, chatInfo]);

  const getMessageClass = (message: any) => {
    const isMine = message.senderId === session?.user.id;
    const baseClass = isMine ? "My_message" : "Other_message";

    const currentIndex = chat.message.findIndex((msg:any)=>msg.id===message.id)
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
    <>
      {chat.pinned&& (
        <div
          className="absolute left-[50%] -translate-x-[50%] rounded-full bg-accent w-fit p-2 mt-2 text-primary flex flex-row items-center gap-2 hover:-translate-y-[4px] hover:opacity-100 opacity-50 z-50 duration-200 ease-in-out "
          onClick={handleMoveToPin}
        >
          <FontAwesomeIcon icon={faMapPin} size="xs"/>
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
        className="h-[400px] w-full bg-secondary-2/50 flex flex-col-reverse justify-items-end gap-1 py-4 px-2 overflow-y-scroll overflow-x-auto no-scrollbar relative z-40"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <>
            <div className="OtherMessageRow">
              <div className="Other_message rounded-2xl  animate-pulse">
                <span className="opacity-0">randomDummyText</span>
              </div>
            </div>
            <div className="MyMessageRow">
              <div className="My_message rounded-2xl  animate-pulse">
                <span className="opacity-0">randomDummyTextButLonger</span>
              </div>
            </div>
            <div className="OtherMessageRow">
              <div className="Other_message_under  animate-pulse">
                <span className="opacity-0">randomDummyTextShort</span>
              </div>
            </div>
            <div className="OtherMessageRow">
              <div className="Other_message_upper   animate-pulse">
                <span className="opacity-0">No</span>
              </div>
            </div>
            <div className="MyMessageRow">
              <div className="My_message rounded-2xl  animate-pulse">
                <span className="opacity-0">OK</span>
              </div>
            </div>
          </>
        ) : (
          [
            ...chat.message.map((message: any) => ({
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
                  key={index}
                  className="flex flex-col"
                  style={{zIndex:99-index}}
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
                    isPinned={chat.pinned === message.id}
                    user={chatInfo.users.find(
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
                        message.senderId === session?.user.id
                          ? "text-right"
                          : "text-left"
                      } text-xs`}
                    >
                      {formatTimeAgoWithoutAgo(message.createdAt.toDate())}
                    </span>
                  )}
                </li>
              ) : (
                <li className="text-xs text-center opacity-70 rounded-lg py-[2px] px-[6px] bg-secondary-2 w-fit mx-auto my-2">
                
                  {
                      //0: create chat
  //1: pin message
  //2: leave chat
  //3: join chat
  //4: kick user
  //5: change theme
                  message.type===0?
                  <FontAwesomeIcon icon={faPuzzlePiece}/>
                  :message.type===1
                  ?<FontAwesomeIcon icon={faMapPin}/>
                  :message.type===2
                  ?<FontAwesomeIcon icon={faRightFromBracket}/>
                  :message.type===3
                  ?<FontAwesomeIcon icon={faRightToBracket}/>
                  :message.type===4
                  ?<FontAwesomeIcon icon={faHandPointRight}/>
                  :message.type===5
                  ?<FontAwesomeIcon icon={faPalette}/>:""
                  }    {" "}
                  {RenderLog(
                    message.type,
                    chatInfo.users.find(
                      (user: User) => user._id === message.userId
                    ).username
                  )}
                 
                </li>
              )
            )
        )}
        {chat?.message?.length < 1 && (
          <div className="top-[50%] left-[50%] -translate-x-[50%] absolute">
            Start chatting...
          </div>
        )}
        {showScrollToBottom && (
          <button
            className="Icon_small fixed left-[50%] -translate-x-[50%]"
            onClick={handleScrollToBottom}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        )}
      </ul>
      <div className="flex items-center bg-secondary-2/70 p-1 h-[50px] shadow-md gap-2">
        {!(isBlocked || blocked) ? (
          <>
            <ImageInput image="" type="TextImage" setImage={handleSend} />
            <InputBox
              value={text}
              onKeyDown={(e) => {
                e.key === "Enter" && handleSendClick();
              }}
              style={{ border: "none" }}
              onTextChange={handleTextChange}
              type="Input"
            >
              Say something
            </InputBox>
            <EmojiInput setEmoji={setText} />
            <button className="Icon_small" onClick={handleSendClick}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </>
        ) : (
          <>
            <ImageInput image="" type="TextImage" setImage={() => {}} />
            <InputBox
              value={""}
              style={{ border: "none" }}
              onTextChange={() => {}}
              type="Input"
            >
              Say something
            </InputBox>
            <EmojiInput setEmoji={() => {}} />
            <button className="Icon_small" onClick={() => {}}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </>
        )}
      </div>
    </>
  );
}
