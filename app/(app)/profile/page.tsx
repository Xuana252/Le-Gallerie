import React from "react";
import Image from "next/image";
import Feed from "@components/Feed";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";

export default async function MyProfile() {
  const session = await getServerSession(options);

  if (!session?.user) {
    redirect("/sign-in");
  }

  console.log(session);

  return (
    <section>
      <div className="flex size-fit gap-5 p-5 items-center">
        <div className=" flex rounded-full size-48 overflow-hidden relative border-black border-2 text-9xl pt-2">
          {session?.user?.image ? (
            <Image
              src={session?.user.image}
              alt={"profile picture"}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              size="xl"
              className="size-full"
            />
          )}
        </div>
        <div>
          <h1 className="text-4xl">{session?.user?.name}</h1>
          <br />
          <h2 className="text-xl">{session?.user?.email}</h2>
        </div>
      </div>
      <br />
      <h1 className="text-center text-xl ">See your posts</h1>
      <br />
      <Feed></Feed>
    </section>
  );
}
