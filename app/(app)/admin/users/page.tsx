"use client";
import InputBox from "@components/Input/InputBox";
import { User } from "@lib/types";
import React, { useEffect, useState } from "react";
import UsersSection from "../dashboardSection/UsersSection";
import { fetchSystemUsers } from "@actions/accountActions";
import UserReportCard from "@components/UI/Profile/UserReportCard";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchCount, setSearchCount] = useState<number | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pendingText, setPendingText] = useState("");
  const [searchText, setSearchText] = useState("");
  const LIMIT = 30;

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchText(pendingText);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    const res = await fetchSystemUsers(LIMIT, page, searchText);

    setUsers(res.users);
    setSearchCount(res.counts)
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    setSearchCount(null)
  }, [searchText, page]);

  return (
    <section className="size-full flex flex-col gap-2">
      <div className="title">System Users</div>

      <div className="panel">
        <InputBox
          type="SearchBox"
          value={pendingText}
          onTextChange={(e) => setPendingText(e.target.value)}
          onKeyDown={handleKeydown}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-[60%_auto]">
   
        <div className="flex flex-col gap-2">
          <div className="panel"></div>
        
          <div className="flex flex-col panel">
            {searchCount && <div>{searchCount} users</div>}
            <div className=" flex flex-wrap gap-2">
              {!isLoading
                ? users.map((user, index) => (
                    <UserReportCard key={index} user={user} />
                  ))
                : Array.from({ length: 10 }).map((_, index) => (
                    <UserReportCard key={index} isLoading={true} />
                  ))}
            </div>
          </div>
        </div>
        <UsersSection />
      </div>
    </section>
  );
}
