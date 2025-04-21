"use client";
import InputBox from "@components/Input/InputBox";
import toastError from "@components/Notification/Toaster";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import { User } from "@lib/types";
import { blockUser, fetchUserBlockedList } from "@actions/accountActions";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useId, useState } from "react";
import { text } from "stream/consumers";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faBox,
  faBoxArchive,
} from "@node_modules/@fortawesome/free-solid-svg-icons";

export default function BlockList() {
  const [pendingText, setPendingText] = useState("");
  const [filterText, setFilterText] = useState("");
  const { data: session, status, update } = useSession();
  const [blockedList, setBlockedList] = useState<User[]>([]);
  const [filteredList, setFilteredList] = useState<User[]>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingText(e.target.value);
  };

  const handleTextClear = () => {
    setFilterText("");
  };

  const handleSearch = () => {
    setFilterText(pendingText);
  };
  const handleUnblock = async (userId: string) => {
    if (!session?.user.id) return;
    setBlockedList((list) => list.filter((user) => user._id !== userId));
    try {
      await blockUser(session.user.id, userId);
      const newSession = await getSession();
      await update(newSession);
    } catch (error) {
      toastError("Error while unblocking user");
    }
  };

  const fetchBlockList = async () => {
    if (!session?.user.id) return;
    try {
      const response = await fetchUserBlockedList(session?.user.id);
      setBlockedList(response);
    } catch (error) {
      console.log("failed to fetch block list");
    }
  };
  useEffect(() => {
    if (status !== "authenticated") return;
    fetchBlockList();
  }, [session]);

  useEffect(() => {
    const finalList = blockedList.filter((user) => {
      if (filterText.trim() === "") return true;

      const searchPattern = new RegExp(
        filterText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // Escape special characters
        "i" // Case-insensitive search
      );
      return (
        searchPattern.test(user.fullname || "") ||
        searchPattern.test(user.username || "")
      );
    });
    setFilteredList(finalList);
  }, [blockedList, filterText]);
  return (
    <section className="flex flex-col gap-4">
      <div className=" bg-secondary-1/70 rounded-lg p-4 flex flex-row gap-4">
        <InputBox
          type="SearchBox"
          value={pendingText}
          onTextChange={handleTextChange}
          onClear={handleTextClear}
        />
        <button className="Button_variant_1" onClick={() => handleSearch()}>
          Search
        </button>
      </div>
      <div className=" bg-secondary-1/70 rounded-lg p-4 flex flex-col gap-4">
        <h1 className="text-primary font-bold text-2xl bg-accent/30 rounded-md px-2 py-1">
          Blocked users
        </h1>
        <ul className="flex flex-col gap-4 min-h-[300px]">
          {filteredList.length === 0 && (
            <div className="grow rounded-xl bg-secondary-2/30 flex flex-col justify-center items-center text-xl opacity-70">
              <FontAwesomeIcon icon={faBoxArchive} size="2xl" />
              <p>Nothing's here yet:/</p>
            </div>
          )}
          {filteredList.map((user: User, index) => (
            <li
              key={index}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-2 h-fit w-full bg-secondary-2/30 p-2 rounded-lg"
            >
              <div className="">
                <UserProfileIcon user={user} />
              </div>
              <h1 className="break-all whitespace-normal font-bold">
                {user.username}
              </h1>
              <button
                className="Button_variant_2"
                onClick={() => handleUnblock(user._id)}
              >
                Unblock
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
