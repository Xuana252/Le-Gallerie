import { faUser } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React from "react";
import CustomImage from "./Image";

export default function ImageGroupDisplay({images=[]}: {images:string[]}) {
  return (
    <div
      className={`${
        images.length > 1 ? "grid grid-cols-2 gap-1" : "rounded-full overflow-hidden"
      } size-full  items-center justify-between pointer-events-none`}
    >
      {images.slice(0, 4).map((image: string, index: number) => (
        <div
          key={index}
          className={`${
            images.length === 3 && index === 2 ? "col-span-2" : "flex-1"
          } rounded-md flex items-center justify-center h-full  overflow-hidden bg-secondary-2 text-accent`}
        >
          {image ? (
            <CustomImage
              src={image}
              alt="profile picture"
              className="size-full"
              width={0}
              height={0}
              transformation={[{ quality: 10 }]}
              style={{ objectFit: "cover" }}
            ></CustomImage>
          ) : (
            <FontAwesomeIcon icon={faUser} className="size-full"/>
          )}
        </div>
      ))}
    </div>
  );
}
