"use client";
import { faUser, faCircle, faUsers, faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@lib/firebase";
import { ChatContext } from "@components/UI/Layout/Nav";
import { formatTimeAgo } from "@lib/dateFormat";
import { User } from "@lib/types";
import { useRouter } from "next/navigation";
import Image from "@components/UI/Image/Image";
import PopupButton from "@components/Input/PopupButton";
import InputBox from "@components/Input/InputBox";
import { startChat } from "@lib/Chat/chat";
import ChatLish from "./ChatTabComponent/ChatList";
import ChatList from "./ChatTabComponent/ChatList";
import RecommendSection from "./ChatTabComponent/FriendSearchSection";
import CreateGroupChatForm from "@components/Forms/GroupChatForm";
import FriendSearchSection from "./ChatTabComponent/FriendSearchSection";
import GroupChatForm from "@components/Forms/GroupChatForm";
import { faBots } from "@node_modules/@fortawesome/free-brands-svg-icons";

export default function ChatTab({
  isLoading,
}: {
  isLoading: boolean;
}) {
  const router = useRouter();

  const { setChatInfo } = useContext(ChatContext);
  const { data: session } = useSession();

  const handleSelectFriend = (user: User) => {
    startChat(user, setChatInfo, router);
  };

  const handleAi=()=>{
    setChatInfo({
      admin: session?.user.id,
      type:"ai",
      log:[],
      message:[]
    })
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center p-1">
          <span className="text-4xl font-bold h-[10%]">Inbox</span>
          <div className="rounded-xl bg-primary/50 p-1 flex flex-row gap-2 items-center">
            <PopupButton popupItem={<GroupChatForm />}>
              <div className="Icon_smaller">
                <FontAwesomeIcon icon={faUsers} title="Add Group Chat" />
              </div>
            </PopupButton>
            <div className="Icon_smaller">
              <FontAwesomeIcon icon={faRobot} title="Chat with AI" onClick={handleAi}/>
            </div>
          </div>
        </div>
        <div className=" w-[300px] h-[400px]  sm:w-[400px] sm:h-[500px] flex flex-col gap-2 bg-secondary-2/50 rounded-t-lg rounded-b-lg p-2">
          <FriendSearchSection onSelected={handleSelectFriend} />
          <ChatList  isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
