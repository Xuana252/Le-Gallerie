import React, { Dispatch, SetStateAction, useState } from "react";
import FriendSearchSection from "../ChatTabComponent/FriendSearchSection";
import { User } from "@lib/types";
import { ChatBoxView } from "@app/enum/chatBoxView";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import { faAngleLeft, faMinus, faUsers } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import SubmitButton from "@components/Input/SubmitButton";

export default function AddMemberView({
  chat,
  chatInfo,
  setChatBoxView,
}: {
  chat: any;
  chatInfo: any;
  setChatBoxView: Dispatch<SetStateAction<ChatBoxView>>;
}) {
  const [members, setMembers] = useState<User[]>([]);
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
  return (
    <div
      className={`
        flex flex-col backdrop-blur-sm bg-primary/70 items-center size-full`}
    >
      <div className="w-full justify-center grid grid-cols-3 h-[30px] bg-secondary-2/50 items-center px-2">
        <button
          className="Icon_smaller"
          onClick={() => setChatBoxView(ChatBoxView.SETTING)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-lg font-semibold text-center content-center">
          Add member
        </span>
      </div>
      <div className="flex flex-col w-full p-2 items-center gap-1">
          <FriendSearchSection onSelected={handleAddMember} />
          <div>New Members <FontAwesomeIcon icon={faUsers}/></div>
          <ul className="flex flex-col w-full h-[200px] bg-primary/80 rounded-lg p-1 gap-2">
            {members.map((member, index) => (
              <li className="flex flex-row justify-between items-center gap-2">
                <UserProfileIcon
                  currentUser={false}
                  user={member}
                  size="Icon_small"
                />
                <div className="grow font-bold text-accent">{member.username}</div>
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
            ))}
          </ul>
          <SubmitButton style="w-[80%]">+ Add</SubmitButton>
      </div>
    </div>
  );
}
