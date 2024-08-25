"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InputBox from "../Input/InputBox";
import {
  type Post,
  type Category,
  SubmitButtonState,
  UploadPost,
} from "@lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import SubmitButton from "@components/Input/SubmitButton";
import { useSession } from "next-auth/react";
import { useTransition, animated } from "@react-spring/web";
import ImageInput from "@components/Input/ImageInput";
import { createPost, updatePost } from "@server/postActions";
import { getCategories } from "@server/categoriesActions";
import { checkPostRateLimit } from "@server/checkRateLimit";
import toastError from "@components/Notification/Toaster";
import {uploadImage,updateImage} from "@lib/upload";
import withAuth from "@middleware";

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
  const [isSelecting, setIsSelecting] = useState<Boolean>(false);
  const categoryItemListTransition = useTransition(selectedCategories, {
    keys: (item) => item._id,
    from: { opacity: 0, transform: "translateY(20px)" }, // Starting state
    enter: { opacity: 1, transform: "translateY(0px)" }, // End state when the item appears
    leave: { opacity: 0, transform: "translateY(20px)" }, // End state when the item disappears
    config: { duration: 300 }, // Transition duration
  });
  const selectBoxTransition = useTransition(isSelecting, {
    from: {
      clipPath: "polygon( 0% 17%,100% 17% , 100% 17% ,0% 17%)",
      transform: "translateY(-20%)",
      opacity: 1,
    },
    enter: [
      {
        opacity: 1,
        transform: "translateY(0px)",
        clipPath: "polygon(0% 0%, 100% 0%,100% 17% ,0% 17%)",
      },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
    ],
    leave: [
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 17%,0% 17%)" },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 17%,0% 17%)" },
      {
        opacity: 1,
        transform: "translateY(-30%)",
        clipPath: "polygon( 0% 17%,100% 17% , 100% 17% ,0% 17%)",
      },
    ],
    config: { duration: 300, easing: (t) => t * (2 - t) },
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    setMouseDownCoordX(e.clientX);
    setMouseDownCoordY(e.clientY);
    setIsDragging(true);
    setStartClientX(e.clientX);
    setStartClientY(e.clientY);
  };
  useEffect(() => {
    if (selectedList.current) {
      selectedList.current.scrollTo({
        left: selectedList.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selectedCategories]);

  const handleMouseMove = (
    ref: React.RefObject<HTMLUListElement>,
    e: React.MouseEvent<HTMLUListElement>
  ) => {
    if (isDragging && ref.current) {
      const scrollLeftAmount = startClientX - e.clientX;
      const scrollTopAmount = startClientY - e.clientY;
      ref.current.scrollLeft += scrollLeftAmount;
      ref.current.scrollTop += scrollTopAmount;
      setStartClientX(e.clientX);
      setStartClientY(e.clientY);
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

  const handleCateSelect = (e: React.MouseEvent, category: Category) => {
    if (mouseDownCoordY === e.clientY) onSelected(category);
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      toastError(error.toString());
      console.log("Error while fetching for categories: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categorySelectBox = (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsSelecting(false);
        }}
        className="bg-accent text-primary w-full h-[28px] text-center font-semibold"
      >
        ▲
      </button>
      <ul
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => handleMouseMove(selectingList, e)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="z-30 pointer-events-auto size-full flex flex-wrap justify-center p-2 gap-2  overflow-y-scroll no-scrollbar bg-secondary-2"
        ref={selectingList}
      >
        {categories.map((category) =>
          !selectedCategories.some((s) => s.name === category.name) ? (
            <li
              className="Cate_tag"
              key={category._id}
              onMouseUp={(e) => handleCateSelect(e, category)}
            >
              {category.name}
            </li>
          ) : null
        )}
      </ul>
    </>
  );

  return (
    <div className="relative">
      <ul
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => handleMouseMove(selectedList, e)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        ref={selectedList}
        className={`Cate_box min-h-14 relative ${
          isSelecting ? "bg-secondary-2" : "bg-primary"
        }`}
      >
        {categoryItemListTransition((style, item) =>
          item ? (
            <animated.div
              style={{ ...style }}
              className="Cate_tag"
              key={item._id}
            >
              <span className="select-none">{item.name}</span>
              <FontAwesomeIcon
                icon={faX}
                size="sm"
                onClick={() => onRemoved(item)}
              />{" "}
            </animated.div>
          ) : null
        )}
        {!(selectedCategories.length > 0) && (
          <div>click here to add categories...</div>
        )}
      </ul>
      {selectBoxTransition((style, item) =>
        item ? (
          <animated.div
            style={{
              ...style,
            }}
            className="origin-top z-10 border-4 border-accent w-full flex flex-col rounded-lg overflow-hidden items-center mt-2 h-[160px] absolute bg-primary"
          >
            {categorySelectBox}
          </animated.div>
        ) : null
      )}
    </div>
  );
}

type BasePostFormProps = {
  type: "Create" | "Edit";
  editPost?: UploadPost;
};

type CreatePostForm = BasePostFormProps & {
  type: "Create";
};
type EditPostForm = BasePostFormProps & {
  type: "Edit";
  editPost: UploadPost;
};

type PostFormProps = CreatePostForm | EditPostForm;

export default function PostForm({ type, editPost }: PostFormProps) {
  const { data: session,update } = useSession();
  const router = useRouter();

  const [submitState, setSubmitState] = useState<SubmitButtonState>("");
  useState<Boolean>(false);
  const [imageToUpdate, setUpdateInfo] = useState(editPost?.image.url || "");

  const [post, setPost] = useState<UploadPost>(
    editPost || {
      creator: { _id: session?.user.id || "" },
      title: "",
      description: "",
      categories: [],
      image: {
        file: null,
        url: "",
      },
    }
  );


  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (post.image.url && session?.user.id) {
      try {
        setSubmitState("Processing");
        const isRateLimited = await checkPostRateLimit();
        if (isRateLimited) {
          throw new Error("one post request per minute. please wait");
        }
        let response;
        let imageUrl = ''
        if(post.image.file) {
          switch(type) {
            case "Create":
               imageUrl = await uploadImage(post.image.file);
               break
            case "Edit":
              imageUrl = await updateImage(post.image.file,imageToUpdate);
              break
          } 
        } else {
          imageUrl=post.image.url
        }
        
        const postToUpload: Post = {
          _id:post._id,
          creator: post.creator,
          title: post.title,
          description: post.description,
          categories: post.categories,
          image: imageUrl,
        };
        switch (type) {
          case "Create":
           
            response = await createPost(postToUpload, session?.user.id);
            break;
          case "Edit":
           
            response = await updatePost(postToUpload);
            break;
        }
        if (response) {
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
          console.log(`Failed to ${type} post`);
        }
      } catch (error: any) {
        setSubmitState("Failed");
        toastError(error.toString());
        console.log(`Something went wrong while trying to ${type} post`, error);
      }
    } else {
      toastError("Make sure you added an Image");
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

  const handleImageChange = (image: { file: File | null; url: string }) => {
    setPost((p) => ({
      ...p,
      image,
    }));
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
      <ImageInput image={post.image.url} setImage={handleImageChange} />
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
