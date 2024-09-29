"use client";
import React, { useState, useRef } from "react";
import {
  faX,
  faImage,
  faCheck,
  faGhost,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useTransition, animated } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppLogoLoader } from "@components/UI/Loader";

type ImageInputProps = {
  image: string;
  type?: "ProfileImage" | "PostImage" | "TextImage";
  setImage: (image: { file: File | null; url: string }) => void;
};
export default function ImageInput({
  image,
  type = "PostImage",
  setImage,
}: ImageInputProps) {
  const imageInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const testImageUrl = (url: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // URL is valid and image loaded
      img.onerror = () => resolve(false); // URL is invalid or image failed to load
      img.src = url;
    });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    imageInput.current?.click();
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    setIsLoading(true);

    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 3 * 1024 * 1024) {
        imageInput.current?imageInput.current.value='':null
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return;
      }
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      const isValidURL = await testImageUrl(objectUrl);
      if (isValidURL) {
        setImage({ file: file, url: objectUrl });
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
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    imageInput.current?imageInput.current.value='':null
  };
  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setImage({ file: null, url: "" });
    if (imageInput.current) {
      imageInput.current.value = ""; 
    }
  };
  const PostImage = (
    <div className="size-full min-h-[192px]  flex items-center justify-center sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden relative">
      {!isLoading && image && !error && (
        <button
          className="rounded-full size-6 bg-secondary-1 absolute top-4 right-4 text-base"
          onClick={handleClearImage}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      )}
      <div
        className="size-full bg-secondary-2 flex items-center justify-center"
        onClick={handleImageClick}
      >
        {isLoading ? (
          <div className="flex flex-col justify-center items-center">
            <AppLogoLoader />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faGhost} className="text-7xl" />
            <h1>
              File size might be to large or invalid URL <br />
              File size should be less than 3MB
            </h1>
          </div>
        ) : image ? (
          <img src={image} alt="Selected preview" className="w-full" />
        ) : (
          <FontAwesomeIcon icon={faImage} className="text-7xl" />
        )}
      </div>
      <input
        ref={imageInput}
        type="file"
        disabled={isLoading}
        className="absolute invisible size-1"
        onChange={handleImageChange}
        accept="image/*"
      />
    </div>
  );
  const ProfileImage = (
    <div className="my-4 h-44 w-full relative flex flex-col items-center gap-4">
      <div className=" relative ">
        {!isLoading && image && !error && (
          <button
            className="rounded-full size-8 bg-primary text-accent absolute bottom-0 right-0 text-base z-10"
            onClick={handleClearImage}
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        )}
        <div
          className="size-28 flex justify-center items-center bg-secondary-2 rounded-full relative overflow-hidden border-accent border-2"
          onClick={handleImageClick}
        >
          {isLoading ? (
            <AppLogoLoader />
          ) : error ? (
            <FontAwesomeIcon icon={faGhost} className="text-7xl" />
          ) : image ? (
            <img src={image} alt="Selected preview" className="size-full" />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              className="size-full mt-4 text-9xl"
            />
          )}
        </div>
      </div>
      <input
        ref={imageInput}
        type="file"
        disabled={isLoading}
        className="hidden"
        onChange={handleImageChange}
        accept="image/*"
      />
      <h1 className="text-medium">
        {image ? "Looking good there" : "Add Profile picture"}
      </h1>
    </div>
  );

  const TextImage = (
    <>
      <div className="Icon_small" onClick={handleImageClick}>
        <FontAwesomeIcon icon={faImage} />
      </div>
      <input
        ref={imageInput}
        type="file"
        className="hidden"
        onChange={handleImageChange}
        accept="image/*"
      />
    </>
  );

  const renderImageInput = () => {
    switch (type) {
      case "ProfileImage":
        return ProfileImage;
      case "PostImage":
        return PostImage;
      case "TextImage":
        return TextImage
      default:
        return PostImage;
    }
  };
  return renderImageInput();
}
