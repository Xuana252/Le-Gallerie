"use client";
import React, { useState, useRef } from "react";
import {
  faX,
  faImage,
  faCheck,
  faGhost,
} from "@fortawesome/free-solid-svg-icons";
import { useTransition, animated } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppLogoLoader } from "@components/Loader";

type ImageInputProps = {
  image: string;
  setImage: (image: string) => void;
};
export default function ImageInput({ image, setImage }: ImageInputProps) {
  const imageInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageInputVisibility, setImageInputVisibility] = useState(false);
  const imageInputTransition = useTransition(imageInputVisibility, {
    from: { transform: "translateY(150%)" },
    enter: { transform: "translateY(0%)" },
    leave: { transform: "translateY(150%)" },
    config: { duration: 200, easing: (t) => t * (2 - t) },
  });

  const testImageUrl = (url: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // URL is valid and image loaded
      img.onerror = () => resolve(false); // URL is invalid or image failed to load
      img.src = url;
    });
  };

  const handleImageChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (imageInput.current) {
      const url = imageInput.current.value;
      const isValidURL = await testImageUrl(url);
      if (isValidURL) {
        setImage(url);
        setError(false);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    setImageInputVisibility(false);
  };
  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setImage('')

  }

  return (
    <div className="size-full min-h-48 flex items-center justify-center sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden relative">
       {!isLoading&&image&&!error&&<button className="rounded-full size-6 bg-secondary-1 absolute top-4 right-4 text-base"
        onClick={handleClearImage}>
            <FontAwesomeIcon icon={faX}/>
        </button>}
      <div
        className="size-full bg-secondary-2 flex items-center justify-center"
        onClick={() => setImageInputVisibility(true)}
      >
        {isLoading ? (
          <div className="flex flex-col justify-center items-center">
            <AppLogoLoader />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faGhost} className="text-7xl" />
            <h1>Invalid URL</h1>
          </div>
        ) : image ? (
          <img src={image} alt="Post Image" className="w-full" />
        ) : (
          <FontAwesomeIcon icon={faImage} className="text-7xl" />
        )}
      </div>

      {imageInputTransition((style, item) =>
        item ? (
          <animated.div
            style={{ ...style }}
            className="Input_box_variant_1 absolute bottom-2 m-auto"
          >
            <input
              ref={imageInput}
              name="image"
              placeholder="Image URL..."
              className="pl-2 outline-none bg-transparent placeholder:text-inherit"
            />
            <button className="p-1" onClick={handleImageChange}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </animated.div>
        ) : null
      )}
    </div>
  );
}
