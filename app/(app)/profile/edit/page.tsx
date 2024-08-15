"use client";
import InputBox from "@components/InputBox";
import SubmitButton from "@components/SubmitButton";
import { faCheck, faL, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "@lib/types";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { type SubmitButtonState } from "@lib/types";

export default function EditPage() {
  const router = useRouter()
  const [submitState,setSubmitState] = useState<SubmitButtonState>('')
  const { data: session ,update} = useSession();
  const imageInput = useRef<HTMLInputElement>(null);
  const [imageInputVisibility, setImageInputVisibility] =
    useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<User>({
    _id: session?.user.id || "",
    username: session?.user.name || "",
    image: session?.user.image || "",
    bio: session?.user.bio || "",
  });

  useEffect(() => {
    if (session?.user) {
      setUpdateInfo({
        _id: session.user.id || "",
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
      const response = await fetch(`/api/users/${updateInfo._id}`,{
        method:'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(updateInfo)
      })
      if(response.ok) {
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

  const handleImageChange = () => {
    setUpdateInfo((u) => ({
      ...u,
      image: imageInput.current ? imageInput.current.value : "",
    }));
    setImageInputVisibility(false);
  };

  const handleInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUpdateInfo((c) => ({ ...c, [name]: value }));
  };

  const handleImageError = () => {
    setUpdateInfo((u) => ({ ...u, image: "" }));
  };
  return (
    <section className="flex grow items-center justify-center text-accent">
      <form onSubmit={handleUpdate} className="w-96 h-fit flex flex-col gap-4 rounded-xl shadow-lg p-5 bg-secondary-1">
        <div className="my-4 flex flex-col items-center gap-4">
          <div
            className="size-28 bg-secondary-2 rounded-full relative overflow-hidden border-black border-2 text-7xl"
            onClick={() => {
              setImageInputVisibility(true);
            }}
          >
            {updateInfo?.image ? (
              <img
                src={updateInfo.image}
                alt="sign up image"
                style={{ objectFit: "cover" }}
                onError={handleImageError}
                className="size-full"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                size="xl"
                className="size-full mt-2"
              />
            )}
          </div>
          {imageInputVisibility && (
            <div className="Input_box_variant_1">
              <input
                ref={imageInput}
                name="image"
                placeholder="Image URL..."
                className="pl-2 outline-none bg-transparent placeholder:text-inherit"
              />{" "}
              <div className="p-1" onClick={handleImageChange}>
                <FontAwesomeIcon icon={faCheck} />
              </div>
            </div>
          )}
          <h1 className="text-medium">
            {updateInfo.image ? "Looking good there" : "Add Profile picture"}
          </h1>
        </div>
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
