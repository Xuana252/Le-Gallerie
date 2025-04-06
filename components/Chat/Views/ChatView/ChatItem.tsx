import { Reaction } from "@enum/reactionEnum";
import DropDownButton from "@components/Input/DropDownButton";
import PopupButton from "@components/Input/PopupButton";
import ReactionButton from "@components/Input/ReactionInput";
import CustomImage from "@components/UI/Image/Image";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import {
  addChatItemReaction,
  isLink,
} from "@lib/Chat/chat";
import { formatDateTime } from "@lib/dateFormat";
import { getTop3Reactions, renderReaction } from "@lib/Emoji/render";
import { User } from "@lib/types";
import {
  faEllipsisVertical,
  faL,
  faMapPin,
  faTrash,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";

import React, { useEffect, useRef, useState } from "react";
import { render } from "@node_modules/@types/react-dom";
import { renderTextWithLinks, renderAppLink, renderLink } from "@lib/Chat/render";

export default function ChatItem({
  message,
  isPinned,
  user,
  messageClass,
  handleDelete,
  handleAddReaction,
  handlePin,
}: {
  message: any;
  isPinned: boolean;
  user: User;
  messageClass: string;
  handleDelete: any;
  handleAddReaction: any;
  handlePin: any;
}) {
  const { data: session } = useSession();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [dropDirection, setDropDirection] = useState<"left" | "right">("left");
  const messageRef = useRef<HTMLDivElement>(null);

  const [processedMessage, setProcessMessage] = useState<string | JSX.Element[]>(
    message.text
  );

  useEffect(() => {
    const processLinks = async () => {
      if (isLink(message.text)) {
        const parts = renderTextWithLinks(message.text);

        const renderPart = await Promise.all(
          parts.map(async (part, index) => {
            if (part.type === "appLink") {
              return await renderAppLink(part.content, index);
            } else if (part.type === "link") {
              return renderLink(part.content, index);
            } else {
              return <span key={index}>{part.content}</span>;
            }
          })
        );
        setProcessMessage(renderPart);
      } else {
        setProcessMessage(message.text);
      }
    };

    processLinks();
  }, [message.text]);

  useEffect(() => {
    !isHovering && setIsSetting(false);
  }, [isHovering]);

  const profileRenderClasses = [
    "Other_message_under",
    "Other_message rounded-2xl",
  ];

  useEffect(() => {
    if (messageRef.current) {
      const width = messageRef.current.clientWidth;

      if (width > 200) {
        setDropDirection(
          messageClass.includes("My_message") ? "left" : "right"
        );
      } else {
        setDropDirection(
          messageClass.includes("My_message") ? "right" : "left"
        );
      }
    }
  }, [message]);

  const reactionsTab = (
    <ul className="flex flex-col  gap-1 size-[200px] bg-secondary-1 rounded-lg p-1">
      {message.reactions.map((reaction: any, index: number) => (
        <li
          key={index}
          className="grid grid-cols-[auto_1fr_auto] gap-1 items-center"
        >
          {reaction.user._id === session?.user.id ? (
            <UserProfileIcon currentUser={true} size="Icon_smaller" />
          ) : (
            <UserProfileIcon
              currentUser={false}
              user={reaction.user}
              size="Icon_smaller"
            />
          )}
          <p className="text-xs font-bold text-accent">
            {reaction.user.username}
          </p>
          <div className="size-4">{renderReaction(reaction.reaction)}</div>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`flex flex-col transition-all duration-200 ease-in-out ${
        messageClass.includes("upper")
          ? "mt-4"
          : messageClass.includes("under")
          ? "mb-4"
          : messageClass.includes("rounded-2xl")
          ? "my-4"
          : ""
      } `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={`text-xs overflow-hidden text-accent/50 text-center transition-all duration-200 ease-in-out ${
          isClicked ? "max-h-10 opacity-100" : "max-h-0  opacity-0"
        }`}
      >
        {formatDateTime(message.createdAt.toDate())}
      </div>
      <div
        className={`${
          message.senderId === session?.user.id
            ? "MyMessageRow"
            : "OtherMessageRow"
        }`}
      >
        {profileRenderClasses.some(
          (className) => className === messageClass
        ) ? (
          <div className="self-end">
            {message.senderId === session?.user.id ? (
              <UserProfileIcon currentUser={true} size="Icon_message" />
            ) : (
              <UserProfileIcon
                currentUser={false}
                user={user}
                size="Icon_message"
              />
            )}
          </div>
        ) : messageClass.includes("Other_message") ? (
          <div className="Icon_message opacity-0"></div>
        ) : null}
        {isPinned && (
          <FontAwesomeIcon icon={faMapPin} className="rotate-[30deg]" />
        )}
        <div ref={messageRef} className="max-w-[60%] flex flex-col">
          <div
            className={`${messageClass} ${
              isPinned
                ? messageClass.includes("My_message")
                  ? "border-r-8 border-r-secondary-2 my-4"
                  : "border-l-8 border-l-secondary-2 my-4"
                : ""
            } `}
            onClick={() => setIsClicked((prev) => !prev)}
          >
            {message.delete ? (
              <p className="italic font-normal px-3 py-1">Message deleted</p>
            ) : (
              <>
                {message.image.length > 0 && (
                  <ul className=" flex flex-wrap overflow-hidden grow  gap-[2px]">
                    {message.image.map((url: string, index: number) => (
                      <div
                        key={index}
                        className=""
                        style={{
                          flex: "1 1 0",
                          minWidth: "30%",
                          aspectRatio: "1 / 1",
                        }}
                      >
                        <CustomImage
                          zoomable={true}
                          src={url}
                          alt="message image"
                          className="size-full"
                          width={0}
                          height={0}
                          transformation={[{ quality: 10 }]}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </ul>
                )}
                {message.text && (
                  <div className="whitespace-pre-wrap break-words px-3 py-1 ">
                    {processedMessage}
                  </div>
                )}
              </>
            )}
          </div>
          {message.reactions.length > 0 && (
            <div
              className={`rounded-full w-fit flex flex-row p-[2px] pr-2 items-center bg-secondary-1 -mt-2 ${
                messageClass.includes("My_message") ? "mr-auto" : "ml-auto"
              }`}
            >
              <PopupButton popupItem={reactionsTab}>
                {getTop3Reactions(message.reactions).map((reaction, index) => (
                  <div
                    key={index}
                    className={`size-4 -mr-1 `}
                    style={{ zIndex: 3 - index }}
                  >
                    {renderReaction(reaction)}
                  </div>
                ))}
              </PopupButton>
            </div>
          )}
        </div>
        {isHovering && (
          <>
            <ReactionButton
              style="vertical"
              drop={dropDirection}
              type={"Icon_smaller"}
              reaction={null}
              action={handleAddReaction}
            />
            <div
              className="relative flex flex-col z-auto"
              onClick={() => setIsSetting((prev) => !prev)}
              onBlur={() => setIsSetting(false)}
            >
              {isSetting && (
                <div className="absolute bottom-[110%] rounded-lg bg-secondary-2 p-1 z-50 text-sm">
                  {message.senderId === session?.user.id && (
                    <button
                      className="hover:bg-red-500/70 hover:text-white rounded-md px-1 flex flex-row gap-1 items-center w-full"
                      onClick={handleDelete}
                    >
                      <FontAwesomeIcon icon={faTrash} size="xs" />
                      Delete
                    </button>
                  )}
                  <button
                    className="hover:bg-accent/70 hover:text-primary rounded-md px-1 flex flex-row gap-1 items-center w-full"
                    onClick={handlePin}
                  >
                    <FontAwesomeIcon icon={faMapPin} size="xs" />
                    Pin
                  </button>
                </div>
              )}
              <div className="Icon_smaller">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
