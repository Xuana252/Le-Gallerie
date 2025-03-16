"use client";
import React, { useEffect, useState } from "react";
import { IKImage } from "imagekitio-next";
import { createPortal } from "react-dom";
import {
  faClose,
  faCopy,
  faDownload,
  faSave,
  faX,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { handleCopyImage, handleDownloadImage } from "@lib/image";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function CustomImage({ src, zoomable = false, ...props }: any) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageSource, setImageSource] = useState("");
  const [isErrored, setIsErrored] = useState<boolean>(true);

  const testImageUrl = (url: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // URL is valid and image loaded
      img.onerror = () => resolve(false); // URL is invalid or image failed to load
      img.src = url;
    });
  };

  useEffect(() => {
    let isMounted = true;


    const checkError = async (newSrc: string) => {
      const validUrl = await testImageUrl(newSrc);
      if (isMounted) {
        setImageSource(validUrl ? newSrc : "");
        setIsErrored(!validUrl);
      }
    };

    checkError(src);

    return () => {
      isMounted = false;
    };
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
            key={imageSource}
            onClick={() => setIsZoomed(zoomable && true)}
            urlEndpoint={urlEndpoint}
            src={imageSource}
            priority
            {...props}
          />
          {isZoomed &&
            createPortal(
              <div className="fixed z-50 top-0 left-0 h-screen w-screen bg-black/80 backdrop-blur-sm flex items-center justify-center p-10">
                <div className="flex flex-row-reverse gap-2 items-center absolute right-[20px] top-[20px] bg-secondary-1/70 p-1 rounded-full">
                  <button
                    className="Icon_smaller"
                    onClick={() => setIsZoomed(false)}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                  <button
                    className="Icon_smaller"
                    onClick={() => handleDownloadImage(src)}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    className="Icon_smaller"
                    onClick={() => handleCopyImage(src)}
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
                <IKImage
                  urlEndpoint={urlEndpoint}
                  alt="Image"
                  width={0}
                  height={0}
                  src={imageSource}
                  className="max-w-[80%] max-h-[80%] w-auto h-auto aspect-auto"
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
