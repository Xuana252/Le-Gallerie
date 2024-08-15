'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Feed from "@components/Feed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { User } from "@lib/types";


export default function UserProfile({params}:{params:{id:string}}) {
  const [user,setUser] = useState<User>(()=>{
    const storeUser = localStorage.getItem("user");
    return storeUser ? JSON.parse(storeUser) : null;
  })

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}`)
      const data = await response.json()
      if(JSON.stringify(data)!==JSON.stringify(user))
        setUser(data)
    } catch (error) {
      console.log('Failed to fetch for user info')
    }
  }
  useEffect(()=>{
    fetchUser()
  },[params.id])


  return (
    <section className="text-accent">
      <div className="User_Profile_Layout">
        <div className=" User_Profile_Page_Picture">
          {user?.image ? (
            <Image
              src={user.image}
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
          <h1 className="User_Profile_Page_Username">{user?.username}</h1>
          <br />
          <h2 className="User_Profile_Page_Bio">{user?.bio}</h2>
        </div>
      </div>
      <br />
      <h1 className="text-center text-xl ">See {user.username}'s posts</h1>
      <br />
      <Feed userIdFilter={user?._id}></Feed>
    </section>
  );
}
