
import React, { FormEvent, useEffect, useState } from "react";
import PostForm from "@components/Forms/PostForm";

export default function CreatePost() {

  return (
    <section className="flex flex-col items-center justify-center  grow">
      <PostForm
        type="Create"
      ></PostForm>
    </section>
  );
}
