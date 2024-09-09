"use client";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import PostCard from "./PostCard";
import { type Category, type Post } from "@lib/types";
import Loader from "./Loader";
import CategoryBar from "./CategoriesBar";
import { SearchContext } from "./Nav";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassMinus } from "@fortawesome/free-solid-svg-icons";
import { fetchAllPost, fetchUserPost } from "@server/postActions";
type FeedProps = {
  userIdFilter?: string;
  categoryFilter?: Category[];
  setPostCount?:Dispatch<SetStateAction<number>>
  showCateBar?:boolean;
};

export default function Feed({ userIdFilter, categoryFilter = [],showCateBar=true,setPostCount }: FeedProps) {
  const pathName = usePathname();
  const {searchText} = useContext(SearchContext);
  const [categoriesFilter, setCategoriesFilter] =
    useState<Category[]>(categoryFilter);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>();
  const [filteredPost, setFilteredPosts] = useState<Post[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = userIdFilter
        ? await fetchUserPost(userIdFilter)
        : await fetchAllPost();
      setPosts(response);
    } catch (error) {
      setError("Failed to fetch for post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userIdFilter]);

  const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1,
  };

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
    setPostCount&&setPostCount(finalPosts.length)
    setTimeout(() => setLoading(false), 2000);
  }, [posts, searchText, categoriesFilter]);

  const [gridColStyle, setGridColStyle] = useState("grid-colds-1");
  const [colsNum, setColsNum] = useState(1);
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
      {showCateBar&&<CategoryBar
        onCategoriesChange={handleCategoriesFilerChange}
        selected={categoriesFilter}
      />}
      {isLoading ? (
        <Loader></Loader>
      ) : error ? (
        <div>{error}</div>
      ) : isEmpty ? (
        <div className="size-full flex flex-col gap-3 justify-center   pt-3 text-accent items-center">
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} className="text-7xl" />
          <h1 className="text-xl">No related posts found:/</h1>
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
                  return <PostCard key={post._id} post={post} />;
                }
                return null;
              })}
            </div>
          ))}
        </ul>
      )}
    </section>
  );
}
