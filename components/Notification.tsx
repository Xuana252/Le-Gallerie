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
import DropDownButton from "./Input/DropDownButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Span } from "next/dist/trace";
import { useRouter } from "next/navigation";
import UserProfileIcon from "./UI/UserProfileIcon";
import { Actor } from "@knocklabs/node";

export function NotificationList() {
  const knockClient = useKnockClient();
  const feedClient = useNotifications(
    knockClient,
    process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID as string
  );
  const { items, metadata } = useNotificationStore(feedClient);
  const router = useRouter();
  const [notificationView, setNotificationView] = useState<string>("Unread");
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    const interval = Math.floor(seconds / 60);

    if (interval < 1) return `${seconds<0?0:seconds} seconds ago`;
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
  const finalList = getNotificationList().slice(0, 20);;
  useEffect(() => {
    feedClient.fetch();
  }, [feedClient]);
  const handleNotificationItemClick = (
    e: React.MouseEvent<HTMLLIElement>,
    item: any
  ) => {
    e.preventDefault();
    console.log(item);
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
    <>
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
            notificationView === "Unread" && "Notification_view_toggle_button"
          }`}
        >
          Unread
        </button>
      </div>
      <ul className="Notification_list">
        {finalList.length > 0 &&
          finalList.map((item: any) => (
            <li
              key={item.id}
              onClick={(e) => handleNotificationItemClick(e, item)}
            >
              {item.actors[0]?<div className="Notification_item">
               <img
                  src={item.actors[0].avatar}
                  alt="profile picture"
                  className="Icon_small"
                />
                <div className="flex flex-col text-sm">
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
              </div>:null}
            </li>
          ))}
      </ul>
    </>
  );

  return (
      <DropDownButton dropDownList={notificationList} Zindex={40}>
        <div className="relative">
          <div
            className={`${
              metadata.unseen_count > 0 ? "" : "hidden"
            } absolute top-0 right-0 rounded-full size-4 bg-primary text-accent text-xs font-bold `}
          >
            {metadata.unseen_count}
          </div>
          <FontAwesomeIcon icon={faBell}  onClick={()=>feedClient.markAllAsSeen()}/>
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
