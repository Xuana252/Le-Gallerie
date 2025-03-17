import { ChatBoxView } from "@enum/chatBoxView";
import { changeChatTheme } from "@lib/Chat/chat";
import { faAngleLeft } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import { themes } from "@theme/ThemesList";
import React, { Dispatch, SetStateAction } from "react";

export default function ThemeView({
  chat,
  chatInfo,
  setChatBoxView,
}: {
  chat: any;
  chatInfo: any;
  setChatBoxView: Dispatch<
    SetStateAction<ChatBoxView>
  >;
}) {

    const {data:session} = useSession()
  return (
    <div className="size-full">
      <div className="w-full justify-center grid grid-cols-3 h-[30px] bg-secondary-2/50 items-center px-2">
        <button
          className="Icon_smaller"
          onClick={() => setChatBoxView(ChatBoxView.SETTING)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-lg font-semibold text-center content-center">
          Theme
        </span>
        <div
          className={`${chat.theme} ml-auto size-6 rounded-lg grid grid-cols-2 grid-rows-2  overflow-hidden clip-[circle(50%_at_50%_50%)]`}
        >
          <div className="bg-primary"></div>
          <div className="bg-secondary-1"></div>
          <div className="bg-secondary-2"></div>
          <div className="bg-accent"></div>
        </div>
      </div>

      <ul
        className={` grid grid-cols-3 gap-2 p-2 overflow-scroll h-[420px] no-scrollbar`}
      >
        {themes.map((theme) => (
          <div
            key={theme}
            className={`flex flex-col rounded-lg overflow-hidden h-[200px] ${theme} hover:-translate-y-1 transition-all duration-150 ease-in-out shadow-lg`}
            onClick={async () => changeChatTheme(chatInfo.chatId,theme,session?.user.id||"")}
          >
            <div className="h-7 w-full bg-secondary-2 flex flex-row justify-between items-center p-1">
              <div className="bg-primary h-4 w-[50px] rounded-lg flex flex-row items-center pr-1 gap-1">
                <div className="rounded-full size-4 bg-accent"></div>
                <div className="rounded-full h-2 grow bg-accent"></div>
              </div>
              <div className="bg-primary h-4  rounded-md flex flex-row p-1 items-center justify-between gap-[2px]">
                <div className="rounded-full size-2 bg-accent"></div>
                <div className="rounded-full size-2 bg-accent"></div>
                <div className="rounded-full size-2 bg-accent"></div>
              </div>
            </div>
            <div
              className={` bg-secondary-1 w-full grow flex flex-col-reverse p-1 gap-1`}
            >
              <div className="bg-accent h-4 w-[70px] self-end rounded-xl"></div>
              <div className="bg-primary h-4 w-[50px] self-start rounded-xl"></div>
              <div className="bg-accent h-4 w-[40px] self-end rounded-xl"></div>
            </div>
            <div className="h-7 w-full bg-secondary-2 flex flex-row justify-between items-center p-1 gap-1">
              <div className="bg-primary size-4 rounded-lg flex items-center justify-center">
                {" "}
                <div className="rounded-full size-2 bg-accent"></div>
              </div>
              <div className="bg-primary grow h-4 rounded-lg"></div>
              <div className="bg-primary size-4 rounded-lg flex items-center justify-center">
                {" "}
                <div className="rounded-full size-2 bg-accent"></div>
              </div>
              <div className="bg-primary size-4 rounded-lg flex items-center justify-center">
                {" "}
                <div className="rounded-full size-2 bg-accent"></div>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
