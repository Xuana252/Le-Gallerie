import InputBox from "@components/Input/InputBox";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import {
  faImage,
  faPaperPlane,
  faPhotoFilm,
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
  useEffect,
  useRef,
  useState,
} from "react";

export default function ChatBox({
  selectedChat,
  setSelectedChat,
}: {
  selectedChat: any;
  setSelectedChat: Dispatch<SetStateAction<any>>;
}) {
  const [chat, setChat] = useState<any>("");
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const messageBoxRef = useRef<HTMLUListElement>(null);

  const changeNewestMessageSeenState = async () => {
    const usersChatRef = doc(db, "usersChat", session?.user.id);
    const usersChatSnapShot = await getDoc(usersChatRef);

    if (usersChatSnapShot.exists()) {
      const usersChatData = usersChatSnapShot.data();

      const chatIndex = usersChatData.chat.findIndex(
        (c: any) => c.chatId === selectedChat.chatId
      );

      usersChatData.chat[chatIndex].isSeen = true;

      await updateDoc(usersChatRef, {
        chat: usersChatData.chat,
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  const handleSend = async () => {
    if (text === "" || !session) return;

    try {
      await updateDoc(doc(db, "chat", selectedChat.chatId), {
        message: arrayUnion({
          senderId: session.user.id,
          text,
          createdAt: new Date(),
        }),
      });

      const usersIds = [session.user.id, selectedChat.user._id];

      usersIds.forEach(async (id) => {
        const usersChatRef = doc(db, "usersChat", id);
        const usersChatSnapShot = await getDoc(usersChatRef);

        if (usersChatSnapShot.exists()) {
          const usersChatData = usersChatSnapShot.data();

          const chatIndex = usersChatData.chat.findIndex(
            (c: any) => c.chatId === selectedChat.chatId
          );

          usersChatData.chat[chatIndex].lastMessage = text;
          usersChatData.chat[chatIndex].isSeen = id === session.user.id;
          usersChatData.chat[chatIndex].updatedAt = Date.now();

          await updateDoc(usersChatRef, {
            chat: usersChatData.chat,
          });
        }
      });
      setText('')
    } catch (error) {}
  };

  useEffect(() => {
    messageBoxRef.current &&
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [chat]);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chat", selectedChat.chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, []);

  return (
    <div className=" w-full h-[85%] flex flex-col">
      <div className="flex  bg-secondary-1 p-1 shadow-md">
        {/* <div className="text-2xl grow">{selectedChat.chatId}</div> */}
        <div className="flex items-center gap-2">
          <UserProfileIcon currentUser={false} user={selectedChat.user} />
          <h1>{selectedChat.user.username}</h1>
        </div>
        <button className="Icon_small ml-auto" onClick={handleCloseChat}>
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
      <ul
        ref={messageBoxRef}
        className="grow w-full bg-secondary-2/50 flex flex-col gap-2 py-4 px-2 overflow-y-scroll no-scrollbar"
      >
        {chat?.message?.map((message: any) => (
          <div
            key={message?.createAt}
            className={`${
              message.senderId === session?.user.id
                ? "My_message"
                : "Other_message"
            }`}
          >
            <div>
              {message.image && <img src={message.image} alt="message image" />}
              <p>{message.text}</p>
              {/* <span>{message.updateAt}</span> */}
            </div>
          </div>
        ))}
      </ul>
      <div className="flex items-center bg-secondary-2/70 p-1 shadow-md rounded-b-xl gap-2">
        <button className="Icon_small">
          <FontAwesomeIcon icon={faImage} />
        </button>
        <InputBox
          value={text}
          style={{ border: "none" }}
          onTextChange={handleTextChange}
          type="Input"
        >
          Say something
        </InputBox>
        <button className="Icon_small" onClick={handleSend}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}
