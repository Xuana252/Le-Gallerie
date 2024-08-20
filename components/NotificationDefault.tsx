'use client'
import { useState, useRef } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import { useSession } from "next-auth/react";

export default function NotificationFeed(){
    const {data:session} = useSession()
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  if(!session) return

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY as string}
      userId={session.user.id||''}
    >
      <KnockFeedProvider feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID as string}>
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={(e) => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};