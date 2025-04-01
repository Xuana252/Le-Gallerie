"use client";
import { User } from "@lib/types";
import React, { useContext, useEffect, useState } from "react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { useSession } from "next-auth/react";
import { SearchContext } from "./Nav";
import { fetchUsers } from "@actions/accountActions";
import UserCard from "../Profile/UserCard";
import { faArchive } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

export default function UsersBar() {
  const { searchText } = useContext(SearchContext);
  const [usersList, setUsersList] = useState<User[]>([]);

  const fetchUser = async (searchText = "") => {
    try {
      const response = await fetchUsers(searchText);
      setUsersList(response.users);
    } catch (error) {}
  };

  useEffect(() => {
    fetchUser(searchText);
  }, [searchText]);

  return (
    <>
      {searchText && usersList.length === 0 ? (
       <div className="text-accent text-center text-xl size-fit p-4 h-screen w-full bg-accent/20 justify-center flex flex-col gap-2 ">
                 <FontAwesomeIcon icon={faArchive} size="2xl" />
                 No user found :/
               </div>
      ) : (
        usersList.length > 0 && (
          <>
            <div className="text-left text-2xl p-2 font-bold text-accent">
              Found {usersList.length} users
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4 w-full overflow-x-scroll no-scrollbar p-1 sm:p-4">
              {[...usersList,...usersList,...usersList,].map((user,index) => (
                <UserCard key={index} user={user}/>
              ))}
            </ul>
          </>
        )
      )}
    </>
  );
}
