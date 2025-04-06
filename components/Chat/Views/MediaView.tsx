import { ChatBoxView } from "@enum/chatBoxView";
import CustomImage from "@components/UI/Image/Image";
import { faAngleLeft } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";

export default function MediaView({
  chat,
  setChatBoxView,
  isBlocked,
  blocked,
}: {
  chat: any;
  setChatBoxView: Dispatch<SetStateAction<ChatBoxView>>;
  isBlocked: boolean;
  blocked: boolean;
}) {
  return (
    <>
      <div className="w-full justify-center grid grid-cols-3 h-[30px] bg-secondary-2/50 items-center px-2">
        <button
          className="Icon_smaller"
          onClick={() => setChatBoxView(ChatBoxView.SETTING)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-lg font-semibold text-center content-center">
          Media
        </span>
      </div>
      <div className="grid grid-cols-3 h-[420px] overflow-y-scroll no-scrollbar gap-1 w-full p-1">
        {chat?.message?.reverse().map((message: any, index: number) =>
          message.image.length > 0 && !message.delete
            ? message.image.map((url: string) => (
                <div
                  key={index}
                  className="aspect-square cursor-zoom-in size-full"
                >
                  <CustomImage
                    zoomable={true}
                    src={blocked || isBlocked ? "" : url}
                    alt="picture"
                    className="size-full"
                    onerror
                    width={0}
                    height={0}
                    transformation={[{ quality: 50 }]}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))
            : null
        )}
      </div>
    </>
  );
}
