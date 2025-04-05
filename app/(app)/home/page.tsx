"use client";
import Feed from "@components/UI/Layout/Feed";
import MultiTabContainer from "@components/UI/Layout/MultiTabContainer";

import UsersBar from "@components/UI/Layout/UsersTab";
import { faHeart } from "@node_modules/@fortawesome/free-regular-svg-icons";
import {
  faBorderAll,
  faSignsPost,
  faUserGroup,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import { useState, useRef, useEffect, useMemo } from "react";

export default function Home() {
  const { data: session } = useSession();


  return (
    <MultiTabContainer
      tabs={[
        {
          head: (
            <>

              <FontAwesomeIcon icon={faSignsPost} />
              Explore
            </>
          ),
          body: <Feed></Feed>,
        },
        ...(session?.user?.id
          ? [
              {
                head: (
                  <>
                    <FontAwesomeIcon icon={faHeart} />
                    Follows
                  </>
                ),
                body: (
                  <Feed
                    userIdFollowFilter={true}
                    userIdFilter={session.user.id}
                    showCateBar={false}
                  />
                ),
              },
              {
                head: (
                  <>
                    <FontAwesomeIcon icon={faUserGroup} />
                    Friends
                  </>
                ),
                body: (
                  <Feed
                    userIdFriendFilter={true}
                    userIdFilter={session.user.id}
                    showCateBar={false}
                  />
                ),
              },
            ]
          : []),
      ]}
    />
  );
}
