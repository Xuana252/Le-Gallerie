import InputBox from "@components/Input/InputBox";
import { confirm, toastMessage } from "@components/Notification/Toaster";
import ImageGroupDisplay from "@components/UI/Image/ImageGroupDisplay";
import { ChatContext } from "@components/UI/Layout/Nav";
import { sendMessage } from "@lib/Chat/chat";
import { Post, User } from "@lib/types";
import {
  faFacebook,
  faFacebookMessenger,
  faInstagram,
  faTwitter,
} from "@node_modules/@fortawesome/free-brands-svg-icons";
import {
  faLink,
  faListDots,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import React, { useContext, useRef, useState } from "react";

export default function SharePostForm({ post }: { post: Post }) {
  const { chatList } = useContext(ChatContext);
  const url = `${window.location.origin}/post/${post._id}`;

  const [filterText, setFilterText] = useState("");

  const handleShareToChat = async (chatId: string) => {
    const result = await confirm(
      "Do you want to share this post to this chat?"
    );
    if (!result) return;

    sendMessage(url, [], chatId);
  };

  const handleCopyLink = () => {
    if (!post._id) return;

    navigator.clipboard.writeText(url).then(() => {
      toastMessage("Link copied to clipboard!");
    });
  };

  const handleShareToFacebook = () => {
    if (!post._id) return;

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookShareUrl, "_blank");
  };

  const handleShareToTwitter = () => {
    if (!post._id) return;

    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      "Check out this photo!"
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterShareUrl, "_blank");
  };

  const handleShareToEmail = () => {
    if (!post._id) return;

    const subject = `Check out this post: ${post.title}`;
    const body = `Hey! I wanted to share this post with you: ${url}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.open(mailtoLink, "_blank");
  };

  const handleShareToMessenger = () => {
    if (!post._id) return;

    const messengerShareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      url
    )}&app_id=1715168069356791&redirect_uri=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(messengerShareUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareToTelegram = () => {
    if (!post._id) return;

    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(post.title)}`;
    window.open(telegramShareUrl, "_blank");
  };

  const handleShare = () => {
    if (!post._id) return;
    if (navigator.share) {
      // Use the Web Share API if available
      navigator
        .share({
          title: post.title,
          text: "check out this photo",
          url: url,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      toastMessage("Web Share API not supported in this browser.");
    }
  };
  return (
    <div className="flex flex-col gap-2  max-w-[300px] sm:max-w-[400px] ">
      <div>Share</div>
      <ul className="p-2 bg-primary/50 flex flex-row gap-4 items-end justify-around w-full overflow-x-auto ">
        <li className="cursor-pointer flex flex-col gap-1 items-center ">
          <div
            className="Icon_small bg-secondary-1"
            onClick={handleCopyLink}
            title="copy link"
          >
            <FontAwesomeIcon icon={faLink} />
          </div>
          <div className="text-xs opacity-50">Link</div>
        </li>

        <li className="cursor-pointer flex flex-col gap-1 items-center ">
          <img
            className="min-w-9 w-9 "
            src="/providers/facebook.png"
            alt="facebook"
            onClick={handleShareToFacebook}
            title="share to Facebook"
          />
          <div className="text-xs opacity-50">Facebook</div>
        </li>

        <li className="cursor-pointer flex flex-col gap-1 items-center ">
          <img
            className="min-w-9 w-9 "
            src="/providers/messenger.png"
            alt="facebook"
            onClick={handleShareToMessenger}
            title="share to Messenger"
          />
          <div className="text-xs opacity-50">Messenger</div>
        </li>

        <li className="cursor-pointer flex flex-col gap-1 items-center ">
          <img
            className="min-w-9 w-9 "
            src="/providers/gmail.png"
            alt="messenger"
            onClick={handleShareToEmail}
            title="share to Email"
          />
          <div className="text-xs opacity-50">Email</div>
        </li>

        <li className="cursor-pointer flex flex-col gap-1 items-center ">
          <img
            className="min-w-9 w-9 "
            src="/providers/x.png"
            alt="x"
            onClick={handleShareToTwitter}
            title="share to X"
          />
          <div className="text-xs opacity-50">X</div>
        </li>

        <li className="cursor-pointer flex flex-col gap-1 items-center ">
          <img
            className="min-w-9 w-9 "
            src="/providers/telegram.png"
            alt="x"
            onClick={handleShareToTelegram}
            title="share to Telegram"
          />
          <div className="text-xs opacity-50">Telegram</div>
        </li>

        <li className="cursor-pointer flex flex-col gap-1 items-center ">
          <div
            className="Icon_small bg-secondary-1"
            onClick={handleShare}
            title="Others"
          >
            <FontAwesomeIcon icon={faListDots} />
          </div>
          <div className="text-xs opacity-50">Others</div>
        </li>
      </ul>

      <div>Or</div>
      <div className="bg-primary/50 p-2 flex flex-col gap-2 rounded-lg">
        <InputBox
          type="SearchBox"
          value={filterText}
          onTextChange={(t) => setFilterText(t.target.value)}
        />
        <ul className="w-full flex flex-row gap-4  overflow-x-auto">
          {[...chatList, ...chatList, ...chatList]?.map((chat, index) =>
            (chat.type === "group" &&
              chat.name.toLowerCase().includes(filterText.toLowerCase())) ||
            (chat.type === "single" &&
              chat.users[0].username
                .toLowerCase()
                .includes(filterText.toLowerCase())) ? (
              <li
                key={index}
                className="flex flex-col gap-1 items-center cursor-pointer hover:bg-primary p-1"
                onClick={() => handleShareToChat(chat.chatId)}
              >
                <div className={`size-10`}>
                  <ImageGroupDisplay
                    images={
                      chat.type === "group"
                        ? chat.image
                          ? [chat.image]
                          : chat.users
                              .filter(
                                (user: User) =>
                                  chat.memberIds.findIndex(
                                    (id: string) => id === user._id
                                  ) !== -1
                              )
                              .map((u: User) => u.image)
                        : [chat.users[0].image]
                    }
                  />
                </div>
                <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">
                  {chat.type === "group" ? chat.name : chat.users[0].username}
                </span>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
}
