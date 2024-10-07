"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  faX,
  faImage,
  faCheck,
  faGhost,
  faUser,
  faCropSimple,
  faRotateRight,
  faRotateLeft,
  faUpDown,
  faLeftRight,
  faGear,
  faCancel,
  faBackspace,
  faBackward,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
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
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [flip, setFlip] = useState({ flipX: 1, flipY: 1 });

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
    if (isCropping) return;
    imageInput.current?.click();
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    setIsLoading(true);

    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 3 * 1024 * 1024) {
        imageInput.current ? (imageInput.current.value = "") : null;
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
    imageInput.current ? (imageInput.current.value = "") : null;
  };

  const toggleCropping = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCropping((prev) => !prev);
  };
  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCropping(false);
    setImage({ file: null, url: "" });
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };

  useEffect(() => {
    if (!isCropping || !imageRef.current) return;

    cropperRef.current = new Cropper(imageRef.current, {
      viewMode: 1,
      zoomable: true,
      scalable: true,
    });

    return () => {
      cropperRef.current?.destroy();
      cropperRef.current = null; // reset the ref after destruction
    };
  }, [isCropping, imageRef]);

  const handleCrop = () => {
    if (cropperRef.current) {
      // Get the cropped image as a canvas
      const croppedCanvas = cropperRef.current.getCroppedCanvas();

      // Convert the canvas to a data URL and set it as the image
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          // Create a new File from the Blob
          const newFile = new File([blob], "cropped_image.png", {
            type: "image/png",
          });

          // Create a URL for the new image
          const croppedImageUrl = URL.createObjectURL(blob);

          // Set the new image
          setImage({ file: newFile, url: croppedImageUrl });

          // Exit cropping mode
          setIsCropping(false);
        }
      });
    }
  };

  const handleFlipHorizontally = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (cropperRef.current) {
      setFlip((prev) => ({ ...prev, flipX: prev.flipX * -1 }));
      cropperRef.current?.scaleX(flip.flipX * -1);
    }
  };
  const handleFlipVertically = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (cropperRef.current) {
      setFlip((prev) => ({ ...prev, flipY: prev.flipY * -1 }));
      cropperRef.current?.scaleY(flip.flipY * -1);
    }
  };

  const handleRotateLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    rotateImage(-45);
  };
  const handleRotateRight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    rotateImage(45);
  };

  const rotateImage = (angle = 90) => {
    if (cropperRef.current) {
      cropperRef.current.rotate(angle);
    }
  };

  const PostImage = (
    <div className="size-full min-h-[192px]  flex items-center justify-center sm:rounded-l-3xl sm:rounded-tr-none rounded-t-3xl overflow-hidden relative">
      {!isLoading && image && !error && (
        <ul className="absolute top-4 right-4 flex gap-2 ">
          <button className="Edit_button" onClick={toggleCropping}>
            <FontAwesomeIcon icon={faGear} />
          </button>
          <button className="Edit_button" onClick={handleClearImage}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </ul>
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
          isCropping ? (
            <div className="fixed top-0 left-0 bg-black/50 size-full flex items-center justify-center z-50 overflow-y-scroll no-scrollbar">
              <div className="w-full max-w-[800px] md:w-fit  flex flex-col items-center gap-2 ">
                <div>
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Selected preview"
                    className="w-full h-auto"
                  />
                </div>
                <ul className=" flex gap-2 w-fit justify-center items-center p-2 bg-primary/20 border-[2px] border-accent/50 backdrop-blur-sm rounded-xl">
                  <button className="Edit_button" onClick={handleCrop}>
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                  <button
                    className="Edit_button"
                    onClick={handleFlipVertically}
                  >
                    <FontAwesomeIcon icon={faUpDown} />
                  </button>
                  <button
                    className="Edit_button "
                    onClick={handleFlipHorizontally}
                  >
                    <FontAwesomeIcon icon={faLeftRight} />
                  </button>
                  <button className="Edit_button" onClick={handleRotateRight}>
                    <FontAwesomeIcon icon={faRotateRight} />
                  </button>
                  <button className="Edit_button" onClick={handleRotateLeft}>
                    <FontAwesomeIcon icon={faRotateLeft} />
                  </button>
                  <button className="Edit_button" onClick={toggleCropping}>
                    <FontAwesomeIcon icon={faGear} />
                  </button>
                </ul>
              </div>
            </div>
          ) : (
            <img
              ref={imageRef}
              src={image}
              alt="Selected preview"
              className="w-full"
            />
          )
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
    <div className="my-4 h-44 w-full flex flex-col items-center gap-4">
      <div className=" relative ">
        {!isLoading && image && !error && (
          <ul className="absolute h-full right-0 z-10 flex flex-col justify-between">
            <button
              className="rounded-full size-8 bg-primary text-accent  text-base "
              onClick={handleClearImage}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
            <button
              className="rounded-full size-8 bg-primary text-accent text-base"
              onClick={toggleCropping}
            >
              <FontAwesomeIcon icon={faGear} />
            </button>
          </ul>
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
            isCropping ? (
              <div className="fixed top-0 left-0 bg-black/50 size-full flex items-center justify-center z-50">
                <div className="w-full max-w-[800px] md:w-fit flex flex-col items-center gap-2">
                 
                  <div>
                    <img
                      ref={imageRef}
                      src={image}
                      alt="Selected preview"
                      className="w-full"
                    />
                  </div>
                  <ul className=" flex gap-2 w-fit justify-center items-center p-2 bg-primary/20 border-[2px] border-accent/50 backdrop-blur-sm rounded-xl">
                    <button className="Edit_button" onClick={handleCrop}>
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button
                      className="Edit_button"
                      onClick={handleFlipVertically}
                    >
                      <FontAwesomeIcon icon={faUpDown} />
                    </button>
                    <button
                      className="Edit_button "
                      onClick={handleFlipHorizontally}
                    >
                      <FontAwesomeIcon icon={faLeftRight} />
                    </button>
                    <button className="Edit_button" onClick={handleRotateRight}>
                      <FontAwesomeIcon icon={faRotateRight} />
                    </button>
                    <button className="Edit_button" onClick={handleRotateLeft}>
                      <FontAwesomeIcon icon={faRotateLeft} />
                    </button>
                    <button className="Edit_button" onClick={toggleCropping}>
                      <FontAwesomeIcon icon={faGear} />
                    </button>
                  </ul>
                </div>
              </div>
            ) : (
              <img
                src={image}
                alt="Selected preview"
                className="size-full object-cover"
              />
            )
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
        return TextImage;
      default:
        return PostImage;
    }
  };
  return renderImageInput();
}
