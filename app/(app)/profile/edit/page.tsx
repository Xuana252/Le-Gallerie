"use client";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import { faCheck, faL, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadUser, User } from "@lib/types";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { type SubmitButtonState } from "@lib/types";
import { updateUser } from "@server/accountActions";
import ImageInput from "@components/Input/ImageInput";
import {uploadImage, removeImage, updateImage } from "@lib/upload";


export default function EditPage() {
  const router = useRouter()
  const [submitState,setSubmitState] = useState<SubmitButtonState>('')
  const { data: session ,update} = useSession();
  const [imageToUpdate,setUpdateImage] = useState<string>(session?.user.image||'')
  const [updateInfo, setUpdateInfo] = useState<UploadUser>({
    _id:session?.user.id||'',
    username:session?.user.name|| '',
    image: {
      file:null,
      url:session?.user.image|| '',
    },
    bio:session?.user.bio ||'',
  });

  useEffect(() => {
    if (session?.user) {
      setUpdateInfo({
        _id:session?.user.id||'',
        username: session.user.name || "",
        image:{
          file:null,
          url: session.user.image || ""},
        bio: session.user.bio || "",
      });
      setUpdateImage(session.user.image || "")
    }
  }, [session]);


  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitState('Processing')
      let imageUrl = ''
      if(updateInfo.image?.url) {
        if(updateInfo.image?.file) {
          if(imageToUpdate) {
            imageUrl = await updateImage(updateInfo.image.file,imageToUpdate)
          } else {
            imageUrl = await uploadImage(updateInfo.image.file)
          }
        } else {
          imageUrl = updateInfo.image.url
        }
      } else {
        if(imageToUpdate) {
          imageUrl ='' 
          await removeImage(imageToUpdate)
        } else {
          imageUrl=''
        }
      }
        
      const userToUpdate:User = {
        _id:session?.user.id||'',
        username: updateInfo.username,
        image:imageUrl,
        bio: updateInfo.bio,
      }
      const response = await updateUser(userToUpdate)
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

  const handleImageChange = (image:{file:File|null,url:string}) => {
    setUpdateInfo((u) => ({
      ...u,
      image,
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
        <ImageInput type='ProfileImage' image={updateInfo.image?.url||''} setImage={handleImageChange}/>
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
