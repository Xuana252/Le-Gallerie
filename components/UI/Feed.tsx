"use client";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PostCard from "./PostCard";
import { type Category, type Post } from "@lib/types";
import Loader from "./Loader";
import CategoryBar from "./CategoriesBar";
import { SearchContext } from "./Nav";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassMinus } from "@fortawesome/free-solid-svg-icons";
import {
  fetchAllPost,
  fetchUserLikedPost,
  fetchUserPost,
} from "@actions/postActions";
import { useSession } from "next-auth/react";
import { set } from "mongoose";
type FeedProps = {
  userIdFilter?: string;
  userIdLikedFilter?: boolean;
  categoryFilter?: Category[];
  setPostCount?: Dispatch<SetStateAction<number>>;
  showCateBar?: boolean;
  showResults?: boolean;
};

export default function Feed({
  userIdFilter,
  userIdLikedFilter,
  categoryFilter = [],
  showCateBar = true,
  setPostCount,
  showResults = false,
}: FeedProps) {
  const { searchText, category } = useContext(SearchContext);
  const [categoriesFilter, setCategoriesFilter] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>();

  const [gridColStyle, setGridColStyle] = useState("grid-colds-1");
  const [colsNum, setColsNum] = useState(1);

  const [searchCount, setSearchCount] = useState(0);

  const [page, setPage] = useState(1); // Track the current page
  const [limit] = useState(10); // Number of posts per page
  const [hasMore, setHasMore] = useState(true); // Whether there are more posts to load
  const observerRef = useRef<IntersectionObserver | null>(null); // Ref to handle scroll observation

  const fetchPosts = async (
    currentPage = 1,
    searchText = "",
    categoriesFilter: Category[]
  ) => {
    setLoading(true);
    try {
      const response = !userIdFilter
        ? await fetchAllPost(currentPage, limit, searchText, categoriesFilter)
        : userIdLikedFilter
        ? await fetchUserLikedPost(userIdFilter, currentPage, limit)
        : await fetchUserPost(userIdFilter, currentPage, limit);

      setPostCount && setPostCount(response.counts);
      if (searchText || categoriesFilter.length > 0) {
        setSearchCount(response.counts);
      }
      if (response.posts.length + posts.length === response.counts) {
        setHasMore(false); // No more posts to load
      }
      if (currentPage === 1) {
        setPosts(response.posts); // Replace posts if it's the first page
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response.posts]); // Append posts for subsequent pages
      }
    } catch (error) {
      setError("Failed to fetch for post: " + error);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    setCategoriesFilter(categoryFilter);
  }, [categoryFilter.toString()]);

  useEffect(() => {
    setPage(1);
    setPosts([]); // Reset posts on search
    setHasMore(true); // Reset hasMore for new search
  }, [searchText, categoriesFilter]);

  useEffect(() => {
    setCategoriesFilter(category);
  }, [category]);

  useEffect(() => {
    fetchPosts(page, searchText, categoriesFilter);
  }, [page, userIdFilter, userIdLikedFilter, searchText, categoriesFilter]);

  const handleCategoriesFilerChange = (categories: Category[]) => {
    setCategoriesFilter(categories);
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Infinite scroll logic
  const lastPostRef = (node: HTMLDivElement) => {
    if (isLoading || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      debounce((entries: any) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        });
      }, 500)
    );

    if (node) observerRef.current.observe(node);
  };

  useEffect(() => {
    // Function to handle resizing
    const handleResize = () => {
      if (window.innerWidth > 1600) {
        setGridColStyle("grid-cols-7");
        setColsNum(7);
      } else if (window.innerWidth > 1280) {
        setGridColStyle("grid-cols-6");
        setColsNum(6);
      } else if (window.innerWidth > 900) {
        setGridColStyle("grid-cols-5");
        setColsNum(5);
      } else if (window.innerWidth > 720) {
        setGridColStyle("grid-cols-4");
        setColsNum(4);
      } else if (window.innerWidth > 600) {
        setGridColStyle("grid-cols-3");
        setColsNum(3);
      } else {
        setGridColStyle("grid-cols-2");
        setColsNum(2);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this effect runs once, on mount

  return (
    <section className="size-full min-h-[400px]">
      {showCateBar && (
        <CategoryBar
          onCategoriesChange={handleCategoriesFilerChange}
          selected={categoriesFilter}
        />
      )}
      {error ? (
        <div>Error:{error}</div>
      ) : searchCount === 0 &&
        (searchText || categoriesFilter.length > 0) &&
        !isLoading ? (
        <div className="text-accent text-center text-xl my-8">
          Sorry, we couldn't find anything:/
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
            className={`grid ${gridColStyle} gap-x-3 h-fit min-w-full p-5 justify-center `}
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
                        ref={index === posts.length - 1 ? lastPostRef : null}
                      >
                        <PostCard post={post} isLoading={false} />
                      </div>
                    );
                  }
                  return null;
                })}
                {
                  isLoading &&
                  Array.from({ length: 10 }).map((_, index) => {
                    if (((posts.length + index) % colsNum) === columnIndex) {
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
