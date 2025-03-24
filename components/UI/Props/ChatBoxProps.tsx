import React from "react";

export default function ChatBoxProps() {
  return (
    <div
      className={`flex flex-col  max-w-[300px] w-full aspect-[2/3]  shadow-md z-40`}
    >
      <div className="h-[10%] w-full bg-secondary-2 flex flex-row justify-between items-center p-[3%] rounded-t-lg shadow-lg">
        <div className="bg-primary h-full w-[30%] rounded-full flex flex-row items-center pr-[3%] gap-[3%]">
          <div className="rounded-full h-full  aspect-square bg-accent"></div>
          <div className="rounded-full h-[50%] grow bg-accent"></div>
        </div>
        <div className="bg-primary h-full  rounded-lg flex flex-row p-[2%]  items-center justify-between gap-1">
          <div className="rounded-full h-full aspect-square bg-accent"></div>
          <div className="rounded-full h-full aspect-square bg-accent"></div>
          <div className="rounded-full h-full aspect-square bg-accent"></div>
        </div>
      </div>
      <div
        className={` bg-secondary-1/50 backdrop:blur-sm w-full grow flex flex-col-reverse  p-[2%] gap-[2%]`}
      >
        <div className="bg-accent h-[8%] w-[40%] self-end rounded-xl translate-x-[40%] shadow-lg"></div>
        <div className="bg-primary h-[16%] w-[60%] self-start rounded-xl -translate-x-[30%] shadow-lg"></div>
        <div className="bg-accent h-[8%] w-[30%] self-end rounded-xl translate-x-[50%] shadow-lg"></div>
      </div>
      <div className="h-[10%] w-full bg-secondary-1 flex flex-row justify-between items-center p-[3%] gap-[2%] rounded-b-lg">
        <div className="bg-primary h-full aspect-square rounded-full flex items-center justify-center  p-[3%]">
          <div className="rounded-full size-full bg-accent"></div>
        </div>
        <div className="bg-primary grow h-full shadow-inner rounded-xl"></div>
        <div className="bg-primary h-full aspect-square rounded-full flex items-center justify-center p-[3%]">
          <div className="rounded-full size-full bg-accent"></div>
        </div>
        <div className="bg-primary h-full aspect-square rounded-full flex items-center justify-center p-[3%]">
          <div className="rounded-full size-full bg-accent"></div>
        </div>
      </div>
    </div>
  );
}
