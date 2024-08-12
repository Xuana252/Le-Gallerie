"use client";
import React, { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InputBox from "./InputBox";
import { type Post, type Category } from "@lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faImage, faCheck } from "@fortawesome/free-solid-svg-icons";

type CategoriesSelectorProps = {
  selectedCategories: Category[];
  categories: Category[];
  onSelected: (category: Category) => void;
  onRemoved: (category: Category) => void;
};
export function CategoriesSelector({
  selectedCategories,
  categories,
  onSelected,
  onRemoved,
}: CategoriesSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  return (
    <div>
      <ul className={` Cate_box min-h-14 relative ${isSelecting?'bg-slate-100':''}`} onClick={()=>setIsSelecting(true)}>
        {selectedCategories.map((category) => (
          <li className="Cate_tag" key={category._id}>
            {category.name}
            <FontAwesomeIcon
              icon={faX}
              size="sm"
              onClick={() => onRemoved(category)}
            />{" "}
          </li>
        ))}
      </ul>
      {isSelecting && (
        <div>
          <div onClick={()=>setIsSelecting(false)}>close</div>
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li
                className="Cate_tag"
                key={category._id}
                onClick={() => onSelected(category)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

type FormProps = {
  type: "Create" | "Edit";
  post: Post;
  categories: Category[];
  setPost: React.Dispatch<React.SetStateAction<Post>>;
  handleSubmit: (e: FormEvent) => void;
};
export default function Form({
  type,
  post,
  categories,
  setPost,
  handleSubmit,
}: FormProps) {
  const router = useRouter();
  const imageInput = useRef<HTMLInputElement>(null);
  const [imageInputVisibility, setImageInputVisibility] =
    useState<Boolean>(false);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };
  console.log(post)
  const handleCategoryAdd = (category: Category) => {
    if(!post.categories.includes(category)){
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
      <form onSubmit={handleSubmit} className="Form">
        <div className="flex items-center justify-center size-full sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden relative">
          <div onClick={() => setImageInputVisibility(true)}>
            {post.image ? (
              <img
                src={post.image}
                alt="Post Image"
                style={{ objectFit: "cover" }}
                onError={handleImageError}
              />
            ) : (
              <FontAwesomeIcon icon={faImage} className="text-7xl" />
            )}
          </div>
          {imageInputVisibility && (
            <div className="Input_box absolute bottom-2">
              <input
                ref={imageInput}
                name="image"
                placeholder="Image URL..."
                className="pl-2 outline-none"
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
              categories={categories}
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
              className="Input_box p-2 w-full h-[80%]"
              onChange={handleTextChange}
            />
          </div>
          <div className="flex justify-end gap-3 mt-auto">
            <button onClick={handleCancel} className="Button">
              Cancel
            </button>
            <button type="submit" className="Button">
              {type} Post
            </button>
          </div>
        </div>
      </form>
  );
}
