"use client";
import InputBox from "@components/Input/InputBox";
import { ChatContext } from "@components/UI/Nav";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);
import {
  faFaceSmile,
  faImage,
  faMinus,
  faPaperPlane,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "@lib/firebase";
import {
  arrayUnion,
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
import { uploadImage } from "@lib/upload";

export default function ChatBox({}: {}) {
  const { chatInfo, setChatInfo } = useContext(ChatContext);
  const [isMinimize, setIsMinimize] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [chat, setChat] = useState<any>("");
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const messageBoxRef = useRef<HTMLUListElement>(null);

  const handleOpenEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };

  const handleEmojiSelect =(emojiData: any, event: MouseEvent) => {
    setText(t=>t+emojiData.emoji)
  }
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleMinimizeChat = () => {
    setIsMinimize((prev) => !prev);
  };
  const handleCloseChat = () => {
    setChatInfo(null);
  };
  const handleSendClick =() => {
    if (text === "" || !session) return;
    handleSend({ file: null, url: "" })
  }

  const handleSend = async (image: { file: File | null; url: string }) => {
    if(!session) return
    if(!image.file&&text === "") return
    let imageURL = ''
    if(image.file)
      imageURL = await uploadImage(image.file)
    try {
      await updateDoc(doc(db, "chat", chatInfo.chatId), {
        message: arrayUnion({
          senderId: session.user.id,
          text,
          image:imageURL?imageURL:null,
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

          usersChatData.chat[chatIndex].lastMessage = text?text:'new image';
          usersChatData.chat[chatIndex].isSeen = id === session.user.id;
          usersChatData.chat[chatIndex].updatedAt = Date.now();

          await updateDoc(usersChatRef, {
            chat: usersChatData.chat,
          });
        }
      });
      setText("");
    } catch (error) {}
  };

  useEffect(() => {
    messageBoxRef.current &&
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [messageBoxRef.current?.scrollHeight]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chat", chatInfo.chatId), (res) => {
      setChat(res.data());
    });
    setIsMinimize(false);

    return () => {
      unSub();
    };
  }, [chatInfo]);

  return (
    <div
      className={`fixed text-accent bottom-0 right-0 sm:right-20 w-full sm:w-[400px] max-h-[500px]  flex flex-col rounded-t-xl z-50 backdrop-blur-lg border-x-[1px] border-t-[1px] shadow-xl border-accent`}
    >
      <div className="flex  bg-secondary-2/70 p-1 shadow-md h-[50px] rounded-t-lg ">
        <div className="flex items-center gap-2">
          <UserProfileIcon currentUser={false} user={chatInfo.user} />
          <h1 className="font-semibold">{chatInfo.user.username}</h1>
        </div>
        <div className="ml-auto flex flex-row">
          <button className="Icon_small" onClick={handleMinimizeChat}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <button className="Icon_small" onClick={handleCloseChat}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
      </div>
        <div className={`${isMinimize?'hidden':'inline-block'}`}>
          <ul
            ref={messageBoxRef}
            className="h-[400px] w-full bg-secondary-2/50 flex flex-col  gap-2 py-4 px-2 overflow-y-scroll no-scrollbar"
          >
            {chat?.message?.map((message: any,index:number) => (
              <div
                key={index}
                className={`${
                  message.senderId === session?.user.id
                    ? "My_message"
                    : "Other_message"
                }`}
              >
                <div>
                  {message.image && (
                    <img src={message.image} alt="message image" />
                  )}
                  <p>{message.text}</p>
                  {/* <span>{message.updateAt}</span> */}
                </div>
              </div>
            ))}
          </ul>
          <div className="flex items-center bg-secondary-2/70 p-1 h-[50px] shadow-md gap-2">
            <ImageInput image='' type='TextImage' setImage={handleSend}/>
            <InputBox
              value={text}
              style={{ border: "none" }}
              onTextChange={handleTextChange}
              type="Input"
            >
              Say something
            </InputBox>
            <div className="relative">
              <div className="absolute bottom-full right-0">
                <EmojiPicker height={"350px"} onEmojiClick={handleEmojiSelect} open={isEmojiPickerOpen} />
              </div>
              <button className="Icon_small" onClick={handleOpenEmojiPicker}>
                <FontAwesomeIcon icon={faFaceSmile} />
              </button>
            </div>
            <button className="Icon_small" onClick={handleSendClick}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
    </div>
  );
}
