"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDownload,
  faShare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import Feed from "@components/Feed";
import InputBox from "@components/InputBox";
import Link from "next/link";

export default function Post() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [post, setPost] = useState({
        image:'https://www.cnet.com/a/img/resize/36e8e8fe542ad9af413eb03f3fbd1d0e2322f0b2/hub/2023/02/03/afedd3ee-671d-4189-bf39-4f312248fb27/gettyimages-1042132904.jpg?auto=webp&fit=crop&height=1200&width=1200',
        title:'Test',
        categories:['Food']
    });

  const fetchPost = async () => {
    const response = await fetch(`api/posts/${searchParams.get("id")}`);
    const data = await response.json();

    setPost(data);
  };
  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <section >
      <div className="relative mt-4">
          <button
            className="absolute top-4 left-4 Icon bg-slate-300"
            onClick={() => {
              router.back();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="xl" />
          </button>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 rounded-3xl w-full max-w-[1080px] min-h-[400px] shadow-lg m-auto bg-secondary-1 `}
          >
            <div className="flex items-center size-full sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden bg-secondary-2">
              <img src={post.image} alt="displaying photo" className="w-full " />
            </div>
            <div className="size-full p-4 flex flex-col gap-0">
              <div className="h-fit w-full grow bg-slate-100">
                <div className="flex-row-reverse p-2 h-fit flex sticky top-0 z-1 gap-2 bg-slate-200">
                  <button
                    data-tooltip-id="Download"
                    data-tooltip-content={"Download"}
                    data-tooltip-place="bottom"
                    className="hover:bg-secondary-2 Icon "
                    // onClick={handleDownload}
                  >
                    <FontAwesomeIcon icon={faDownload} size="xl" />
                  </button>
                  <button
                    className="hover:bg-secondary-2 Icon "
                    // onClick={handleShare}
                  >
                    <FontAwesomeIcon icon={faShare} size="xl" />
                  </button>
                </div>
                <div className="grow flex-col flex gap-2">
                  <h1 className="text-3xl font-bold">{post.title}</h1>
                  <h2 className="text-2xl">{post.categories.toString()}</h2>
                </div>
              </div>
              <div className="bg-secondary-1 py-2 sticky z-1 bottom-0 flex flex-row items-center justify-between  w-full h-fit gap-2">
                <Link href={'/profile'} >
                  <button className="bg-secondary-2 Icon">
                      <FontAwesomeIcon icon={faUser} size="xl" />
                  </button>
                </Link>
                <InputBox type="Input"></InputBox>
              </div>
            </div>
          </div>
      </div>
      <br />
      <h1 className="text-center text-xl ">Explore more contents just like this</h1>
      <Feed></Feed>
    </section>
  );
}
