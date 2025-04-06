"use client";
import Feed from "@components/UI/Layout/Feed";
import MultiTabContainer from "@components/UI/Layout/MultiTabContainer";
import UsersTab from "@components/UI/Layout/UsersTab";
import {
  faBorderAll,
  faHeart,
  faImage,
  faPortrait,
  faUserGroup,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

export default function Search() {
  return (
    <MultiTabContainer
      tabs={[
        {
          head: (
            <>
              <FontAwesomeIcon icon={faImage} /> Posts
            </>
          ),
          body: (
            <Feed searchFeed={true} showResults={true} showCateBar={true} />
          ),
        },
        {
          head: (
            <>
              <FontAwesomeIcon icon={faPortrait} /> Users
            </>
          ),
          body: (<UsersTab />),
        },
      ]}
    />
  );
}
