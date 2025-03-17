"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InputBox from "../Input/InputBox";
import {
  type Post,
  type Category,
  UploadPost,
  UploadImage,
} from "@lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import SubmitButton from "@components/Input/SubmitButton";
import { useSession } from "next-auth/react";
import { useTransition, animated } from "@react-spring/web";
import ImageInput from "@components/Input/ImageInput";
import { createPost, updatePost } from "@actions/postActions";
import { getCategories } from "@actions/categoriesActions";
import { checkPostRateLimit } from "@actions/checkRateLimit";
import toastError from "@components/Notification/Toaster";
import {uploadImage,updateImage} from "@lib/upload";
import withAuth from "@middleware";
import { SubmitButtonState } from "@enum/submitButtonState";
import { handleUpdateImage } from "@lib/image";
import { CategoriesInput } from "@components/Input/CategoryInput";



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
  const { data: session } = useSession();
  const router = useRouter();

  const [submitState, setSubmitState] = useState<SubmitButtonState>(SubmitButtonState.IDLE);
  const [imageToUpdate, setUpdateInfo] = useState(editPost?.image.map((img:any)=>img.url) || []);

  const [post, setPost] = useState<UploadPost>(
    editPost || {
      creator: { _id: session?.user.id || "" },
      title: "",
      description: "",
      categories: [],
      image: [],
    }
  );


  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (post.image.length>0 && session?.user.id) {
      try {
        setSubmitState(SubmitButtonState.PROCESSING);
        const isRateLimited = await checkPostRateLimit();
        if (isRateLimited) {
          throw new Error("one post request per minute. please wait");
        }
        let response;
        let imageUrlList = await handleUpdateImage(post.image,imageToUpdate)
       
        
        const postToUpload: Post = {
          _id:post._id,
          creator: post.creator,
          title: post.title,
          description: post.description,
          categories: post.categories,
          image: imageUrlList,
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
            setSubmitState(SubmitButtonState.SUCCESS);
            console.log(`Attempted to ${type} successfully`);

            type === "Edit"
              ? localStorage.setItem("post", JSON.stringify({...post,image:postToUpload.image}))
              : null;

            setTimeout(() => router.push(`/post/${response._id}`), 1000);
          }, 500);
        } else {
          setSubmitState(SubmitButtonState.FAILED);
          console.log(`Failed to ${type} post`);
        }
      } catch (error: any) {
        setSubmitState(SubmitButtonState.FAILED);
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

  const handleImageChange = (image: UploadImage[]) => {
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
      <div>
        <ImageInput image={post.image} setImage={handleImageChange} />
      </div>
      <div className=" p-4 flex flex-col gap-2">
        <div>
          <h3>Title</h3>
          <InputBox
            onTextChange={handleTextChange}
            type="Input"
            name="title"
            value={post.title}
            showName={false}
          >
            add some cool title...
          </InputBox>
        </div>
        <div>
          <h3>Categories</h3>
          <CategoriesInput
            selectedCategories={post.categories}
            onSelected={handleCategoryAdd}
            onRemoved={handleCategoryRemove}
          />
        </div>
        <div className="grow">
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
