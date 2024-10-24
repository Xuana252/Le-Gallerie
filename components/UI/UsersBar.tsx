"use client";
import { User } from "@lib/types";
import React, { useContext, useEffect, useState } from "react";
import UserProfileIcon from "./UserProfileIcon";
import { useSession } from "next-auth/react";
import { SearchContext } from "./Nav";
import { fetchUsers } from "@actions/accountActions";

export default function UsersBar() {
  const { searchText } = useContext(SearchContext);
  const { data: session } = useSession();
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
        <div className="text-accent text-center text-xl my-8">
          no user found:/
        </div>
      ) : (
        usersList.length > 0 && (
          <>
            <div className="text-left text-2xl p-2 font-bold text-accent">
              Found {usersList.length} users
            </div>
            <ul className="flex flex-row gap-4 w-full overflow-x-scroll no-scrollbar p-4">
              {usersList.map((user) => (
                <li
                  key={user._id}
                  className="hover:shadow-md rounded-md bg-secondary-1 p-2 min-w-[150px] max-w-[150px]"
                >
                  <label
                    htmlFor="profile"
                    className="flex flex-col gap-2 items-center overflow-hidden"
                  >
                    {user._id === session?.user.id ? (
                      <UserProfileIcon currentUser={true} />
                    ) : (
                      <UserProfileIcon currentUser={false} user={user} />
                    )}
                    <h2 className="text-center font-bold overflow-x-scroll no-scrollbar whitespace-nowrap w-full text-accent underline underline-offset-2">
                      {user.username}
                    </h2>
                    <h2 className="text-center/50 overflow-x-scroll no-scrollbar whitespace-nowrap w-full text-accent ">
                      {user.fullname}
                    </h2>
                  </label>
                </li>
              ))}
            </ul>
          </>
        )
      )}
    </>
  );
}
