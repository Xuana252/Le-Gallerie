import { handleDownloadImage, handleCopyImage } from "@lib/image";
import {
  faAngleLeft,
  faAngleRight,
  faClose,
  faCopy,
  faDownload,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { createPortal } from "react-dom";
import { IKImage } from "@node_modules/imagekitio-next/dist/types";
import Image from "@node_modules/next/image";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import CustomImage from "../Image/Image";

export default function PostImageSlider({ images = [] }: { images: string[] }) {
  const imageListRef = useRef<HTMLUListElement>(null);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  useEffect(() => {
    const imageList = imageListRef.current;
    if (!imageList) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setDisplayIndex(index);
          }
        });
      },
      {
        root: imageList,
        threshold: 0.5,
      }
    );

    // Observe each image
    Array.from(imageList.children).forEach((image, index) => {
      const imgElement = image as HTMLElement;
      observer.observe(imgElement);
      imgElement.dataset.index = index.toString();
    });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, [images]);

  const handleSetSelectedImage = (index: number) => {
    const imageList = imageListRef.current;
    if (imageList) {
      const selectedImage = imageList.children[index];
      if (selectedImage) {
        const selectedHTMLElement = selectedImage as HTMLElement;
        const offsetLeft =
          selectedHTMLElement.offsetLeft -
          (imageList.clientWidth - selectedHTMLElement.clientWidth) / 2;
        imageList.scrollTo({ left: offsetLeft, behavior: "smooth" });
      }
    }
  };
  return (
    <div className="relative size-full flex items-center justify-center">
      <div className="w-full">
        <ul
          ref={imageListRef}
          className="w-full size-fit flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-4 bg-secondary/70 pointer-events-auto"
        >
          {images.map((image, index) => (
            <li
              key={index}
              className="min-w-full h-fit relative flex items-center justify-center "
              onClick={() => setIsZoomed(true)}
            >
              <CustomImage
                src={image}
                alt={"image"}
                className="size-full"
                width={0}
                height={0}
                transformation={[{ quality: 100 }]}
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
      {images.length > 1 && (
        <>
          <div
            className="absolute left-0 h-full p-2 flex items-center justify-center text-xl opacity-0 hover:opacity-50 text-primary transition-all duration-200 ease-linear cursor-pointer bg-accent/50"
            onClick={() => handleSetSelectedImage(displayIndex - 1)}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>
          <div
            className="absolute right-0 h-full p-2 flex items-center justify-center text-xl opacity-0 hover:opacity-50 text-primary transition-all duration-200 ease-linear cursor-pointer bg-accent/50"
            onClick={() => handleSetSelectedImage(displayIndex + 1)}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        </>
      )}

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
                onClick={() => handleDownloadImage(images[displayIndex])}
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
              <button
                className="Icon_smaller"
                onClick={() => handleCopyImage(images[displayIndex])}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
            <CustomImage
              src={images[displayIndex]}
              alt={"image"}
              className="max-w-[90%] max-h-[90%] w-auto h-auto aspect-auto"
              width={0}
              height={0}
              transformation={[{ quality: 100 }]}
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 w-full flex flex-row bg-gradient-to-t from-secondary-2/50 to-transparent">
              <ul className="flex flex-row gap-2 grow py-1 overflow-x-scroll no-scrollbar snap-x snap-mandatory  rounded-lg bg p-1 justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square cursor-zoom-in max-w-[80px] min-w-[80px] snap-start transition-transform duration-200 rounded-lg overflow-hidden ${
                      displayIndex === index
                        ? "scale-100 opacity-100"
                        : "scale-90 opacity-50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetSelectedImage(index);
                    }}
                  >
                    <Image
                      src={image}
                      alt="image"
                      width={200}
                      height={200}
                      blurDataURL="data:/images/PLACEHOLDER.jpg"
                      placeholder="blur"
                      className="size-full object-cover outline-none"
                    />
                  </button>
                ))}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
