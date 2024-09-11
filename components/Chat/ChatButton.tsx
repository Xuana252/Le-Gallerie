"use client";
import DropDownButton from "@components/Input/DropDownButton";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ChatList from "./ChatList";
import { useSession } from "next-auth/react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@lib/firebase";
import { fetchUserWithId } from "@server/accountActions";

export default function ChatButton({returnUnseenCount}:{returnUnseenCount:Dispatch<SetStateAction<number>>}) {
  const [chats, setChats] = useState<any>([]);
  const [unseenMessageCount,setUnseenMessageCount] = useState(0)
  const { data: session } = useSession();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "usersChat", session?.user.id || ""),
      async (res) => {
        const items = res.data()?.chat;
        let count = 0
        const promises = items?.map(async (item:any)=>{
          const user = await fetchUserWithId(item.receiverId)
          if(!item.isSeen)
            count++;
          return {...item,user}
        })
        const chatData = promises?await Promise.all(promises):[]
        setUnseenMessageCount(count)
        returnUnseenCount(count)
        setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt))
      }
    );
    return () => {
      unSub();
    };
  }, [session]);

  return (
    <DropDownButton dropDownList={<ChatList chatList={chats} />} Zindex={50}>
       <div className="relative Icon">
        <div
          className={`${
            unseenMessageCount > 0 ? "" : "hidden"
          } absolute top-1 right-1 rounded-full size-4 bg-primary text-accent text-xs font-bold `}
        >
          {unseenMessageCount}
        </div>
        <FontAwesomeIcon icon={faCommentDots} />
      </div>
    </DropDownButton>
  );
}
