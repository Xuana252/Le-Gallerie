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
  fetchPostLikedUser,
  fetchUserLikedPost,
  fetchUserPost,
} from "@server/postActions";
type FeedProps = {
  userIdFilter?: string;
  userIdLikedFilter?: boolean;
  categoryFilter?: Category[];
  setPostCount?: Dispatch<SetStateAction<number>>;
  showCateBar?: boolean;
};

export default function Feed({
  userIdFilter,
  userIdLikedFilter,
  categoryFilter = [],
  showCateBar = true,
  setPostCount,
}: FeedProps) {
  const pathName = usePathname();
  const { searchText } = useContext(SearchContext);
  const [categoriesFilter, setCategoriesFilter] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>();
  const [filteredPost, setFilteredPosts] = useState<Post[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const [gridColStyle, setGridColStyle] = useState("grid-colds-1");
  const [colsNum, setColsNum] = useState(1);

  const [page, setPage] = useState(1); // Track the current page
  const [limit] = useState(3); // Number of posts per page
  const [hasMore, setHasMore] = useState(true); // Whether there are more posts to load
  const observerRef = useRef<IntersectionObserver | null>(null); // Ref to handle scroll observation

  const fetchPosts = async (currentPage = 1) => {
    try {
      const response = !userIdFilter
        ? await fetchAllPost(currentPage, limit)
        : userIdLikedFilter
        ? await fetchUserLikedPost(userIdFilter, currentPage, limit)
        : await fetchUserPost(userIdFilter, currentPage, limit);
      if (response.length < limit) {
        setHasMore(false); // No more posts to load
      }
      if (currentPage === 1) {
        setPosts(response); // Replace posts if it's the first page
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response]); // Append posts for subsequent pages
      }
    } catch (error) {
      setError("Failed to fetch for post");
    }
  };

  useEffect(() => {
    setCategoriesFilter(categoryFilter);
  }, [categoryFilter.toString()]);

  useEffect(() => {
    fetchPosts(page);
  }, [page, userIdFilter, userIdLikedFilter]);

  // const breakpointColumnsObj = {
  //   default: 5,
  //   1100: 3,
  //   700: 2,
  //   500: 1,
  // };

  const handleCategoriesFilerChange = (categories: Category[]) => {
    setCategoriesFilter(categories);
  };

  useEffect(() => {
    setLoading(true);
    const finalPosts = posts.filter((post) => {
      if (searchText.trim() === "" || pathName !== "/") {
        return categoriesFilter.every((category) =>
          post.categories.map((cat) => cat._id).includes(category._id)
        );
      }

      const searchPattern = new RegExp(
        searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // Escape special characters
        "i" // Case-insensitive search
      );

      const postCategoryIds = new Set(post.categories.map((cat) => cat._id));

      return (
        categoriesFilter.every((category) =>
          postCategoryIds.has(category._id)
        ) &&
        (searchPattern.test(post.title) ||
          searchPattern.test(post.creator.username || "") ||
          post.categories.some((c) => searchPattern.test(c.name)))
      );
    });
    if (finalPosts.length > 0) setIsEmpty(false);
    else setIsEmpty(true);
    setFilteredPosts(finalPosts);
    setPostCount && setPostCount(finalPosts.length);
    setTimeout(() => setLoading(false), 1000);
  }, [posts, searchText, JSON.stringify(categoriesFilter)]);


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

    observerRef.current = new IntersectionObserver(debounce((entries:any) => {
      entries.forEach((entry:any) => {
        if (entry.isIntersecting && hasMore) {
          console.log("Loading more posts...");
          setPage((prevPage) => prevPage + 1);
        }
      });
    }, 500)); 

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
        <div>{error}</div>
      ) : isEmpty ? (
        <div className="size-full flex flex-col gap-3 justify-center   pt-3 text-accent items-center">
          {/* <FontAwesomeIcon icon={faMagnifyingGlassMinus} className="text-7xl" />
          <h1 className="text-xl">No related posts found:/</h1> */}
        </div>
      ) : (
        <ul
          className={`grid ${gridColStyle} gap-x-3 min-h-screen min-w-full p-5 justify-center `}
        >
          {Array.from(Array(colsNum).keys()).map((columnIndex) => (
            <div
              key={columnIndex}
              className="flex flex-col w-full h-fit gap-3 "
            >
              {filteredPost.map((post, index) => {
                if (index % colsNum === columnIndex) {
                  return (
                    <div
                      key={post._id}
                      ref={
                        index === filteredPost.length - 1 ? lastPostRef : null
                      }
                    >
                      <PostCard post={post} />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </ul>
      )}
      {isLoading && <Loader></Loader>}
    </section>
  );
}
