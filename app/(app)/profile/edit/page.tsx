"use client";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import { faCheck, faL, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "@lib/types";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { type SubmitButtonState } from "@lib/types";
import { updateUser } from "@server/accountActions";
import ImageInput from "@components/Input/ImageInput";

export default function EditPage() {
  const router = useRouter()
  const [submitState,setSubmitState] = useState<SubmitButtonState>('')
  const { data: session ,update} = useSession();
  const [updateInfo, setUpdateInfo] = useState({
    _id:session?.user.id||'',
    username:session?.user.name|| '',
    image:session?.user.image|| '',
    bio:session?.user.bio ||'',
  });

  useEffect(() => {
    if (session?.user) {
      setUpdateInfo({
        _id:session?.user.id||'',
        username: session.user.name || "",
        image: session.user.image || "",
        bio: session.user.bio || "",
      });
    }
  }, [session]);


  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitState('Processing')
      const response = await updateUser(updateInfo)
      if(response) {
        const newSession = await getSession()
        await update(newSession)
        console.log('User updated')
        setSubmitState('Succeeded')
        setTimeout(()=>router.push('/profile'),1000)
      } else {
        setSubmitState('Failed')
        console.log('Failed to update user')
      } 
    } catch (error) {
      setSubmitState('Failed')
      console.log("Error while updating user",error)
    } 
  };

  const handleImageChange = (image:string) => {
    setUpdateInfo((u) => ({
      ...u,
      image: image,
    }));
  };

  const handleInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUpdateInfo((c) => ({ ...c, [name]: value }));
  };

  return (
    <section className="flex grow items-center justify-center text-accent">
      <form onSubmit={handleUpdate} className="w-96 h-fit flex flex-col gap-4 rounded-xl shadow-lg p-5 bg-secondary-1">
        <ImageInput type='ProfileImage' image={updateInfo.image} setImage={handleImageChange}/>
        <InputBox type='Input' name='username' onTextChange={handleInfoChange} value={updateInfo.username}>Username</InputBox>
        <InputBox type='Input' name='bio' onTextChange={handleInfoChange} value={updateInfo.bio}>Bio</InputBox>

        <div className="flex justify-end gap-3 mt-auto">
            <Link href={'/profile'}>
              <button className="Button_variant_2">
                Cancel
              </button>
            </Link>
            <SubmitButton state={submitState} changeState={setSubmitState} >Update</SubmitButton>
          </div>
      </form>
    </section>
  );
}
