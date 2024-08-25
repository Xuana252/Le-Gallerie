"use client";
import DropDownButton from "@components/Input/DropDownButton";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import { useSession } from "next-auth/react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@lib/firebase";
import { fetchUserWithId } from "@server/accountActions";

export default function ChatButton() {
  const [chats, setChats] = useState<any>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "usersChat", session?.user.id || ""),
      async (res) => {
        const items = res.data()?.chat;

        const promises = items.map(async (item:any)=>{
          const user = await fetchUserWithId(item.receiverId)
          
          return {...item,user}
        })
        const chatData = await Promise.all(promises)

        setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt))
      }
    );
    return () => {
      unSub();
    };
  }, [session]);

  return (
    <DropDownButton dropDownList={<ChatList chatList={chats} />} Zindex={50}>
      <div className="Icon">
        <FontAwesomeIcon icon={faCommentDots} />
      </div>
    </DropDownButton>
  );
}
