
import React, { FormEvent, useEffect, useState } from "react";
import PostForm from "@components/PostForm";
import { useRouter } from "next/navigation";
import { SubmitButtonState, type Category, type Post } from "@lib/types";
import { useSession } from "next-auth/react";

export default function CreatePost() {

  return (
    <section className="flex flex-col items-center justify-center  grow">
      <PostForm
        type="Create"
      ></PostForm>
    </section>
  );
}
