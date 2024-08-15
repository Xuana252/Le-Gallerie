"use client";
import React, { useState } from "react";
import Image from "next/image";
import Feed from "@components/Feed";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MyProfile() {
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <section className="text-accent">
      <div className="User_Profile_Layout">
        <div className="relative">
          <div className="User_Profile_Page_Picture ">
            {session?.user?.image ? (
              <Image
                src={session?.user.image}
                alt={"profile picture"}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <FontAwesomeIcon icon={faUser} size="xl" className="size-full" />
            )}
          </div>
          <Link href={"/profile/edit"}>
            <button className="Icon_small absolute right-1 bottom-1 bg-secondary-1">
              <FontAwesomeIcon icon={faPen} />
            </button>
          </Link>
        </div>
        <div>
          <h1 className="User_Profile_Page_Username">
            {session?.user?.name}
          </h1>
          <br />
          <h2 className="User_Profile_Page_Bio">
            {session?.user.bio}
          </h2>
        </div>
      </div>
      <br />
      <h1 className="text-center text-xl ">See your posts</h1>
      <br />
      <Feed userIdFilter={session?.user.id}></Feed>
    </section>
  );
}
