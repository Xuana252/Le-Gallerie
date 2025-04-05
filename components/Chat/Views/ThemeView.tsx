import ChatBoxProps from "@components/UI/Props/ChatBoxProps";
import { ChatBoxView } from "@enum/chatBoxView";
import { changeChatTheme, RenderBackground } from "@lib/Chat/chat";
import { faAngleLeft } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import { themeCategories } from "@theme/ThemesList";
import React, { Dispatch, SetStateAction } from "react";

export default function ThemeView({
  chat,
  chatInfo,
  setChatBoxView,
}: {
  chat: any;
  chatInfo: any;
  setChatBoxView: Dispatch<SetStateAction<ChatBoxView>>;
}) {
  const { data: session } = useSession();
  return (
    <div className="size-full">
      <div className="w-full justify-center grid grid-cols-[auto_1fr_auto] h-[30px] bg-secondary-2/50 items-center px-2">
        <button
          className="Icon_smaller"
          onClick={() => setChatBoxView(ChatBoxView.SETTING)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-base font-semibold text-center content-center">
          {chat.theme.replace(/-/g, " ").replace("theme", "")}
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
        className={` flex flex-col gap-2 p-2 overflow-scroll h-[420px] no-scrollbar`}
      >
        {themeCategories.map((category) => (
          <div key={category.name} className="grid grid-cols-3 gap-2">
            {category.list.map((theme) => (
              <div
                key={theme}
                className={`flex flex-col rounded-lg overflow-hidden   hover:-translate-y-1 transition-all duration-150 ease-in-out shadow-lg`}
                onClick={async () =>
                  changeChatTheme(
                    chatInfo.chatId,
                    theme,
                    session?.user.id || ""
                  )
                }
              >
                <ChatBoxProps theme={theme}/>
               
              </div>
            ))}
          </div>
        ))}
      </ul>
    </div>
  );
}
