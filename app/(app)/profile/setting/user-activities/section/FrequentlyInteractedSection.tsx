import PostCard from "@components/UI/Post/PostCard";
import CommentProps from "@components/UI/Props/ComentProps";
import { renderReaction } from "@lib/Emoji/render";
import User from "@models/userModel";
import { faUser } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

export default function FrequentlyInteractedSection({ isVisible }: { isVisible: boolean }) {
  const [animated, setAnimate] = useState(isVisible);

  useEffect (()=>{setAnimate(isVisible)},[isVisible])
 

  const people = [
    { x: 30, y: -10, z: 5, scale: 0.9, left: "20%", top: "50%" }, // Rotation for the first card
    { x: -5, y: 10, z: -10, scale: 0.7, left: "45%", top: "30%" }, // Rotation for the second card
    { x: 10, y: 30, z: -6, scale: 1, left: "70%", top: "60%" }, // Rotation for the second card
  ];

  return (
    <section
      className="flex flex-col"

      style={{
        opacity: animated ? 1 : 0,
      }}
    >
      <div className={`title ${animated ? "animate-slideUp" : ""} m-auto`}>
        Highlights from Your Activity
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full p-2 gap-2">
        <div className="h-[300px] flex flex-col relative">
          <div className="light_bottom_right size-full absolute"></div>
          <div className="bloom_left size-full absolute bottom-0 left-[50%] -translate-x-1/2"></div>
          <div className="relative grow mb-2">
            {people.map((person, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  left: person.left,
                  top: person.top,
                  transform: `rotateX(${person.x}deg) rotateY(${person.y}deg) rotateZ(${person.z}deg)`,
                }}
              >
                <div className={`${animated ? "animate-slideUp" : ""}`}>
                  <div className="rounded-full size-20 bg-secondary-1  overflow-hidden  shadow-md">
                    <FontAwesomeIcon icon={faUser} className="size-full" />
                  </div>
                  <div>Username</div>
                </div>
              </div>
            ))}
          </div>
          <div className={`${animated?"animate-slideRight":""} title m-auto`}>People You Engage With</div>
        </div>
        <div className="h-[300px] flex flex-col relative">
          <div className="light_bottom_left size-full absolute"></div>
          <div className="bloom_right size-full absolute bottom-0 left-[50%] -translate-x-1/2"></div>
          <div className="relative grow mb-2">
            {people.map((person, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  left: person.left,
                  top: person.top,
                  transform: `rotateX(${person.x}deg) rotateY(${person.y}deg) rotateZ(${person.z}deg)`,
                }}
              >
                <div
                  className={` bg-secondary-2 shadow-md p-2 rounded-xl italic text-xl ${
                    animated ? "animate-slideUp" : ""
                  }`}
                >
                  #hastag
                </div>
              </div>
            ))}
          </div>
          <div className={`${animated?"animate-slideLeft":""} title m-auto`}>Things you care about</div>
        </div>
      </div>
    </section>
  );
}
