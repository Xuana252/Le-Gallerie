'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Feed from "@components/UI/Feed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faUser } from "@fortawesome/free-solid-svg-icons";
import { User } from "@lib/types";
import { fetchUserWithId } from "@server/accountActions";
import { arrayUnion, collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@lib/firebase";
import { useSession } from "next-auth/react";


export default function UserProfile({params}:{params:{id:string}}) {
  const {data:session} = useSession()
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

  const startChat = async () => {
    if(!session) return
    const chatRef = collection(db,'chat')
    const usersChatRef = collection(db,'usersChat')

    try {
      const newChatRef = doc(chatRef)
      await setDoc(newChatRef,{
        createAt: serverTimestamp(),
        message: [],
      })

      await updateDoc(doc(usersChatRef,params.id),{
        chat:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:'',
          receiverId:session.user.id,
          updatedAt: Date.now(),

        })
      })
      await updateDoc(doc(usersChatRef,session.user.id),{
        chat:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:'',
          receiverId: params.id,
          updatedAt: Date.now(),
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="text-accent">
      <div className="User_Profile_Layout">
        <div className=" User_Profile_Page_Picture">
          {user.image ? (
           <Image
           src={user.image}
           alt={"profile picture"}
           fill
           sizes={'0'}
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
          <div className="flex">
            <h1 className="User_Profile_Page_Username">{user.username}</h1>
            <button className="Icon" onClick={startChat}>
              <FontAwesomeIcon icon={faComment}/>
            </button>
          </div>
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
