import { SubmitButtonState } from "@enum/submitButtonState";
import FriendSearchSection from "@components/Chat/ChatTabComponent/FriendSearchSection";
import ImageInput from "@components/Input/ImageInput";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import toastError, { confirm } from "@components/Notification/Toaster";
import { ChatContext } from "@components/UI/Nav";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import { createGroupChat } from "@lib/Chat/chat";
import { UploadImage, User } from "@lib/types";
import { uploadImage } from "@lib/upload";
import { faMinus, faUserPlus } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { use, useContext, useState } from "react";

export default function GroupChatForm() {
  const router = useRouter();
  const { setChatInfo } = useContext(ChatContext);
  const [groupPhoto, setGroupPhoto] = useState<UploadImage>({
    file: null,
    url: "",
  });
  const [groupName, setGroupName] = useState("New Group");
  const [createState, setCreateState] = useState<SubmitButtonState>(SubmitButtonState.IDLE);
  const [members, setMembers] = useState<User[]>([]);

  const handleImageChange = (image: UploadImage[]) => {
    setGroupPhoto(image[0]);
  };
  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };
  const handleAddMember = (user: User) => {
    setMembers((prev) => {
      // Check if user already exists in the members array
      if (prev.some((member) => member._id === user._id)) {
        return prev; // Return previous state if user already exists
      }
      return [...prev, user]; // Add user if they are not already in the list
    });
  };

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await confirm("Do you want to create group chat?");
    if (!result) return;
    setCreateState(SubmitButtonState.PROCESSING);

    try {
      let photoUrl = "";
      if (groupPhoto.file) photoUrl = await uploadImage(groupPhoto.file);
      createGroupChat(members, setChatInfo, router, groupName, photoUrl);
      setCreateState(SubmitButtonState.SUCCESS);

    } catch (error:any) {
      setCreateState(SubmitButtonState.FAILED);
      console.log(error)
      toastError(error.toString())
    }
  };

  const handleRemoveMember = (user: User) => {
    setMembers((prev) => prev.filter((member) => member._id !== user._id));
  };
  return (
    <form
      onSubmit={(e) => handleCreateGroup(e)}
      className="flex flex-col sm:w-[400px] w-[300px] gap-2 text-accent"
    >
      <InputBox
        type="Input"
        styleVariant="Input_box_variant_2"
        value={groupName}
        onTextChange={handleGroupNameChange}
      >
        Group name...
      </InputBox>
      <ImageInput
        type="ProfileImage"
        image={[groupPhoto]}
        setImage={handleImageChange}
      />
      <FriendSearchSection onSelected={handleAddMember} />
      <div>Members</div>
      <ul className="flex flex-col w-full h-[200px] overflow-scroll no-scrollbar bg-primary/80 rounded-lg p-1 gap-2">
        <div className="flex flex-row justify-between items-center gap-2">
          <UserProfileIcon currentUser={true} size="Icon_small" />
          <div className="grow font-bold text-accent">You</div>
        </div>
        {members.length>0
                  ?members.map((member, index) => (
                    <li className="flex flex-row justify-between items-center gap-2" key={index}>
                      <UserProfileIcon
                        currentUser={false}
                        user={member}
                        size="Icon_small"
                      />
                      <div className="grow font-bold text-accent">
                        {member.username}
                      </div>
                      <button
                        className="Icon_smaller"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveMember(member);
                        }}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </li>
                  ))
                :(
                  <div className="m-auto opacity-50">
                    add your friends {" "}
                    <FontAwesomeIcon icon={faUserPlus}/>
                  </div>
                )}
      </ul>
      <SubmitButton state={createState} changeState={setCreateState}>
        Add Group
      </SubmitButton>
    </form>
  );
}
