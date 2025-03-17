import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import FriendSearchSection from "../ChatTabComponent/FriendSearchSection";
import { User } from "@lib/types";
import { ChatBoxView } from "@enum/chatBoxView";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import {
  faAngleLeft,
  faMinus,
  faUserPlus,
  faUsers,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import SubmitButton from "@components/Input/SubmitButton";
import { faSquare } from "@node_modules/@fortawesome/free-regular-svg-icons";
import { SubmitButtonState } from "@enum/submitButtonState";
import { joinChat } from "@lib/Chat/chat";
import { toast } from "@node_modules/sonner/dist";
import { toastMessage } from "@components/Notification/Toaster";

export default function AddMemberView({
  chat,
  chatInfo,
  setChatBoxView,
  setIsLoading
}: {
  chat: any;
  chatInfo: any;
  setChatBoxView: Dispatch<SetStateAction<ChatBoxView>>;
  setIsLoading: (state: boolean) => void;
}) {
  const [members, setMembers] = useState<User[]>([]);
  const [addMemberState, setAddMemberState] = useState<SubmitButtonState>(
    SubmitButtonState.IDLE
  );
  const handleAddMember = (user: User) => {
    setMembers((prev) => {
      // Check if user already exists in the members array
      if (prev.some((member) => member._id === user._id)) {
        return prev; // Return previous state if user already exists
      }
      return [...prev, user]; // Add user if they are not already in the list
    });
  };

  const handleRemoveMember = (user: User) => {
    setMembers((prev) => prev.filter((member) => member._id !== user._id));
  };

  const handleAddMemberToChat = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const memberIds = members.map((user: User) => user._id);

    try {
      setAddMemberState(SubmitButtonState.PROCESSING);

      await Promise.all(
        memberIds.map(async (id) => {
          await joinChat(chatInfo.chatId, id);
        })
      );

      setAddMemberState(SubmitButtonState.SUCCESS);
      setChatBoxView(ChatBoxView.SETTING)
      toastMessage(`New member added to chat`)
    } catch (error) {
      console.log(error);
      setAddMemberState(SubmitButtonState.FAILED);
    }
  };
  return (
    <>
      <div className="w-full justify-center grid grid-cols-3 h-[30px] bg-secondary-2/50 items-center px-2">
        <button
          className="Icon_smaller"
          onClick={() => setChatBoxView(ChatBoxView.SETTING)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-lg font-semibold text-center content-center">
          Add
        </span>
      </div>
      <form
        onSubmit={handleAddMemberToChat}
        className="flex flex-col w-full h-full p-2 items-center gap-1"
      >
        <FriendSearchSection
          onSelected={handleAddMember}
          filter={chat.memberIds}
        />
        <div>
          New Members <FontAwesomeIcon icon={faUsers} />
        </div>
        <ul className="flex flex-col w-full h-[200px] overflow-scroll no-scrollbar bg-primary/80 rounded-lg p-1 gap-2">
          {members.length > 0 ? (
            members.map((member, index) => (
              <li
                className="flex flex-row justify-between items-center gap-2"
                key={index}
              >
                <UserProfileIcon
                  currentUser={false}
                  user={member}
                  size="Icon_small"
                />
                <div className="grow font-bold text-accent">
                  {member.username}
                </div>
                <button
                  className="Icon_smaller"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveMember(member);
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
              </li>
            ))
          ) : (
            <div className="m-auto opacity-50">
              add your friends <FontAwesomeIcon icon={faUserPlus} />
            </div>
          )}
        </ul>
        {members.length > 0 && (
          <SubmitButton
            style="w-[80%]"
            changeState={setAddMemberState}
            state={addMemberState}
          >
            + Add
          </SubmitButton>
        )}
      </form>
    </>
  );
}
