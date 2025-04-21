import { NumberLoader } from "@components/UI/Loader";
import { User } from "@lib/types";
import { faUser } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function FollowsAndFriendsSection({
  isVisible,
  followers,
  following,
  friends,
}: {
  isVisible: boolean;
  followers: User[]|null;
  following: User[]|null;
  friends: User[]|null;
}) {
  const [animated, setAnimate] = useState(isVisible);

  useEffect(() => {
    setAnimate(isVisible);
  }, [isVisible]);

  return (
    <section>
      <div className=" flex flex-col relative">
        <div
          className={`${animated ? "animate-slideIp" : ""} title m-auto mt-6`}
        >
          Follows & Friends
        </div>
        <div className="flex flex-wrap w-full">
          <div className="grow h-[300px] min-w-[320px] flex flex-col justify-center  relative">
            <div className="absolute size-full bloom_left"></div>
            <div className="absolute size-full light_bottom_right"></div>
            <div className="subtitle mx-auto">{following?following.length: <NumberLoader/>} <FontAwesomeIcon icon={faUser}/> </div>
            <div className="subtitle  mx-auto">Following</div>
          </div>
          <div className="grow h-[300px] min-w-[320px] flex flex-col justify-center  relative">
          <div className="absolute size-full bloom_up"></div>
            <div className="absolute size-full light_bottom"></div>
          <div className="subtitle mx-auto">{followers?followers.length: <NumberLoader/>} <FontAwesomeIcon icon={faUser}/></div>
            <div className="subtitle mx-auto">Followers</div>
          </div>
          <div className="grow h-[300px] min-w-[320px] flex flex-col justify-center  relative">
          <div className="absolute size-full bloom_right"></div>
            <div className="absolute size-full light_bottom_left"></div>
          <div className="subtitle mx-auto">{friends?friends.length: <NumberLoader/>} <FontAwesomeIcon icon={faUser}/></div>
            <div className="subtitle mx-auto">Friends</div>
          </div>
        </div>
      </div>
    </section>
  );
}
