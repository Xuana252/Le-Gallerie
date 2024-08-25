"use client";
import { faUser,faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ChatBox from "./ChatBox";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@lib/firebase";

export default function ChatList({chatList}:{chatList:any}) {
  const { data: session } = useSession();
  const [selectedChat, setSelectedChat] = useState<any>(null);

  const handleSelectChat = async(chat:any) => {
    if(!session) return
    const usersChat = chatList.map((item:any) => {
        const {user,...rest} = item
        return rest
    })

    const chatIndex = usersChat.findIndex(
        (item:any)=>item.chatId===chat.chatId
    )

    usersChat[chatIndex].isSeen = true

    const usersChatRef = doc(db, 'usersChat',session?.user.id as string)

    try {
        await updateDoc(usersChatRef, {
            chat:usersChat,
        })
        setSelectedChat(chat)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <span className="text-4xl font-bold h-[10%]">Inbox</span>
        <div className=" w-[400px] h-[500px] flex flex-col">
          <ul
            className={` w-full gap-3 overflow-scroll no-scrollbar flex bg-secondary-2 rounded-t-lg    ${
              selectedChat ? "flex-row h-[15%]" : "flex-col h-full rounded-b-lg "
            } p-2`}
          >
           {chatList.map((chat:any) =>  <li
                key={chat.chatId}
              className="bg-secondary-1 h-[58px] rounded-lg p-1 flex gap-3 cursor-pointer"
              onClick={() => handleSelectChat(chat)}
            >
              <div className="Icon_big bg-secondary-2 pointer-events-none">
               {chat.user.image
               ?<img src={chat.user.image} alt="profile picture" className="size-full"></img>
                :<FontAwesomeIcon icon={faUser} />}
              </div>
              <div className="flex flex-col grow items-baseline pointer-events-none">
                <span className="font-bold">{chat.user.username}</span>
                <div className="flex flex-row text-sm">
                    <div className=" inline-block   whitespace-nowrap max-w-[100px] overflow-x-hidden">
                      {chat.lastMessage}
                    </div>
                    <span>...</span>
                </div>
              </div>
              <div className="flex flex-col items-end pointer-events-none">
                <div className="grow content-start flex items-start">
                  {chat.isSeen?null:<FontAwesomeIcon icon={faCircle} size="xs" />}
                </div>
                <span className="text-xs">{'not now'}</span>
              </div>
            </li>)}
          </ul>
          {selectedChat&&<ChatBox selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>}
        </div>
      </div>
    </>
  );
}
