import { RenderBackground } from "@lib/Chat/render";
import React from "react";

export default function ChatBoxProps({ theme = "" }: { theme?: string }) {
  return (
    <div
      className={`${theme} rounded-lg overflow-hidden flex flex-col  max-w-[300px] w-full aspect-[2/3]  z-40`}
    >
      <div className="h-[10%] w-full bg-secondary-2 flex flex-row justify-between items-center p-[3%]  shadow-lg">
        <div className="bg-primary h-full w-[30%] rounded-full flex flex-row items-center pr-[3%] gap-[3%]">
          <div className="rounded-full h-full  aspect-square bg-accent"></div>
        </div>
        <div className="bg-primary h-full  rounded-lg w-[30%]"></div>
      </div>
      <div
        className={` backdrop:blur-sm w-full grow flex flex-col-reverse  p-[2%] gap-[2%] relative`}
      >
        <div className="size-full opacity-70 absolute top-0 left-0 z-0">
          {RenderBackground(theme)}
        </div>

        <div className="bg-accent h-[8%] w-[40%] self-end rounded-lg translate-x-[40%] shadow-lg"></div>
        <div className="bg-primary h-[16%] w-[60%] self-start rounded-lg -translate-x-[30%] shadow-lg"></div>
        <div className="bg-accent h-[8%] w-[30%] self-end rounded-lg translate-x-[50%] shadow-lg"></div>
      </div>
      <div className="h-[10%] w-full bg-secondary-1 flex flex-row justify-between items-center p-[3%] gap-[2%] ">
        <div className="bg-primary h-full aspect-square rounded-full "></div>
        <div className="bg-primary grow h-full shadow-inner rounded-xl"></div>
        <div className="bg-primary h-full aspect-square rounded-full"></div>
        <div className="bg-primary h-full aspect-square rounded-full"></div>
      </div>
    </div>
  );
}
