'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Feed from "@components/UI/Feed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { User } from "@lib/types";
import { fetchUserWithId } from "@server/accountActions";


export default function UserProfile({params}:{params:{id:string}}) {
  const [user,setUser] = useState<User>({
    _id:'',
    username:'unknown',
    image:'',
    bio:'',
  })

  const fetchUser = async () => {
    try {
      const data = await fetchUserWithId(params.id)
      if(JSON.stringify(data)!==JSON.stringify(user))
        setUser(data)
    } catch (error) {
      console.log('Failed to fetch for user info')
    }
  }
  useEffect(()=>{
    const storeUser = localStorage.getItem("user");
    if(storeUser) {
      const user = JSON.parse(storeUser)
      setUser(user)
    }
    fetchUser()
  },[params.id])


  return (
    <section className="text-accent">
      <div className="User_Profile_Layout">
        <div className=" User_Profile_Page_Picture">
          {user.image ? (
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
          <h1 className="User_Profile_Page_Username">{user.username}</h1>
          <br />
          <h2 className="User_Profile_Page_Bio">{user.bio}</h2>
        </div>
      </div>
      <br />
      <h1 className="text-center text-xl ">See {user.username}'s posts</h1>
      <br />
      <Feed userIdFilter={user._id}></Feed>
    </section>
  );
}
