"use client";
import { User } from "@lib/types";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { useSession } from "next-auth/react";
import { SearchContext } from "./Nav";
import { fetchUsers } from "@actions/accountActions";
import UserCard from "../Profile/UserCard";
import { faArchive } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

type UserTabProps = {
  state?: any;
  updatestate?: (newState: any) => void;
};

export default function UsersTab({ state, updatestate }: UserTabProps) {
  const { searchText } = useContext(SearchContext);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const [searchCount, setSearchCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(30);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchUser = async (currentPage = 1, searchText = "") => {
    setIsLoading(true);
    try {
      const response = await fetchUsers(limit, currentPage, searchText);
      setHasMore(response.users.length === limit);
      setUsersList((prevUsers) => [...prevUsers, ...response.users]);

      setSearchCount(response.counts);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    if (!isMount && Object.keys(state || {}).length !== 0) return;
    fetchUser(1, searchText);
  }, [searchText]);

  useEffect(() => {
    return () => {
      updatestate &&
        !isLoading &&
        updatestate({
          usersList,
          count: searchCount,
          hasMore,
          page,
        });
    };
  }, [usersList, searchCount, hasMore, page]);

  useEffect(() => {
    setIsLoading(Object.keys(state || {}).length === 0);
    setIsMount(true);

    if (!isMount && Object.keys(state || {}).length !== 0) {
      setUsersList(state.usersList || []);
      setSearchCount(state.count || 0);
      setPage(state.page || 1);
      setHasMore(state.hasMore || false);
    }
  }, []);

  useEffect(() => {
    if (!isMount && Object.keys(state || {}).length !== 0) return;

    setPage(1);
    setSearchCount(0);
    setUsersList([]);
    setHasMore(true);
  }, [searchText]);

  const lastUserRef = (node: HTMLDivElement) => {
    if (isLoading || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting && hasMore) {
          fetchUser(page + 1, searchText);
          setPage((prevPage) => prevPage + 1);
        }
      });
    });

    if (node) observerRef.current.observe(node);
  };

  return (
    <>
      {!isLoading && searchCount < 1 ? (
        <div className="text-accent text-center text-xl size-fit p-4 h-screen w-full bg-accent/20 justify-center flex flex-col gap-2 ">
          <FontAwesomeIcon icon={faArchive} size="2xl" />
          No user found :/
        </div>
      ) : (
        <>
          {searchCount > 0 && (
            <div className="text-left text-2xl p-2 font-bold text-accent">
              Found {searchCount} users
            </div>
          )}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4 w-full overflow-x-scroll no-scrollbar p-1 sm:p-4">
            {usersList.map((user, index) => (
              <div
                key={index}
                ref={
                  index === usersList.length - 1 && hasMore ? lastUserRef : null
                }
              >
                <UserCard user={user} isLoading={false} />
              </div>
            ))}
            {isLoading &&
              Array.from({ length: 9 }).map((_, index) => (
                <UserCard key={index} isLoading={true} />
              ))}
          </ul>
        </>
      )}
    </>
  );
}
