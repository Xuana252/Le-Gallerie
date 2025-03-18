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
  faEye,
  faTrash,
  faUser,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatTimeAgo } from "@lib/dateFormat";
import CustomImage from "@components/UI/Image";
import NotificationList from "./NotificationList";



export default function NotificationButton({
  returnUnseenCount,
}: {
  returnUnseenCount: Dispatch<SetStateAction<number>>;
}) {
  const { data: session } = useSession();

  if (!session) return;

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY as string}
      userId={session.user.id || ""}
    >
      <NotificationList returnUnseenCount={returnUnseenCount} />
    </KnockProvider>
  );
}
