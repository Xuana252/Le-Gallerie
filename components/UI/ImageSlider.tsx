import Image from "@node_modules/next/image";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export default function ImageSlider({
  images = [],
  onChangeIndex,
  onClick,
}: {
  images: string[];
  
  onChangeIndex: Dispatch<SetStateAction<number>>;
  onClick: any;
}) {
  const imageListRef = useRef<HTMLUListElement>(null);
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    onChangeIndex(displayIndex);
  }, [displayIndex]);

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
          className="w-full size-fit flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-4 bg-secondary/50"
        >
          {images.map((image, index) => (
            <li
              key={index}
              className="min-w-full h-fit relative flex items-center justify-center "
              onClick={onClick}
            >
              <Image
                src={image}
                alt="image"
                width={1000}
                height={1000}
                blurDataURL="data:/images/PLACEHOLDER.jpg"
                placeholder="blur"
                className="size-full object-contain snap-start"
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-0 left-0 w-full flex flex-row p-2">
        <ul className="flex flex-row gap-2 grow py-1 overflow-x-scroll no-scrollbar snap-x snap-mandatory  rounded-lg bg-secondary-1/50 p-1">
          {images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square cursor-zoom-in max-w-[50px] min-w-[50px] snap-start transition-transform duration-200 rounded-lg overflow-hidden ${
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
    </div>
  );
}
