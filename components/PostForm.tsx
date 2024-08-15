"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InputBox from "./InputBox";
import { type Post, type Category, SubmitButtonState } from "@lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faImage, faCheck } from "@fortawesome/free-solid-svg-icons";
import SubmitButton from "./SubmitButton";
import { useSession } from "next-auth/react";

type CategoriesSelectorProps = {
  selectedCategories: Category[];
  onSelected: (category: Category) => void;
  onRemoved: (category: Category) => void;
};
export function CategoriesSelector({
  selectedCategories,
  onSelected,
  onRemoved,
}: CategoriesSelectorProps) {
  const selectedList = useRef<HTMLUListElement>(null);
  const selectingList = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startClientX, setStartClientX] = useState(0);
  const [startClientY, setStartClientY] = useState(0);
  const [mouseDownCoordX, setMouseDownCoordX] = useState(0);
  const [mouseDownCoordY, setMouseDownCoordY] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    setMouseDownCoordX(e.clientX);
    setMouseDownCoordY(e.clientY);
    setIsDragging(true);
    setStartClientX(e.clientX);
    setStartClientY(e.clientY);
  };

  const handleMouseMove = (ref:React.RefObject<HTMLUListElement>,e: React.MouseEvent<HTMLUListElement>) => {
    if (isDragging && ref.current) {
      const scrollLeftAmount = startClientX - e.clientX;
      const scrollTopAmount = startClientY - e.clientY;
      ref.current.scrollLeft += scrollLeftAmount;
      ref.current.scrollTop += scrollTopAmount
      setStartClientX(e.clientX);
      setStartClientY(e.clientY)
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLUListElement>) => {
    e.clientX === mouseDownCoordX ? setIsSelecting(true) : null;
    setIsDragging(false);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLUListElement>) => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleCateSelect =(e:React.MouseEvent,category:Category) => {
    if(mouseDownCoordY===e.clientY)
      onSelected(category)
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.log("Error while fetching for categories: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="relative">
      <ul
        onMouseDown={handleMouseDown}
        onMouseMove={e=>handleMouseMove(selectedList,e)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        ref={selectedList}
        className={` Cate_box min-h-14 relative ${
          isSelecting ? "" : "bg-primary"
        }`}
      >
        {selectedCategories.length > 0 ? (
          selectedCategories.map((category) => (
            <li className="Cate_tag" key={category._id}>
              <span className="select-none">{category.name}</span>
              <FontAwesomeIcon
                icon={faX}
                size="sm"
                onClick={() => onRemoved(category)}
              />{" "}
            </li>
          ))
        ) : (
          <div>click here to add categories...</div>
        )}
      </ul>
      {isSelecting && (
        <div className="w-full flex flex-col rounded-lg overflow-hidden items-center mt-2 h-[160px] absolute bg-primary">
          <div
            onClick={() => setIsSelecting(false)}
            className="bg-accent text-primary w-full text-center font-semibold"
          >
            ▲
          </div>
            <ul
              onMouseDown={handleMouseDown}
              onMouseMove={e=>handleMouseMove(selectingList,e)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className="pointer-events-auto size-full flex flex-wrap justify-center p-2 gap-2  overflow-y-scroll no-scrollbar bg-secondary-2"
              ref={selectingList}
            >
              {categories.map((category) =>
                !selectedCategories.some((s) => s.name === category.name) ? (
                  <li
                    className="Cate_tag"
                    key={category._id}
                    onMouseUp={(e)=>handleCateSelect(e,category)}
                  >
                    {category.name}
                  </li>
                ) : null
              )}
            </ul>
          </div>
      )}
    </div>
  );
}

type BasePostFormProps = {
  type: "Create" | "Edit";
  editPost?: Post;
};

type CreatePostForm = BasePostFormProps & {
  type: "Create";
};
type EditPostForm = BasePostFormProps & {
  type: "Edit";
  editPost: Post;
};

type PostFormProps = CreatePostForm | EditPostForm;

export default function PostForm({ type, editPost }: PostFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const imageInput = useRef<HTMLInputElement>(null);
  const [submitState, setSubmitState] = useState<SubmitButtonState>("");
  const [imageInputVisibility, setImageInputVisibility] =
    useState<Boolean>(false);
  const [post, setPost] = useState<Post>(
    editPost || {
      creator: { _id: session?.user.id || "" },
      title: "",
      description: "",
      categories: [],
      image: "",
    }
  );

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (post?.image) {
      try {
        setSubmitState("Processing");
        let response;
        switch (type) {
          case "Create":
            response = await fetch("/api/posts/new", {
              method: "POST",
              body: JSON.stringify({ ...post, creator: session?.user.id }),
            });
            break;
          case "Edit":
            response = await fetch(`/api/posts/${post._id}`, {
              method: "PATCH",
              body: JSON.stringify(post),
            });
            break;
        }
        if (response.ok) {
          setTimeout(() => {
            setSubmitState("Succeeded");
            console.log(`Attempted to ${type} successfully`);

            type === "Edit"
              ? localStorage.setItem("post", JSON.stringify(post))
              : null;

            setTimeout(() => router.back(), 1000);
          }, 500);
        } else {
          setSubmitState("Failed");
          console.log(response);
        }
      } catch (error) {
        setSubmitState("Failed");
        console.log(`Something went wrong while trying to ${type} post`, error);
      }
    } else {
      alert("Make sure you added an Image URL");
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  const handleCategoryAdd = (category: Category) => {
    if (!post.categories.includes(category)) {
      setPost((p) => ({
        ...p,
        categories: [...p.categories, category],
      }));
    }
  };

  const handleCategoryRemove = (category: Category) => {
    setPost((p) => ({
      ...p,
      categories: p.categories.filter((c) => c !== category),
    }));
  };

  const handleImageChange = () => {
    setPost((p) => ({
      ...p,
      image: imageInput.current ? imageInput.current.value : "",
    }));
    setImageInputVisibility(false);
  };

  const handleImageError = () => {
    setPost((p) => ({ ...p, image: "" }));
  };

  const handleTextChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((p) => ({ ...p, [name]: value }));
  };

  return (
    <form onSubmit={handleFormSubmit} className="Form">
      <div className="size-full flex items-center justify-center sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden relative">
        <div
          className="size-full bg-secondary-2 flex items-center justify-center"
          onClick={() => setImageInputVisibility(true)}
        >
          {post.image ? (
            <img
              src={post.image}
              alt="Post Image"
              className="w-full"
              onError={handleImageError}
            />
          ) : (
            <FontAwesomeIcon icon={faImage} className="text-7xl" />
          )}
        </div>
        {imageInputVisibility && (
          <div className="Input_box_variant_1 absolute bottom-2 m-auto">
            <input
              ref={imageInput}
              name="image"
              placeholder="Image URL..."
              className="pl-2 outline-none bg-transparent placeholder:text-inherit"
            />{" "}
            <div className="p-1" onClick={handleImageChange}>
              <FontAwesomeIcon icon={faCheck} />
            </div>
          </div>
        )}
      </div>
      <div className="size-full p-4 flex flex-col gap-2">
        <div>
          <h3>Title</h3>
          <InputBox
            onTextChange={handleTextChange}
            name="title"
            type="Input"
            value={post.title}
          >
            add some cool title...
          </InputBox>
        </div>
        <div>
          <h3>Categories</h3>
          <CategoriesSelector
            selectedCategories={post.categories}
            onSelected={handleCategoryAdd}
            onRemoved={handleCategoryRemove}
          />
        </div>
        <div className="h-full">
          <h3>Description</h3>
          <textarea
            name="description"
            value={post.description}
            placeholder="tell us something about your post..."
            className="Input_box_variant_1 p-2 w-full h-[80%]"
            onChange={handleTextChange}
            spellCheck={false}
          />
        </div>
        <div className="flex justify-end gap-3 mt-auto">
          <button onClick={handleCancel} className="Button_variant_2">
            Cancel
          </button>
          <SubmitButton state={submitState} changeState={setSubmitState}>
            {type} Post
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
