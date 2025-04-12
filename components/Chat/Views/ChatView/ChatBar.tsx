import EmojiInput from "@components/Input/EmojiInput";
import ImageInput from "@components/Input/ImageInput";
import InputBox from "@components/Input/InputBox";
import { db } from "@lib/firebase";
import { UploadImage, User } from "@lib/types";
import { uploadImage } from "@lib/upload";
import {
  faMinus,
  faPaperPlane,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  increment,
} from "firebase/firestore";
import { useSession } from "@node_modules/next-auth/react";
import React, { useContext, useState } from "react";
import { text } from "stream/consumers";

import TextAreaInput from "@components/Input/TextAreaInput";
import { sendMessage } from "@lib/Chat/chat";

import { v4 as uuidv4 } from "uuid";
import { getAIResponse } from "@actions/aiChatActions";
import { ChatBoxContext } from "@components/Chat/ChatBox";
import { ChatContext } from "@components/UI/Layout/Nav";

export default function ChatBar({
  isBlocked,
  blocked,
}: {
  isBlocked: boolean;
  blocked: boolean;
}) {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const { chat, setChat, setIsReplying } = useContext(ChatBoxContext);
  const { chatInfo } = useContext(ChatContext);

  const [imageQueue, setImageQueue] = useState<UploadImage[]>([]);

  const [isWaiting, setIsWaiting] = useState(true);
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    setText(e.target.value);
  };

  const handleAddImage = (image: UploadImage[]) => {
    setImageQueue((prev) => [...prev, image[0]]);
  };

  const handleRemoveImage = (index: number) => {
    setImageQueue((prev) => prev.filter((_: any, i: number) => i !== index));
  };

  const handleSend = async () => {
    if ((!imageQueue.length && text === "") || isBlocked || !session) return;
    const messageText = text;
    const uploadImageQueue = imageQueue;
    setText("");
    setImageQueue([]);

    if (chatInfo.type === "ai") {
      const userMessage = {
        senderId: "user",
        text: text,
        createdAt: new Date(),
        reactions: [],
        image: [],
        delete: false,
      };

      setChat((prev: any) => ({
        ...prev!,
        message: [userMessage,...prev!.message, ],
      }));
      setIsReplying(true);
      const reply = await getAIResponse(text, session.user.id);
      const aiResponse = {
        senderId: "gemini-ai",
        text: reply,
        createdAt: new Date(),
        reactions: [],
        image: [],
        delete: false,
      };
      setIsReplying(false);
      setChat((prev: any) => ({
        ...prev!,
        message: [ aiResponse,...prev!.message,],
      }));
      return;
    }

    sendMessage(messageText, uploadImageQueue, chatInfo.chatId);
  };

  return (
    <div
      className={`grid ${
        chatInfo.type === "ai"
          ? "grid-cols-[1fr_auto_auto]"
          : "grid-cols-[auto_1fr_auto_auto]"
      } items-center bg-secondary-1 p-1 min-h-[50px] grow fixed bottom-0 shadow-md gap-2 w-full z-40`}
    >
      {!(isBlocked || blocked) ? (
        <>
          {chatInfo.type !== "ai" && (
            <ImageInput image={[]} type="TextImage" setImage={handleAddImage} />
          )}
          <div className="flex flex-col gap-2 bg-secondary-2/30 rounded-2xl">
            {imageQueue.length > 0 && (
              <ul className="flex flex-wrap gap-2 p-1 overflow-scroll no-scrollbar max-h-[100px]">
                {imageQueue.map(
                  (
                    image: { file: File | null; url: string },
                    index: number
                  ) => (
                    <li
                      className="relative  min-h-[50px] min-w-[50px] size-[50px]"
                      key={index}
                    >
                      <img
                        src={image.url}
                        alt="profile picture"
                        className="size-full rounded-lg overflow-hidden"
                        style={{ objectFit: "cover" }}
                      ></img>
                      <button
                        className="absolute -top-1 -right-1 bg-secondary-2 size-4 rounded-full flex items-center justify-center"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <FontAwesomeIcon icon={faMinus} size="xs" />
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
            <TextAreaInput
              value={text}
              style={{ border: "none" }}
              onTextChange={handleTextChange}
              type="Input"
            >
              Say something
            </TextAreaInput>
          </div>
          <EmojiInput setEmoji={setText} />
          <button className="Icon_small" onClick={handleSend}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </>
      ) : (
        <>
          <ImageInput image={[]} type="TextImage" setImage={() => {}} />
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
  );
}
