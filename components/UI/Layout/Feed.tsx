"use client";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PostCard from "../Post/PostCard";
import { type Category, type Post } from "@lib/types";
import Loader from "../Loader";
import CategoryBar from "./CategoriesBar";
import { SearchContext } from "./Nav";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive,
  faMagnifyingGlassMinus,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchAllPost,
  fetchUserDeletedPost,
  fetchUserFollowPost,
  fetchUserFriendPost,
  fetchUserLikedPost,
  fetchUserPost,
} from "@actions/postActions";
import { useSession } from "next-auth/react";
import { set } from "mongoose";
import toastError from "@components/Notification/Toaster";
type FeedProps = {
  userIdFilter?: string;
  userIdLikedFilter?: boolean;
  userIdFollowFilter?: boolean;
  userIdFriendFilter?: boolean;
  userIdDeletedFilter?: boolean;
  relatePostFilter?: string;
  setPostCount?: Dispatch<SetStateAction<number | null>>;
  showCateBar?: boolean;
  showResults?: boolean;
  searchFeed?: boolean;
  state?: any;
  updatestate?: (newState: any) => void;
  adminPage?:boolean
};

export default function Feed({
  userIdFilter,
  userIdFollowFilter,
  userIdFriendFilter,
  userIdLikedFilter,
  userIdDeletedFilter,
  showCateBar = false,
  relatePostFilter,
  setPostCount,
  showResults = false,
  searchFeed = false,
  state,
  updatestate,
  adminPage = false
}: FeedProps) {
  const { searchText, category } = useContext(SearchContext);
  const [categoriesFilter, setCategoriesFilter] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const [isMount, setIsMount] = useState(false);
  const [gridColStyle, setGridColStyle] = useState("grid-colds-2");
  const [colsNum, setColsNum] = useState(2);

  const [searchCount, setSearchCount] = useState(0);

  const [page, setPage] = useState<number>(1); // Track the current page
  const [limit] = useState(30); // Number of posts per page
  const [hasMore, setHasMore] = useState(true); // Whether there are more posts to load
  const observerRef = useRef<IntersectionObserver | null>(null); // Ref to handle scroll observation
  const feedRef = useRef<HTMLUListElement>(null); // Ref to the feed container

  const handleResize = useCallback(() => {
    const width = feedRef.current?.offsetWidth || window.innerWidth;

    if (width > 1600) {
      setGridColStyle("grid-cols-7");
      setColsNum(7);
    } else if (width > 1280) {
      setGridColStyle("grid-cols-6");
      setColsNum(6);
    } else if (width > 900) {
      setGridColStyle("grid-cols-5");
      setColsNum(5);
    } else if (width > 720) {
      setGridColStyle("grid-cols-4");
      setColsNum(4);
    } else if (width > 600) {
      setGridColStyle("grid-cols-3");
      setColsNum(3);
    } else {
      setGridColStyle("grid-cols-2");
      setColsNum(2);
    }
  }, []);

  useEffect(() => {
    if (feedRef.current) handleResize();
  }, [feedRef.current]);

  useEffect(() => {
    setLoading(Object.keys(state || {}).length === 0);
    setIsMount(true);

    // Initial check
    handleResize();

    // Listen to window resize
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPosts = async (
    currentPage = 1,
    searchText = "",
    categoriesFilter: Category[],
    relatePostFilter = ""
  ) => {
    setLoading(true);
    try {
      const response = !userIdFilter
        ? await fetchAllPost(
            currentPage,
            limit,
            searchText,
            categoriesFilter,
            relatePostFilter
          )
        : userIdLikedFilter
        ? await fetchUserLikedPost(userIdFilter, currentPage, limit)
        : userIdFollowFilter
        ? await fetchUserFollowPost(userIdFilter, currentPage, limit)
        : userIdFriendFilter
        ? await fetchUserFriendPost(userIdFilter, currentPage, limit)
        : userIdDeletedFilter
        ? await fetchUserDeletedPost(userIdFilter, currentPage, limit)
        : await fetchUserPost(userIdFilter, currentPage, limit);

      setPostCount && setPostCount(response.counts);

      setSearchCount(response.counts);

      const hasmore = response.posts.length + posts.length < response.counts;

      setHasMore(hasmore);

      if (currentPage === 1) {
        setPosts(response.posts); // Replace posts if it's the first page
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response.posts]); // Append posts for subsequent pages
      }
    } catch (error) {
      toastError("Failed to fetch for posts");
    }
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      updatestate &&
        !isLoading &&
        updatestate({
          posts,
          count: searchCount,
          hasMore,
          page,
        });
    };
  }, [posts, searchCount, hasMore, page]);

  useEffect(() => {
    if (Object.keys(state || {}).length !== 0) {
      setPosts(state.posts || []);
      setSearchCount(state.count || 0);
      setPage(state.page || 1);
      setHasMore(state.hasMore || false);
    }
  }, []);

  useEffect(() => {
    if (!isMount && Object.keys(state || {}).length !== 0) return;

    setPage(1);
    setSearchCount(0);
    setPosts([]);
    setHasMore(true);
  }, [searchText, categoriesFilter]);

  useEffect(() => {
    if (!isMount && Object.keys(state || {}).length !== 0) return;
    setCategoriesFilter(category);
  }, [category]);

  useEffect(() => {
    if (!isMount && Object.keys(state || {}).length !== 0) return;

    if (relatePostFilter) {
      fetchPosts(page, "", [], relatePostFilter);
    } else if (searchFeed) {
      fetchPosts(page, searchText, categoriesFilter, "");
    } else {
      fetchPosts(page, "", [], "");
    }
  }, [searchText, categoriesFilter, relatePostFilter]);

  const handleCategoriesFilerChange = (categories: Category[]) => {
    setCategoriesFilter(categories);
  };

  // Infinite scroll logic
  const lastPostRef = (node: HTMLDivElement) => {
    if (isLoading || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore) {
          if (searchFeed) {
            fetchPosts(
              page + 1,
              searchText,
              categoriesFilter,
              relatePostFilter
            );
          } else {
            fetchPosts(page + 1, "", [], "");
          }
          observerRef.current?.disconnect();
          setPage((prevPage) => prevPage + 1);
        }
      });
    });

    if (node) observerRef.current.observe(node);
  };

  return (
    <section className="w-full  min-h-fit h-auto">
      {showCateBar && (
        <CategoryBar
          onCategoriesChange={handleCategoriesFilerChange}
          selected={categoriesFilter}
        />
      )}
      {posts.length === 0 && !isLoading ? (
        <div className="text-accent text-center text-xl size-fit p-4 h-screen w-full bg-accent/20 justify-center flex flex-col gap-2 ">
          <FontAwesomeIcon icon={faArchive} size="2xl" />
          No post found :/
        </div>
      ) : (
        <>
          {showResults &&
            searchCount > 0 &&
            (searchText || categoriesFilter.length > 0) && (
              <div className="text-left text-2xl p-2 text-accent font-bold">
                Found {searchCount} posts
              </div>
            )}
          <ul
            ref={feedRef}
            className={`grid ${gridColStyle} gap-x-3 min-w-full h-auto p-5 justify-center `}
          >
            {Array.from(Array(colsNum).keys()).map((columnIndex) => (
              <ul
                key={columnIndex}
                className="flex flex-col w-full h-fit gap-3 "
              >
                {posts.map((post, index) => {
                  if (index % colsNum === columnIndex) {
                    return (
                      <div
                        key={post._id}
                        ref={
                          index === posts.length - 1 && hasMore
                            ? lastPostRef
                            : null
                        }
                        className={`hover:scale-105 transition-all duration-300 ease-out ${
                          state?.posts?.some((p: Post) => p._id === post._id)
                            ? ""
                            : "animate-slideUp"
                        } `}
                      >
                        <PostCard post={post} isLoading={false}  adminPage={adminPage}/>
                      </div>
                    );
                  }
                  return null;
                })}
                {isLoading &&
                  Array.from({ length: 10 }).map((_, index) => {
                    if ((posts.length + index) % colsNum === columnIndex) {
                      return (
                        <div key={index}>
                          <PostCard isLoading={true} />
                        </div>
                      );
                    }
                    return null;
                  })}
              </ul>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
