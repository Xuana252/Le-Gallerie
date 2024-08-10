'use client'
import React, { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InputBox from "./InputBox";


type Post = {
  title: string;
  image: string;
  categories: string[];
};

type FormProps = {
   type:'Create'|'Edit'
  setPost: React.Dispatch<React.SetStateAction<Post>>;
  handleSubmit: (e: FormEvent) => void;
};
export default function Form({type,setPost, handleSubmit }: FormProps) {
  const router = useRouter();

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
   e.preventDefault();
   router.back(); 
 }

  return (
    <section>
      <h1>{type} your post</h1>
      <form onSubmit={handleSubmit} className="Form">
        <div className="flex items-center size-full sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden relative">
          <Image src={'https://hungrybynature.com/wp-content/uploads/2017/09/pinch-of-yum-workshop-19.jpg'} alt="Post Image" width={0} height={0} layout='responsive' />
        </div>
        <div className="size-full p-4 flex flex-col gap-2">
          <div>
             <h3>Title</h3>
               <InputBox type='Input'>add some cool title...</InputBox>
          </div>
          <div>
             <h3>Categories</h3>
             <InputBox type='Input'>what about categories... </InputBox>
          </div>
          <div className="h-full">
             <h3>Description</h3>
             <textarea placeholder="tell us something about your post..." className="Input_box p-2 w-full h-[80%]" />
          </div>
          <div className="flex justify-end gap-3 mt-auto">
            <button
              onClick={handleCancel}
              className="Button"
            >
              Cancel
            </button>
            <button type="submit" className="Button">{type} Post</button>
          </div>
        </div>
      </form>
    </section>
  );
}
