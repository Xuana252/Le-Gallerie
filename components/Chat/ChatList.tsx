"use client";
import { faUser, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import { arrayUnion, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@lib/firebase";
import { ChatContext } from "@components/UI/Nav";
import { formatTimeAgo } from "@lib/dateFormat";
import { fetchUserFollowers } from "@server/accountActions";
import { User } from "@lib/types";
import { useRouter } from "next/navigation";
import Image from "@components/UI/Image";

export default function ChatList({ chatList }: { chatList: any }) {
  const router = useRouter()
  const { data: session } = useSession();
  const { setChatInfo } = useContext(ChatContext);
  const [followers,setFollowers] = useState<User[]>([])

  const fetchFollowers = async () => {
    const response = await fetchUserFollowers(session?.user.id || "");
    setFollowers(response?.users || []);
  };
  useEffect(()=>{
    fetchFollowers()
  },[session])

  const startChat = async (user:User) => {
    if (!session) {
      const loginConfirm = await confirm("you need to login first");
      if (loginConfirm) {
        router.push("/sign-in");
      }
      return;
    }

    const chatRef = collection(db, "chat");
    const usersChatRef = collection(db, "usersChat");

    try {
      const receiverDocRef = doc(usersChatRef, session.user.id);
      const receiverDocSnap = await getDoc(receiverDocRef);
      let existingChat = null;

      if (receiverDocSnap.exists()) {
        const receiverData = receiverDocSnap.data();

        if (receiverData.chat) {
          existingChat = receiverData.chat.find(
            (chat: any) => chat.receiverId === user._id
          );
          existingChat = existingChat ? { ...existingChat, user } : null;
        }
      }

      if (!existingChat) {
        const newChatRef = doc(chatRef);
        await setDoc(newChatRef, {
          createAt: serverTimestamp(),
          message: [],
        });

        await updateDoc(doc(usersChatRef, user._id), {
          chat: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: session.user.id,
            updatedAt: Date.now(),
          }),
        });
        await updateDoc(doc(usersChatRef, session.user.id), {
          chat: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: user._id,
            updatedAt: Date.now(),
          }),
        });

        const currentUserChatData = await getDoc(
          doc(usersChatRef, session.user.id)
        );
        if (currentUserChatData.exists()) {
          const items = currentUserChatData.data()?.chat || [];

          // Fetch additional user data
          const chatItem = items.find(
            (item: any) => item.receiverId === user._id
          );

          if (chatItem) {
            // Add user data to the chat item
            existingChat = { ...chatItem, user };
          }
        }
      }
      setChatInfo(existingChat);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChat = async (chat: any) => {
    if (!session) return;
    const usersChat = chatList.map((item: any) => {
      const { user, ...rest } = item;
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
    <>
      <div className="flex flex-col">
        <span className="text-4xl font-bold h-[10%]">Inbox</span>
        <div className=" w-[300px] h-[400px]  sm:w-[400px] sm:h-[500px] flex flex-col gap-2 bg-secondary-2/50 rounded-t-lg rounded-b-lg p-2">
          <div className="bg-secondary-1/50 rounded-lg">
            <div className="font-semibold text-center">Chat with followers</div>
            <ul className="flex flex-row gap-2 px-2 overflow-x-scroll items-center no-scrollbar ">
              {followers.map(follower =>
                <div key={follower._id} className="flex flex-col h-fit  gap-1 items-center justify-between">
                  <button className={`bg-secondary-2 relative Icon `} onClick={()=>startChat(follower)}>
                    {follower.image? (
                        <Image
                          src={follower.image}
                          alt="profile picture"
                          className="size-full"
                          width={0}
                          height={0}
                          transformation={[{ quality: 10 }]}
                          style={{ objectFit: "cover" }}
                        ></Image>
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="m-0" />
                    )}
                  </button>
                  <span className="text-xs whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[100px]">{follower.username}</span>
                </div>
              )}
            </ul>
          </div>
          <ul
            className={` w-full gap-3 overflow-scroll no-scrollbar flex flex-col h-full  
            `}
          >
            {chatList.map((chat: any) => (
              <li
                key={chat.chatId}
                className="bg-accent text-primary rounded-lg p-2 flex gap-3 cursor-pointer"
                onClick={() => handleSelectChat(chat)}
              >
                <div className="Icon_big bg-secondary-2 pointer-events-none">
                  {chat.user.image ? (
                    <img
                      src={chat.user.image}
                      alt="profile picture"
                      className="size-full"
                    ></img>
                  ) : (
                    <FontAwesomeIcon icon={faUser} />
                  )}
                </div>
                <div className="flex flex-col grow items-baseline pointer-events-none">
                  <span className="font-bold">{chat.user.username}</span>
                  <div className="flex flex-row text-sm">
                    <div className=" inline-block whitespace-nowrap max-w-[100px] overflow-x-hidden overflow-ellipsis">
                      {chat.lastMessage}
                    </div>
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
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
