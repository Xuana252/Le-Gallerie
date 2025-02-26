import React from "react";
import CustomImage from "./Image";

export default function ImageFullScreenInspector({img}:{img:string}) {
  return (
    <div className="size-full bg-black/80 backdrop-blur-sm">
      <CustomImage
        src={img}
        alt={'Image'}
        className="w-full"
        width={0}
        height={0}
        transformation={[{ quality: 100 }]}
        style={{ objectFit: "cover" }}
        lqip={{ active: true, quality: 20 }}
      />
    </div>
  );
}
