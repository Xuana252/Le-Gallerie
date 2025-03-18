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
  faClose,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppLogoLoader } from "@components/UI/Loader";
import { UploadImage } from "@lib/types";
import ImageSlider from "@components/UI/ImageSlider";
import { testImageUrl } from "@lib/image";
import toastError from "@components/Notification/Toaster";

type ImageInputProps = {
  image: UploadImage[];
  type?: "ProfileImage" | "PostImage" | "TextImage";
  setImage: (image: UploadImage[]) => void;
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
  const [imageToCrop, setImageToCrop] = useState("");
  const [flip, setFlip] = useState({ flipX: 1, flipY: 1 });
  const [isAdding, setIsAdding] = useState(false);

  const [displayIndex, setDisplayIndex] = useState(0);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (imageToCrop) return;
    imageInput.current?.click();
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    e.preventDefault();
    setIsLoading(true);

    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 3 * 1024 * 1024) {
        imageInput.current ? (imageInput.current.value = "") : null;
        setError(true);
        toastError("File size must be less than 3MB");
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
        setImage(
          isAdding || image.length === 0
            ? [...image, { file, url: objectUrl }]
            : image.map((img, idx) =>
                idx === displayIndex ? { file, url: objectUrl } : img
              )
        );
        setIsAdding(false);

        setError(false);
      } else {
        toastError("Invalid URL");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      toastError("Something went wrong, please try again");
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
    setImageToCrop(imageToCrop ? "" : image[displayIndex]?.url || "");
  };

  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setImageToCrop("");
    setImage(
      image.filter((img: UploadImage, index: number) => index !== displayIndex)
    );
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };

  useEffect(() => {
    if (!imageToCrop || !imageRef.current) return;

    cropperRef.current = new Cropper(imageRef.current, {
      viewMode: 1,
      zoomable: true,
      scalable: true,
    });

    return () => {
      cropperRef.current?.destroy();
      cropperRef.current = null; // reset the ref after destruction
    };
  }, [imageToCrop, imageRef]);

  const handleCrop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
          setImage(
            image.map((img: UploadImage, index: number) =>
              index === displayIndex
                ? { file: newFile, url: croppedImageUrl }
                : img
            )
          );

          // Exit cropping mode
          setImageToCrop("");
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
      {!isLoading && image.length > 0 && !error && (
        <ul className="absolute z-50 top-4 right-4 flex gap-2 ">
          <div
            className="Edit_button"
            onClick={(e) => {
              setIsAdding(true);
              handleImageClick(e);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <button className="Edit_button" onClick={toggleCropping}>
            <FontAwesomeIcon icon={faGear} />
          </button>
          <button className="Edit_button" onClick={handleClearImage}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </ul>
      )}
      <div className="size-full bg-secondary-2 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center">
            <AppLogoLoader />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faGhost} className="text-7xl" />
          </div>
        ) : image.length > 0 ? (
          <ImageSlider
            images={image.map((image: UploadImage) => image.url)}
            onChangeIndex={setDisplayIndex}
            onClick={handleImageClick}
          />
        ) : (
          <div onClick={handleImageClick}>
            <FontAwesomeIcon icon={faImage} className="text-7xl" />
          </div>
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
    <div className="h-fit w-full flex flex-col items-center gap-4">
      <div className=" relative ">
        {!isLoading && image && !error && (
          <ul className="absolute h-full right-0 z-10 flex flex-col justify-between">
            <button
              className="rounded-full size-8 bg-primary text-accent  text-base "
              onClick={handleClearImage}
            >
              <FontAwesomeIcon icon={faClose} />
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
          ) : image[0] ? (
            <img
              src={image[0].url}
              alt="Selected preview"
              className="size-full object-cover"
            />
          ) : (
            <FontAwesomeIcon icon={faImage} className="text-6xl" />
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

  return imageToCrop ? (
    <div className="fixed top-0 left-0 bg-black/50 size-full flex items-center justify-center z-50">
      <div className=" w-auto h-auto flex flex-col items-center gap-2">
        <div>
          <img
            ref={imageRef}
            src={imageToCrop}
            alt="Selected preview"
            className="object-contain max-h-[500px] md:max-h-[800px] min-h-[400px]"
          />
        </div>
        <ul className=" flex gap-2 w-fit justify-center items-center p-2 bg-primary/20 border-[2px] border-accent/50 backdrop-blur-sm rounded-xl">
          <button className="Edit_button" onClick={handleCrop}>
            <FontAwesomeIcon icon={faSave} />
          </button>
          <button className="Edit_button" onClick={handleFlipVertically}>
            <FontAwesomeIcon icon={faUpDown} />
          </button>
          <button className="Edit_button " onClick={handleFlipHorizontally}>
            <FontAwesomeIcon icon={faLeftRight} />
          </button>
          <button className="Edit_button" onClick={handleRotateRight}>
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
          <button className="Edit_button" onClick={handleRotateLeft}>
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
          <button className="Edit_button" onClick={toggleCropping}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </ul>
      </div>
    </div>
  ) : (
    renderImageInput()
  );
}
