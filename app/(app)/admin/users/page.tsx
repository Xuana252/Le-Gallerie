"use client";
import InputBox from "@components/Input/InputBox";
import { User } from "@lib/types";
import React, { useEffect, useState } from "react";
import UsersSection from "../dashboardSection/UsersSection";
import { fetchSystemUsers } from "@actions/accountActions";
import UserReportCard from "@components/UI/Report/UserReportCard";
import MultipleOptionsButton from "@components/Input/MultipleOptionsButton";
import FilterButton from "@components/Input/FilterButton";
import {
  faArrowDownAZ,
  faArrowUpAZ,
  faCalendar,
  faCameraRetro,
  faHammer,
  faIdBadge,
  faImagePortrait,
  faSignature,
  faUser,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import DateTimePicker from "@components/Input/DateTimePicker";
import { UserRole } from "@enum/userRolesEnum";
import { formatDateFromString } from "@lib/dateFormat";
import Pagination from "@components/UI/Layout/Pagination";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchCount, setSearchCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pendingText, setPendingText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [nameSort, setNameSort] = useState<0 | -1 | 1>(0);
  const [joinSort, setJoinSort] = useState<0 | -1 | 1>(0);
  const [roleFilter,setRoleFilter] = useState<UserRole>(UserRole.USER)
  const [start, setStartDate] = useState("");
  const [end, setEndDate] = useState("");
  const LIMIT = 30;

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchText(pendingText);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    const res = await fetchSystemUsers(
      LIMIT,
      page,
      searchText,
      nameSort,
      joinSort,
      roleFilter,
      formatDateFromString(start),
      formatDateFromString(end)
    );

    setUsers(res.users);
    setSearchCount(res.counts);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText, page, nameSort, joinSort, roleFilter,start,end]);

  return (
    <section className="size-full flex flex-col gap-2">
      <div className="title">System Users</div>

      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[60%_auto]">
        <div className="flex flex-col gap-2 order-2 xl:order-1">
          <div className="panel">
            <InputBox
              type="SearchBox"
              value={pendingText}
              onTextChange={(e) => setPendingText(e.target.value)}
              onKeyDown={handleKeydown}
            />
          </div>
          <div className="panel flex flex-wrap items-center gap-x-4 gap-2">
            <FilterButton
              name="username"
              icon={faSignature}
              option={[
                { text: "None", value: 0, icon: faSignature },
                { text: "A to Z", value: 1, icon: faArrowDownAZ },
                { text: "Z to A", value: -1, icon: faArrowUpAZ },
              ]}
              onChange={setNameSort}
            />

            <FilterButton
              name="joined date"
              icon={faCalendar}
              option={[
                { text: "None", value: 0, icon: faCalendar },
                { text: "Oldest", value: 1, icon: faArrowDownAZ },
                { text: "Latest", value: -1, icon: faArrowUpAZ },
              ]}
              onChange={setJoinSort}
            />

            <FilterButton
              name="role"
              icon={faIdBadge}
              option={[
                { text: "Users", value: UserRole.USER, icon: faUser },
                { text: "Creator", value: UserRole.CREATOR, icon: faCameraRetro },
                { text: "Admin", value: UserRole.ADMIN, icon: faHammer },
              ]}
              onChange={setRoleFilter}
            />

            <div className="flex grow flex-wrap p-1 items-center gap-2 justify-around rounded-md border-2 border-secondary-1/50 w-fit">
              <div className="opacity-60 font-bold">Join date:</div>
              <div className=" flex flex-wrap items-center gap-2">
                <span>from:</span>
                <DateTimePicker
                  name={"start"}
                  value={start}
                  showName={false}
                  onChange={(s) => setStartDate(s)}
                />
              </div>
              <div className=" flex flex-wrap items-center gap-2">
                <span>to:</span>
                <DateTimePicker
                  name={"end"}
                  value={end}
                  showName={false}
                  onChange={(s) => setEndDate(s)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col panel ">
            {!isLoading&&<div>{searchCount} users</div>}
            <div className=" flex flex-wrap gap-2">
              {!isLoading
                ? users.map((user, index) => (
                    <UserReportCard key={index} user={user} />
                  ))
                : Array.from({ length: 10 }).map((_, index) => (
                    <UserReportCard key={index} isLoading={true} />
                  ))}
            </div>
            <Pagination limit={LIMIT} count={searchCount} current={page} onPageChange={setPage}/>
          </div>
        </div>

        <div className="order-1 xl:order-2">
          <UsersSection />
        </div>
      </div>
    </section>
  );
}
