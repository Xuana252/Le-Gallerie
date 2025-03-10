"use client";
import DropDownButton from "@components/Input/DropDownButton";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@lib/firebase";
import { fetchUserWithId } from "@actions/accountActions";
import ChatTab from "./ChatTab";

export default function ChatButton({
  returnUnseenCount,
}: {
  returnUnseenCount: Dispatch<SetStateAction<number>>;
}) {
  const [chatList, setChatList] = useState<any>([]);
  const [unseenMessageCount, setUnseenMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    setIsLoading(true);
    const unSub = onSnapshot(
      doc(db, "usersChat", session?.user.id || ""),
      async (res) => {
        const items = res.data()?.chat;
        let count = 0;
        const promises = items?.map(async (item: any) => {
          const chatDocSnap = await getDoc(doc(db, "chat", item.chatId));
          if (chatDocSnap.exists()) {
            const chatData = chatDocSnap.data();
            const users = await Promise.all(
              item.receiverIds.map(
                async (id: string) => await fetchUserWithId(id)
              )
            );
            if (!item.isSeen) count++;
            return {
              ...item,
              type:chatData.type,
              image:chatData.image||"",
              name:chatData.name||"",
              users: [
                ...users,
                {
                  ...session?.user,
                  _id: session?.user.id,
                  username: session?.user.name,
                },
              ],
            };
          } else {
            return null
          }
        });
        const chatData = promises ? await Promise.all(promises) : [];
        setUnseenMessageCount(count);
        returnUnseenCount(count);
        setChatList(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        setIsLoading(false);
      }
    );
    return () => {
      unSub();
    };
  }, []);

  return (
    <DropDownButton
      dropDownList={<ChatTab chatList={chatList} isLoading={isLoading} />}
      Zindex={50}
    >
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
