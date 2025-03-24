import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import ChatBoxProps from "@components/UI/Props/ChatBoxProps";
import { User } from "@lib/types";
import { faUser } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function BestBuddySection({
  isVisible,
}: {
  isVisible: boolean;
}) {
  const [user, setUser] = useState<User>();
  const [animated, setAnimate] = useState(isVisible);

  useEffect(() => {
    setAnimate(isVisible);
  }, [isVisible]);
  return (
    <section className="flex flex-col">
      <div className={`${animated ? "animate-slideUp" : ""} title m-auto mt-6`}>
        Your best buddy
      </div>

      <div className="mx-auto w-full relative flex flex-col items-center my-10">
        <div className="light_bottom_left size-full absolute"></div>
        <div className="bloom_right size-full absolute"></div>
        <div className="light_bottom size-full absolute"></div>
        <div
          className={`${
            animated ? "animate-slideLeft" : ""
          } left-0 h-full w-[50%] absolute text-sm`}
        >
          <div className="bg-accent text-primary w-[150px]  rounded-xl shadow-lg absolute right-[10%] bottom-[10%]  blur-sm p-2">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel quasi
            eum praesentium officiis, consequatur est voluptate neque qui
            reiciendis fugiat.
          </div>
          <div className="bg-primary text-accent w-[180px]  rounded-xl shadow-lg absolute right-[14%] bottom-[24%]  blur-sm  p-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores
            architecto rerum assumenda maiores. Commodi, autem?
          </div>
          <div className="bg-accent text-primary  w-[200px]  rounded-xl shadow-lg absolute right-[24%] bottom-[70%]  blur-sm p-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Perspiciatis, ex.
          </div>
        </div>
        <div
          className={`${
            animated ? "animate-slideRight" : ""
          } left-1/2 h-full w-[50%] absolute text-sm`}
        >
          <div className="bg-primary text-accent w-[180px]  rounded-xl shadow-lg absolute left-[23%] bottom-[10%]  blur-sm p-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          </div>
          <div className="bg-accent text-primary w-[150px]  rounded-xl shadow-lg absolute left-[9%] bottom-[42%]  blur-sm p-2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam
            totam suscipit maxime.
          </div>
          <div className="bg-primary text-accent w-[120px]  rounded-xl shadow-lg absolute left-[16%] bottom-[78%]  blur-sm p-2">
            Lorem ipsum dolor sit amet.
          </div>
        </div>
        <ChatBoxProps />
        <div className="absolute top-[20%] z-40 flex flex-col items-center">
          <div className="light_bottom size-full absolute"></div>
          {user ? (
            <UserProfileIcon
              currentUser={false}
              user={user}
              size="Icon_bigger"
            />
          ) : (
            <div className="Icon_bigger shadow-md">
              <FontAwesomeIcon icon={faUser} className="size-full" />
            </div>
          )}
          <div className="title">10000 messages sent</div>
        </div>
      </div>
    </section>
  );
}
