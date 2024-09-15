"use client";
import InputBox from "@components/Input/InputBox";
import { ChatContext } from "@components/UI/Nav";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleDown,
  faAngleLeft,
  faAngleUp,
  faBan,
  faBars,
  faCommentDots,
  faFaceSmile,
  faMinus,
  faPaperPlane,
  faPlus,
  faTrash,
  faUser,
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
import { useSession } from "next-auth/react";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ImageInput from "@components/Input/ImageInput";
import { removeImage, uploadImage } from "@lib/upload";
import EmojiInput from "@components/Input/EmojiInput";
import Image from "@components/UI/Image";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import toastError, { confirm } from "@components/Notification/Toaster";
import CustomImage from "@components/UI/Image";
import { blockUser, fetchUserWithId } from "@server/accountActions";
import { AppLogoLoader, Spinner } from "@components/UI/Loader";

export default function ChatBox({}: {}) {
  const router = useRouter();
  const { chatInfo, setChatInfo } = useContext(ChatContext);
  const [chatBoxView, setChatBoxView] = useState<
    "Chat" | "Setting" | "Media"
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [chat, setChat] = useState<any>([]);
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [isBlocked, setIsBlocked] = useState<boolean>(false); //from the other user
  const [blocked, setBlocked] = useState<boolean>(false); //us blocking the other user

  const checkChatUserBLock = async (userId: string) => {
    try {
      const response = await fetchUserWithId(userId);
      const checkResult = response.blocked.find(
        (userId: string) => userId === session?.user.id
      );
      setIsBlocked(checkResult);
      return checkResult;
    } catch (error) {
      console.log("Error while checking block state", error);
      return false;
    }
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const toggleMinimized = () => {
    setIsMinimized((prev) => !prev);
  };

  const handleChatView = () => {
    setIsMinimized(false);
    setChatBoxView("Chat");
  };

  const handleCustomView = () => {
    setIsMinimized(false);
    setChatBoxView("Setting");
  };
  const handleCloseChat = () => {
    if (isLoading) return;
    setChatInfo(null);
  };
  const handleSendClick = () => {
    if (text === "" || !session) return;
    handleSend({ file: null, url: "" });
  };

  const handleChangeBlockState = async (userId: string) => {
    if (!session?.user.id) return;
    if (!blocked) {
      const result = await confirm(
        `Do you want to block ${chatInfo.user.username}`
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
      if (!response) {
        setBlocked((prev) => !prev);
      }
    } catch (error) {
      toastError("Error");
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!session) return;
    const confirmation = await confirm("Do you want to remove this chat?");
    if (!confirmation) return;
    setIsLoading(true);
    const usersChatRef = collection(db, "usersChat");
    try {
      const imageQueue: Promise<any>[] = [];

      // Add image removal promises to the queue
      chat?.message?.forEach((message: any) => {
        if (message.image) {
          imageQueue.push(removeImage(message.image)); // Push each image removal promise
        }
      });

      // Wait for all images to be removed if there are any
      if (imageQueue.length > 0) {
        await Promise.all(imageQueue);
      }
      const removeChatFromUser = async (userId: string) => {
        const userChatDoc = await getDoc(doc(usersChatRef, userId));

        if (userChatDoc.exists()) {
          const userChatData = userChatDoc.data();
          const chatArray = userChatData.chat || [];

          // Find the exact chat object with chatId
          const chatToRemove = chatArray.find(
            (chat: any) => chat.chatId === chatId
          );

          if (chatToRemove) {
            await updateDoc(doc(usersChatRef, userId), {
              chat: arrayRemove(chatToRemove),
            });
          }
        }
      };

      // Remove chat from both users' chat arrays
      await removeChatFromUser(chatInfo.user._id);
      await removeChatFromUser(session.user.id || "");

      await deleteDoc(doc(db, "chat", chatId));
      console.log("Chat deleted successfully");
      setIsLoading(false);
      setChatInfo(null);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleSend = async (image: { file: File | null; url: string }) => {
    setText("");
    if (!session) return;
    if (
      (!image.file && text === "") ||
      (await checkChatUserBLock(chatInfo.user._id))
    )
      return;
    let imageURL = "";
    if (image.file) imageURL = await uploadImage(image.file);
    try {
      await updateDoc(doc(db, "chat", chatInfo.chatId), {
        message: arrayUnion({
          senderId: session.user.id,
          text,
          image: imageURL ? imageURL : null,
          createdAt: new Date(),
        }),
      });

      const usersIds = [session.user.id, chatInfo.user._id];

      usersIds.forEach(async (id) => {
        const usersChatRef = doc(db, "usersChat", id);
        const usersChatSnapShot = await getDoc(usersChatRef);

        if (usersChatSnapShot.exists()) {
          const usersChatData = usersChatSnapShot.data();

          const chatIndex = usersChatData.chat.findIndex(
            (c: any) => c.chatId === chatInfo.chatId
          );

          usersChatData.chat[chatIndex].lastMessage = text ? text : "new image";
          usersChatData.chat[chatIndex].isSeen = id === session.user.id;
          usersChatData.chat[chatIndex].updatedAt = Date.now();

          await updateDoc(usersChatRef, {
            chat: usersChatData.chat,
          });
        }
      });
    } catch (error) {}
  };

  useEffect(() => {
    lastMessageRef.current &&
      lastMessageRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
  }, [chat?.message?.length, chatInfo]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chat", chatInfo.chatId), (res) => {
      setChat(res.data());
      checkChatUserBLock(chatInfo.user._id);
    });
    setBlocked(
      !!(
        session?.user.blocked &&
        session.user.blocked.find(
          (userId: string) => userId === chatInfo.user._id
        )
      )
    );
    setIsBlocked(
      chatInfo.user.blocked.find(
        (userId: string) => userId === session?.user.id
      )
    );

    setChatBoxView("Chat");
    return () => {
      unSub();
    };
  }, [chatInfo]);

  const MediaView = (
    <div
      className={`${
        chatBoxView === "Media" ? "inline-block" : "hidden"
      } flex flex-col backdrop-blur-sm bg-primary/70 absolute top-0 left-0 z-40 items-center py-1 px-1 size-full`}
    >
      <div className="w-full justify-center grid grid-cols-3">
        <button
          className="Icon_small"
          onClick={() => setChatBoxView("Setting")}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-lg font-semibold text-center content-center">
          Media
        </span>
      </div>
      <div className="grid grid-cols-3 overflow-y-scroll no-scrollbar gap-1 w-full">
        {chat?.message?.map((message: any, index: number) =>
          message.image ? (
            <div key={index} className="aspect-square cursor-zoom-in size-full">
              <CustomImage
                src={blocked||isBlocked?"":message.image}
                alt="picture"
                className="size-full"
                onerror
                width={0}
                height={0}
                transformation={[{ quality: 50 }]}
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : null
        )}
      </div>
    </div>
  );

  const CustomView = (
    <div
      className={`${
        chatBoxView === "Setting" ? "inline-block" : "hidden"
      } grid grid-cols-1 gap-4 backdrop-blur-sm bg-primary/70 overflow-y-scroll no-scrollbar absolute top-0 left-0 z-40 items-center p-4 size-full`}
    >
      <div className="grid grid-cols-1 place-items-center">
        <div className="relative size-28 rounded-full bg-secondary-2 overflow-hidden shadow-xl flex items-center justify-center">
          {chatInfo.user.image ? (
            <CustomImage
              src={chatInfo.user.image}
              alt="profile picture"
              className="size-full"
              width={0}
              height={0}
              transformation={[{ quality: 10 }]}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="text-9xl mt-4">
              <FontAwesomeIcon icon={faUser} />
            </div>
          )}
        </div>
        <span className="text-3xl font-bold">{chatInfo.user.username}</span>
      </div>
      <div>
        <div className="font-bold text-accent/70 indent-3">Action</div>
        <div className="grid grid-cols-1 w-full rounded-lg bg-secondary-1/60 font-bold text-lg ">
          <button
            className="outline-none flex gap-2 w-full h-fit min-h-[54px] items-center  p-2 border-b-2 border-accent last:border-none hover:bg-primary   first:rounded-t-lg last:rounded-b-lg overflow-hidden"
            onClick={() => {
              router.push(`/profile/${chatInfo.user._id}`);
            }}
          >
            <div className="Icon_small">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span className="grow text-md text-left">View user profile</span>
          </button>
          <button
            className="outline-none flex gap-2 w-full min-h-[54px] items-center p-2 border-b-2 border-accent last:border-none hover:bg-primary first:rounded-t-lg last:rounded-b-lg overflow-hidden"
            onClick={() => setChatBoxView("Media")}
          >
            <div className="Icon_small">
              <FontAwesomeIcon icon={faImage} />
            </div>
            <span className="grow text-md text-left">View media</span>
          </button>
        </div>
      </div>
      <div>
        <div className="font-bold text-accent/70 indent-3">
          Privacy & Support
        </div>
        <div className="grid grid-cols-1 w-full rounded-lg bg-secondary-1/60 font-bold text-lg ">
          <button
            className="outline-none flex gap-2 w-full h-fit min-h-[54px] items-center p-2 border-b-2 border-accent last:border-none hover:bg-primary first:rounded-t-lg last:rounded-b-lg overflow-hidden"
            onClick={() => handleChangeBlockState(chatInfo.user._id)}
          >
            <div className="Icon_small">
              <FontAwesomeIcon icon={faBan} />
            </div>
            <span className="grow text-md text-left text-red-500">
              {blocked ? "Unblock" : "Block"} user
            </span>
          </button>
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
        </div>
      </div>
    </div>
  );

  const ChatBoxView = (
    <>
      <ul className="h-[400px] w-full bg-secondary-2/50 flex flex-col justify-items-end gap-2 py-4 px-2 overflow-y-scroll no-scrollbar">
        {chat?.message?.map((message: any, index: number) => (
          <div
            ref={index === chat.message.length - 1 ? lastMessageRef : null}
            key={index}
            className={`${
              message.senderId === session?.user.id
                ? "My_message"
                : "Other_message"
            }`}
          >
            <div>
              {message.image && (
                <CustomImage
                  src={message.image}
                  alt="message image"
                  className="size-full"
                  width={0}
                  height={0}
                  transformation={[{ quality: 10 }]}
                  style={{ objectFit: "cover" }}
                />
              )}
              <p>{message.text}</p>
              <span>{message.updateAt}</span>
            </div>
          </div>
        ))}
      </ul>
      <div className="flex items-center bg-secondary-2/70 p-1 h-[50px] shadow-md gap-2">
        {!(isBlocked||blocked)&&<>
          <ImageInput image="" type="TextImage" setImage={handleSend} />
          <InputBox
            value={text}
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
        </>}
      </div>
    </>
  );

  return (
    <div
      className={`fixed text-accent bottom-0 right-0 sm:right-20 mx-[20px] sm:w-[400px] max-h-[500px]  flex flex-col rounded-t-xl z-40 backdrop-blur-lg border-x-[1px] border-t-[1px] shadow-xl border-accent`}
    >
      <div className="flex  bg-secondary-2/70 p-1 gap-4 shadow-md h-[50px] rounded-t-lg ">
        <div className="flex items-center gap-2">
          <UserProfileIcon currentUser={false} user={chatInfo.user} />
          <h1 className="font-semibold max-w-[150px] overflow-x-hidden overflow-ellipsis whitespace-nowrap">
            {chatInfo.user.username}
          </h1>
        </div>
        <div className="ml-auto flex flex-row">
          <button
            className="Icon_small"
            onClick={
              chatBoxView === "Setting" ? handleChatView : handleCustomView
            }
          >
            <FontAwesomeIcon
              icon={chatBoxView === "Setting" ? faCommentDots : faBars}
            />
          </button>
          <button className="Icon_small" onClick={toggleMinimized}>
            <FontAwesomeIcon icon={isMinimized ? faAngleUp : faAngleDown} />
          </button>
          <button className="Icon_small" onClick={handleCloseChat}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
      </div>
      <div className={`${isMinimized ? "hidden" : "inline-block"} relative`}>
        {((isBlocked || blocked) && chatBoxView !== "Setting") || isLoading ? (
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
                  onClick={() => setChatBoxView("Setting")}
                >
                  See setting
                </button>
              </>
            )}
          </div>
        ) : null}
        {MediaView}
        {CustomView}
        {ChatBoxView}
      </div>
    </div>
  );
}
