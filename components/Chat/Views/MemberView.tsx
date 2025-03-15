import { ChatBoxView } from "@app/enum/chatBoxView";
import SubmitButton from "@components/Input/SubmitButton";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import {
  faAngleLeft,
  faUsers,
  faMinus,
  faUserPlus,
  faUserTie,
  faRightFromBracket,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FriendSearchSection from "../ChatTabComponent/FriendSearchSection";
import { User } from "@lib/types";
import { useSession } from "@node_modules/next-auth/react";
import { confirm } from "@components/Notification/Toaster";
import { kickFromChat, updateAdmin } from "@lib/Chat/chat";

export default function MemberView({
  chat,
  chatInfo,
  setChatBoxView,
}: {
  chat: any;
  chatInfo: any;
  setChatBoxView: Dispatch<SetStateAction<ChatBoxView>>;
}) {
  const { data: session } = useSession();
  const [members, setMembers] = useState<User[]>([]);
  const [admin, setAdmin] = useState<User>();

  useEffect(() => {
    const groupMembers = [
      ...chat.memberIds.map((id: string) =>
        chatInfo.users.find((user: User) => user._id === id)
      ),
    ];
    setMembers(groupMembers);

    setAdmin(groupMembers.find((user: User) => user._id === chat.admin));
  }, [chat]);

  const handleAssignAdmin = async (user: User) => {
    const confirmation = await confirm(
      `Do you want to make ${user.username} the new admin?`
    );
    if (!confirmation) return;

    await updateAdmin(chatInfo.chatId, user._id);
  };

  const handleRemoveMember = async (user: User) => {
    const confirmation = await confirm(
      `Do you want to remove ${user.username} from the chat?`
    );
    if (!confirmation) return;

    await kickFromChat(chatInfo.chatId, user._id);
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
          Member
        </span>
      </div>
      <div className="flex flex-col w-full h-full p-2 items-center gap-1">
        <ul className="flex flex-col grow overflow-scroll no-scrollbar w-full bg-primary/80 rounded-lg p-1 gap-2">
          <li className="flex flex-col gap-2 mb-8 ">
            <div className="font-bold sticky top-0 bg-secondary-1 rounded-md p-1 shadow-md z-20">
              Admin
            </div>
            <div className="flex flex-row justify-between items-center gap-2">
              {admin && (
                <UserProfileIcon
                  currentUser={false}
                  user={admin}
                  size="Icon_small"
                />
              )}
              <div className="grow font-bold text-accent">
                {admin?.username}
              </div>
            </div>
          </li>
          <div className="sticky top-0 bg-secondary-1 rounded-md p-1 shadow-md z-20">
            Members
          </div>
          {members
            .filter((member: User) => member._id !== chat.admin)

            .map((member, index) => (
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

                {chat.admin === session?.user.id && (
                  <div className="flex flex-row gap-2">
                    <button
                      className="Icon_smaller"
                      title="Assign admin"
                      onClick={() => handleAssignAdmin(member)}
                    >
                      <FontAwesomeIcon icon={faUserTie} />
                    </button>
                    <button
                      className="Icon_smaller"
                      title="Remove member"
                      onClick={() => handleRemoveMember(member)}
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
