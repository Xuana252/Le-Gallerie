"use client";
import React, { useEffect, useState } from "react";
import { IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function CustomImage({ src, ...props }: any) {
  const [imageSource, setImageSource] = useState(src);
  const [isErrored,setIsErrored] = useState<boolean>(false)
  const testImageUrl = (url:string) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // URL is valid and image loaded
      img.onerror = () => resolve(false); // URL is invalid or image failed to load
      img.src = url;
    });
  };
  const checkError = async () => {
    const validUrl = await testImageUrl(imageSource)
    setIsErrored(!validUrl)
  }

  useEffect(()=>{
    checkError()
  },[src])

  return (
    <>
      {isErrored?
        (<div className="size-full flex items-center justify-center bg-secondary-2/30 backdrop-blur-sm">
          <span className="font-AppLogo text-[2.5em] select-none">AppLogo</span>
        </div>)
        :(<IKImage
        urlEndpoint={urlEndpoint}
        src={imageSource}
        priority
        {...props}
      />)}
    </>
  );
}
