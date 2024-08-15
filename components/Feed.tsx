"use client";
import React, { useActionState, useContext, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import PostCard from "./PostCard";
import { type Category, type Post } from "@lib/types";
import Loader from "./Loader";
import CategoryBar from "./CategoriesBar";
import { SearchContext } from "./Nav";
import { usePathname} from "next/navigation";
import { AppLogoLoader } from "./Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassMinus } from "@fortawesome/free-solid-svg-icons";
type FeedProps = {
  userIdFilter?: string;
  categoryFilter?: Category[];
};

export default function Feed({ userIdFilter, categoryFilter=[]}: FeedProps) {
  const pathName = usePathname();
  const [categoriesFilter, setCategoriesFilter] =
    useState<Category[]>(categoryFilter);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>();
  const [filterText , setFilterText]  = useState<string>('')
  const searchText = useContext(SearchContext);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        userIdFilter ? `/api/users/${userIdFilter}/posts` : "/api/posts"
      );
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } else {
        console.log("Some thing went wrong while fetching for posts");
      }
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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 700);
    setCategoriesFilter(categories);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFilterText(searchText)
      setLoading(false);
    }, 500);
  }, [searchText]);

  const filteredPosts = posts.filter((post) => {
    

    // Skip filtering if search text is empty or is not on the home page
    if (filterText.trim() === "" || pathName !== "/") {
      return categoriesFilter.every((category) =>
        post.categories.map((cat) => cat._id).includes(category._id)
      );
    }

    const searchPattern = new RegExp(
      filterText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // Escape special characters
      "i" // Case-insensitive search
    );

    const postCategoryIds = new Set(post.categories.map((cat) => cat._id));

    return (
      categoriesFilter.every((category) => postCategoryIds.has(category._id)) &&
      (searchPattern.test(post.title) ||
        searchPattern.test(post.creator.username || "") ||
        post.categories.some((c) => searchPattern.test(c.name)))
    );
  });

  return (
    <section className="size-full min-h-[400px]">
      <CategoryBar
        onCategoriesChange={handleCategoriesFilerChange}
        selected={categoriesFilter}
      />
      {isLoading ? (
        <Loader></Loader>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid w-full p-4"
          columnClassName="my-masonry-grid_column"
        >
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Masonry> )
      // ) : (
      //   <div className="size-full flex justify-center text-7xl pt-3 text-accent items-center">
      //     <FontAwesomeIcon icon={faMagnifyingGlassMinus}  />
      //   </div>
      // )
        }
    </section>
  );
}
