"use client";
import React, { useState, useRef, useEffect } from "react";
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
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function NotificationList() {
  const knockClient = useKnockClient();
  const feedClient = useNotifications(
    knockClient,
    process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID as string
  );
  const { items, metadata } = useNotificationStore(feedClient);
  const router = useRouter();
  const [notificationView, setNotificationView] = useState<string>("Unread");
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

  
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    const interval = Math.floor(seconds / 60);

    if (interval < 1) return `${seconds < 0 ? 0 : seconds} seconds ago`;
    if (interval < 60) return `${interval} minutes ago`;
    if (interval < 1440) return `${Math.floor(interval / 60)} hours ago`;
    if (interval < 2880) return `yesterday`;
    return `${Math.floor(interval / 1440)} days ago`;
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
    const audio = document.createElement("audio");
    audio.src = "/audios/notiPopSound.mp3";
    audio.volume = 0.3;
    audio.preload = "auto";

    // Append the audio element to the body
    document.body.appendChild(audio);

    // Play the sound
    audio.play();

    // Remove the audio element after it ends
    audio.addEventListener("ended", () => {
      document.body.removeChild(audio);
    });

    items.forEach((item: any) => {
      feedClient.markAsSeen(item);
      toast.custom((t) => (
        <div className="Toast_item">
          {item ? (
            <>
               {item.actors[0].avatar?<img
                    src={item.actors[0].avatar}
                    alt="profile picture"
                    className="Icon_small select-none pointer-events-none"
                  />:<div className="Icon_small bg-secondary-2 pointer-events-none">
                    <FontAwesomeIcon icon={faUser} />
                  </div>}
              <div className="flex flex-col text-sm grow">
                <p>
                  <b>{item.actors[0].name}</b> {item.blocks[0].content}
                </p>
                <p className="text-xs text-secondary-1">
                  {formatTimeAgo(item.inserted_at)}
                </p>
              </div>
            </>
          ) : (
            "you have 1 notification"
          )}
        </div>
      ));
    });
  };
  

  useEffect(() => {
    feedClient.fetch();
    feedClient.on('items.received.realtime', onNotificationsReceived);
    return () =>
      feedClient.off("items.received.realtime", onNotificationsReceived);
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
      <div className="grid grid-cols-2">
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
                  {item.actors[0].avatar?<img
                    src={item.actors[0].avatar}
                    alt="profile picture"
                    className="Icon_small select-none pointer-events-none"
                  />:<div className="Icon_small bg-secondary-2 pointer-events-none">
                    <FontAwesomeIcon icon={faUser} />
                  </div>}
                  <div className="flex flex-col text-sm grow">
                    <p>
                      <b>{item.actors[0].name}</b> {item.blocks[0].content}
                    </p>
                    <p className="text-xs text-secondary-1">
                      {formatTimeAgo(item.inserted_at)}
                    </p>
                  </div>
                  <div className="w-7 h-[100%] flex items-center justify-center">
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

export default function NotificationButton() {
  const { data: session } = useSession();

  if (!session) return;

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY as string}
      userId={session.user.id || ""}
    >
      <NotificationList />
    </KnockProvider>
  );
}
