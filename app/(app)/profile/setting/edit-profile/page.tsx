"use client";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import {
  faCheck,
  faHammer,
  faL,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadImage, UploadUser, User } from "@lib/types";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { updateUser } from "@actions/accountActions";
import ImageInput from "@components/Input/ImageInput";
import { uploadImage, removeImage, updateImage } from "@lib/upload";
import CustomImage from "@components/UI/Image/Image";
import DateTimePicker from "@components/Input/DateTimePicker";
import toastError from "@components/Notification/Toaster";
import { SubmitButtonState } from "@enum/submitButtonState";
import TextAreaInput from "@components/Input/TextAreaInput";
import { UserRole } from "@enum/userRolesEnum";

export default function EditPage() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitButtonState>(
    SubmitButtonState.IDLE
  );
  const { data: session, update } = useSession();
  const [imageToUpdate, setUpdateImage] = useState<string>(
    session?.user.image || ""
  );
  const [updateInfo, setUpdateInfo] = useState<UploadUser>({
    _id: session?.user.id || "",
    username: session?.user.name || "",
    fullname: session?.user.fullname || "",
    birthdate: session?.user.birthdate || "",
    image: {
      file: null,
      url: session?.user.image || "",
    },
    bio: session?.user.bio || "",
  });

  useEffect(() => {
    if (session?.user) {
      setUpdateInfo({
        _id: session?.user.id || "",
        username: session.user.name || "",
        fullname: session.user.fullname || "",
        birthdate: session?.user.birthdate || "",
        image: {
          file: null,
          url: session.user.image || "",
        },
        bio: session.user.bio || "",
      });
      setUpdateImage(session.user.image || "");
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updateInfo.username?.trim() === "") {
      toastError("username must not be empty");
      return;
    }
    try {
      setSubmitState(SubmitButtonState.PROCESSING);
      let imageUrl = "";
      if (updateInfo.image?.url) {
        if (updateInfo.image?.file) {
          if (imageToUpdate) {
            imageUrl = await updateImage(updateInfo.image.file, imageToUpdate);
          } else {
            imageUrl = await uploadImage(updateInfo.image.file);
          }
        } else {
          imageUrl = updateInfo.image.url;
        }
      } else {
        if (imageToUpdate) {
          imageUrl = "";
          await removeImage(imageToUpdate);
        } else {
          imageUrl = "";
        }
      }

      const userToUpdate: User = {
        _id: session?.user.id || "",
        username: updateInfo.username,
        fullname: updateInfo.fullname,
        birthdate: updateInfo.birthdate,
        image: imageUrl,
        bio: updateInfo.bio,
      };
      const response = await updateUser(userToUpdate);
      if (response) {
        const newSession = await getSession();
        await update(newSession);
        console.log("User updated");
        setSubmitState(SubmitButtonState.SUCCESS);
        setTimeout(() => router.push("/profile/setting/info"), 1000);
      } else {
        setSubmitState(SubmitButtonState.FAILED);
        console.log("Failed to update user");
      }
    } catch (error) {
      setSubmitState(SubmitButtonState.FAILED);
      console.log("Error while updating user", error);
    }
  };

  const handleImageChange = (image: UploadImage[]) => {
    setUpdateInfo((u) => ({
      ...u,
      image: image[0],
    }));
  };

  const handleDateChange = (date: string) => {
    setUpdateInfo((u) => ({
      ...u,
      birthdate: date,
    }));
  };

  const handleInfoChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdateInfo((c) => ({ ...c, [name]: value }));
  };

  return (
    <section className="flex flex-col gap-4">
      <div className=" bg-secondary-1/70 rounded-lg p-4 flex flex-col gap-4">
        <h1 className="text-primary font-bold text-2xl bg-accent/30 rounded-md px-2 py-1">
          User preview
        </h1>
        <form
          onSubmit={handleUpdate}
          className="flex flex-col sm:flex-row h-fit gap-2 sm:gap-4  text-accent"
        >
          <div>
            <ImageInput
              type="ProfileImage"
              image={updateInfo.image?.url ? [updateInfo.image] : []}
              setImage={handleImageChange}
            />
          </div>
          <div className="grow flex flex-col">
            <InputBox
              type="Input"
              name="username"
              maxLength={16}
              onTextChange={handleInfoChange}
              value={updateInfo.username}
            >
              Username
            </InputBox>
            <TextAreaInput
              name="bio"
              onTextChange={handleInfoChange}
              value={updateInfo.bio}
              style={{ fontSize: "0.8em" }}
            >
              Bio
            </TextAreaInput>
            <InputBox
              type="Input"
              name="fullname"
              maxLength={30}
              onTextChange={handleInfoChange}
              value={updateInfo.fullname}
            >
              Full name
            </InputBox>
            <DateTimePicker
              name="birthdate"
              value={updateInfo.birthdate || ""}
              onChange={handleDateChange}
            ></DateTimePicker>
          </div>
          <div className="flex justify-end gap-3 mt-auto">
            <SubmitButton state={submitState} changeState={setSubmitState}>
              Update
            </SubmitButton>
          </div>
        </form>
      </div>
      <div className="bg-secondary-1/70 rounded-lg p-4 flex flex-col gap-4">
        <h1 className="text-primary font-bold text-2xl bg-accent/30 rounded-md px-2 py-1">
          User profile preview
        </h1>
        <div className="User_Profile_Layout">
          <div className="User_Info_Container">
            <h1 className="User_Profile_Page_Username">
              {updateInfo.username || "username"}
            </h1>
            <div className="User_Profile_Page_Picture_Container">
              <div className="relative">
                <div
                  className={`${
                    session?.user.role?.includes(UserRole.ADMIN)
                      ? "User_Profile_Page_Picture_Admin"
                      : "User_Profile_Page_Picture"
                  }`}
                >
                  {updateInfo.image?.url ? (
                    <img
                      src={updateInfo.image?.url}
                      alt={"profile picture"}
                      className="size-full"
                      width={0}
                      height={0}
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
                {session?.user?.role?.includes(UserRole.ADMIN) ? (
                  <div className="absolute bottom-0 right-0 z-50 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[30%] flex items-center justify-center">
                    <FontAwesomeIcon icon={faHammer} className="size-[70%]" />
                  </div>
                ) : session?.user?.role?.includes(UserRole.CREATOR) ? (
                  <div className="absolute bottom-0 right-0 z-50 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[30%] flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="size-[70%]" />
                  </div>
                ) : null}
              </div>
              <div className="User_Profile_Page_Stat_Bar">
                <h1 className="flex flex-col items-center justify-start">
                  <span className="font-semibold">{0}</span>
                  Followers
                </h1>
                <h1 className="flex flex-col items-center justify-start">
                  <span className="font-semibold">{0}</span>
                  Following
                </h1>
                <h1 className="flex flex-col items-center justify-start">
                  <span className="font-semibold">{0}</span>Posts
                </h1>
              </div>
            </div>
            <h2 className="User_Profile_Page_Fullname">
              {updateInfo.fullname || "fullname"}
            </h2>
            <h2 className="User_Profile_Page_Bio">{updateInfo.bio || "bio"}</h2>
          </div>

          <div className="grow size-full rounded-lg bg-secondary-2/70"></div>
        </div>
      </div>

      <div className="bg-secondary-1/70 rounded-lg p-4 flex flex-col gap-4">
        <h1 className="text-primary font-bold text-2xl bg-accent/30 rounded-md px-2 py-1">
          User information preview
        </h1>
        <div className="flex items-center justify-center my-2">
          <div className="relative">
            <div
              className={`${
                session?.user.role?.includes(UserRole.ADMIN)
                  ? "User_Profile_Page_Picture_Admin"
                  : "User_Profile_Page_Picture"
              }`}
            >
              {updateInfo.image?.url ? (
                <img
                  src={updateInfo.image?.url}
                  alt={"profile picture"}
                  className="size-full"
                  width={0}
                  height={0}
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
            {session?.user?.role?.includes(UserRole.ADMIN) ? (
              <div className="absolute bottom-0 right-0 z-50 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[30%] flex items-center justify-center">
                <FontAwesomeIcon icon={faHammer} className="size-[70%]" />
              </div>
            ) : session?.user?.role?.includes(UserRole.CREATOR) ? (
              <div className="absolute bottom-0 right-0 z-50 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[30%] flex items-center justify-center">
                <FontAwesomeIcon icon={faCheck} className="size-[70%]" />
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col text-xl bg-secondary-2/40 py-2 px-1 text-accent rounded-lg">
          <div className="w-full py-2 flex flex-row">
            <div className="w-[30%] text-left px-2 font-semibold text-sm sm:text-lg break-words">
              Username
            </div>
            <p className="w-[70%]">{updateInfo.username || "username"}</p>
          </div>
          <div className="w-full py-2 flex flex-row">
            <div className="w-[30%] text-left px-2 font-semibold text-sm sm:text-lg break-words">
              Bio
            </div>
            <p className="w-[70%] whitespace-pre-wrap text-xs">
              {updateInfo.bio || "bio"}
            </p>
          </div>
          <div className="w-full py-2 flex flex-row">
            <div className="w-[30%] text-left px-2 font-semibold text-sm sm:text-lg break-words">
              Fullname
            </div>
            <p className="w-[70%]">{updateInfo.fullname || "fullname"}</p>
          </div>
          <div className="w-full py-2 flex flex-row">
            <div className="w-[30%] text-left px-2 font-semibold text-sm sm:text-lg break-words">
              Birth
            </div>
            <p className="w-[70%]">{updateInfo.birthdate || "birthdate"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
