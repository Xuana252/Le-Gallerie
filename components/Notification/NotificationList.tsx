"use client";

import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
  useKnockClient,
  useNotifications,
  useNotificationStore,
} from "@knocklabs/react";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import { useSession } from "next-auth/react";
import DropDownButton from "../Input/DropDownButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faClose,
  faEye,
  faTrash,
  faUser,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatTimeAgo } from "@lib/dateFormat";
import CustomImage from "@components/UI/Image";

export default function NotificationList({
  returnUnseenCount,
}: {
  returnUnseenCount: Dispatch<SetStateAction<number>>;
}) {
  const knockClient = useKnockClient();
  const feedClient = useNotifications(
    knockClient,
    process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID as string
  );
  const { items, metadata } = useNotificationStore(feedClient);
  const router = useRouter();
  const [notificationView, setNotificationView] = useState<string>("All");
  const [draggingItem, setDraggingIndex] = useState<any>(null);
  const [x, setX] = useState(0);
  const [dragOffSet, setDragOffSet] = useState(0);
  const dragList = useRef<HTMLUListElement>(null);

  const onMouseDown = (e: React.MouseEvent<HTMLLIElement>, item: any) => {
    setDragOffSet(e.clientX);
    setDraggingIndex(item);
    setX(0);
  };

  const onMouseUp = (e: MouseEvent) => {
    if (dragList.current) {
      const rect = dragList.current.getBoundingClientRect();
      if (Math.abs(dragOffSet - e.clientX) > rect.width)
        feedClient.markAsArchived(draggingItem);
    }
    setDraggingIndex(null);
    setDragOffSet(0);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (draggingItem === null || !dragList.current) return;
    const newPositionX = e.clientX - dragOffSet;
    setX(newPositionX);

    // if (itemIndex >= 0 && itemIndex < items.length && itemIndex !== draggingIndex) {
    //   feedClient.markAsArchived(finalList[draggingIndex])
    //   setDraggingIndex(null);
    // }
  };
  useEffect(() => {
    if (draggingItem !== null) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [draggingItem]);

  const playNotificationSound = () => {
    const audio = new Audio("/audios/notiPopSound.mp3");
    audio.volume = 0.3;
    audio
      .play()
      .catch((error) =>
        console.error("Failed to play notification sound:", error)
      );
  };

  const getNotificationList = () => {
    switch (notificationView) {
      case "All":
        return items;
      case "Unread":
        return items.filter((item) => !item.read_at);
      default:
        return items;
    }
  };

  const finalList = getNotificationList().slice(0, 20);

  const onNotificationsReceived = ({ items }: { items: any }) => {
    feedClient.markAsSeen(items);
    playNotificationSound();

    items.forEach((item: any) => {
      toast.custom((t) => (
        <div className="Toast_item">
          {item ? (
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 w-full">
              <div className="Icon_small bg-secondary-2 select-none pointer-events-none">
                {item.actors[0].avatar ? (
                  <CustomImage
                    src={item.actors[0].avatar}
                    alt="profile picture"
                    className="size-full"
                    width={0}
                    height={0}
                    transformation={[{ quality: 10 }]}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="m-0" />
                )}
              </div>
              <div className="flex flex-col text-sm w-full">
                <p>
                  <b className="whitespace-normal break-all">
                    {item.actors[0].name}
                  </b>{" "}
                  {item.blocks[0].content}
                </p>
                <p className="text-xs text-secondary-1">
                  {formatTimeAgo(item.inserted_at)}
                </p>
              </div>
              <button
                onClick={() => {
                  toast.dismiss(t);
                }}
              >
                <FontAwesomeIcon
                  icon={faClose}
                  className="rounded-full size-3 p-1 hover:bg-primary hover:text-accent"
                />
              </button>
            </div>
          ) : (
            "you have 1 notification"
          )}
        </div>
      ));
    });
  };

  useEffect(() => {
    returnUnseenCount(metadata.unseen_count);
  }, [metadata.unseen_count]);

  useEffect(() => {
    feedClient.fetch();
    feedClient.on("items.received.realtime", onNotificationsReceived);
    return () => {
      feedClient.off("items.received.realtime", onNotificationsReceived);
    };
  }, [feedClient]);

  const handleNotificationItemInteraction = (
    e: React.MouseEvent<HTMLLIElement>,
    item: any
  ) => {
    e.preventDefault();
    if (e.clientX !== dragOffSet) return;
    feedClient.markAsRead(item);
    switch (item.source.key) {
      case "post-like":
        router.push(`/post/${item.data.postId}`);
        break;
      case "user-follow":
        router.push(`/profile/${item.data.userId}`);
        break;
      case "comment-like":
        router.push(
          `/post/${item.data.postId}?commentId=${item.data.commentId}`
        );
        break;
      case "comment-reply":
        router.push(
          `/post/${item.data.postId}?parentId=${item.data.parentId}&replyId=${item.data.replyId}`
        );
        break;
      case "post-comment":
        router.push(
          `/post/${item.data.postId}?commentId=${item.data.commentId}`
        );
        break;
      default:
        return;
    }
  };
  const handleToggleNotificationList = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement; // Type assertion
    setNotificationView(target.name);
  };

  const notificationList = (
    <div>
      <h1 className="font-bold text-xl">Notification</h1>
      <div className="grid grid-cols-3 text-xs">
        <button
          name="All"
          onClick={handleToggleNotificationList}
          className={`font-bold ${
            notificationView === "All" && "Notification_view_toggle_button"
          }`}
        >
          All
        </button>
        <button
          name="FriendRequest"
          onClick={handleToggleNotificationList}
          className={`font-bold ${
            notificationView === "FriendRequest" && "Notification_view_toggle_button "
          }`}
        >
          <div className="flex items-center justify-center gap-2 pointer-events-none">
            <div
              className={`${
                metadata.unread_count > 0 ? "" : "hidden"
              } flex items-center justify-center rounded-full size-4 bg-accent text-primary text-xs font-bold `}
            >
              {metadata.unread_count}
            </div>
            Friend Request
          </div>
        </button>
        <button
          name="Unread"
          onClick={handleToggleNotificationList}
          className={`font-bold ${
            notificationView === "Unread" && "Notification_view_toggle_button "
          }`}
        >
          <div className="flex items-center justify-center gap-2 pointer-events-none">
            <div
              className={`${
                metadata.unread_count > 0 ? "" : "hidden"
              } flex items-center justify-center rounded-full size-4 bg-accent text-primary text-xs font-bold `}
            >
              {metadata.unread_count}
            </div>
            Unread
          </div>
        </button>
      </div>
      <ul ref={dragList} className="Notification_list">
        <div className="sticky top-0 z-10 h-fit">
          <div className="flex flex-row backdrop-blur-sm bg-secondary-2 py-1 justify-end gap-2">
            <button
              className="Icon_smaller"
              onClick={() => {
                feedClient.markAsRead(finalList);
              }}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button
              className="Icon_smaller"
              onClick={() => {
                feedClient.markAsArchived(finalList);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          <hr className="border-0 bg-secondary-1 h-1" />
        </div>
        {finalList.length > 0 &&
          finalList.map((item: any, index) => (
            <li
              key={index}
              onMouseDown={(e) => onMouseDown(e, item)}
              onMouseUp={(e) => handleNotificationItemInteraction(e, item)}
              className={`relative ${
                dragOffSet > 0 ? "" : "transition-all duration-300 ease-in-out"
              }`}
              style={{
                left: draggingItem && draggingItem.id === item.id ? x : 0,
              }}
            >
              {item.actors[0] ? (
                <div className="Notification_item">
                  {item.actors[0].avatar ? (
                    <div className="Icon_small">
                      <CustomImage
                        src={item.actors[0].avatar}
                        alt="profile picture"
                        className="size-full"
                        width={0}
                        height={0}
                        transformation={[{ quality: 10 }]}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div className="Icon_small bg-secondary-2 pointer-events-none">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                  <div className="flex flex-col text-sm w-[70%]">
                    <p>
                      <b className="break-all whitespace-normal">
                        {item.actors[0].name}
                      </b>{" "}
                      {item.blocks[0].content}
                    </p>
                    <p className="text-xs text-secondary-1">
                      {formatTimeAgo(item.inserted_at)}
                    </p>
                  </div>
                  <div className="w-7 h-[100%] ml-auto flex items-center justify-center">
                    {item.read_at ? null : (
                      <div className="size-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
              ) : null}
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <DropDownButton dropDownList={notificationList} Zindex={40}>
      <div className="relative Icon" onClick={() => feedClient.markAllAsSeen()}>
        <div
          className={`${
            metadata.unseen_count > 0 ? "" : "hidden"
          } absolute top-1 right-1 rounded-full size-4 bg-primary text-accent text-xs font-bold `}
        >
          {metadata.unseen_count}
        </div>
        <FontAwesomeIcon icon={faBell} />
      </div>
    </DropDownButton>
  );
}
