"use client";
import React, { useEffect, useState } from "react";
import { IKImage } from "imagekitio-next";
import { createPortal } from "react-dom";
import { faX } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function CustomImage({ src, zoomable = false, ...props }: any) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageSource, setImageSource] = useState(src);
  const [isErrored, setIsErrored] = useState<boolean>(false);
  const testImageUrl = (url: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // URL is valid and image loaded
      img.onerror = () => resolve(false); // URL is invalid or image failed to load
      img.src = url;
    });
  };
  const checkError = async () => {
    const validUrl = await testImageUrl(imageSource);
    setIsErrored(!validUrl);
  };

  useEffect(() => {
    checkError();
  }, [src]);

  return (
    <>
      {isErrored ? (
        <div className="size-full flex items-center justify-center bg-secondary-2/30 backdrop-blur-sm">
          <span className="font-AppLogo text-[2.5em] select-none">AppLogo</span>
        </div>
      ) : (
        <>
          <IKImage
            onClick={() => setIsZoomed(zoomable && true)}
            urlEndpoint={urlEndpoint}
            src={imageSource}
            priority
            {...props}
          />
          {isZoomed &&
            createPortal(
              <div className="fixed z-50 top-0 left-0 h-screen w-screen bg-black/80 backdrop-blur-sm flex items-center justify-center p-10 animate-fadeIn">
                <button
                  className="Icon_smaller absolute right-10 top-10"
                  onClick={() => setIsZoomed(false)}
                >
                  <FontAwesomeIcon icon={faX} className="text-gray-400" />
                </button>
                <IKImage
                  urlEndpoint={urlEndpoint}
                  alt="Image"
                  width={0}
                  height={0}
                  src={imageSource}
                  className="max-w-full max-h-full w-auto h-auto"
                  priority
                />
              </div>,
              document.body
            )}
        </>
      )}
    </>
  );
}
