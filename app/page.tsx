"use client";
import HoverButton from "@components/Input/HoverButton";
import CommentProps from "@components/UI/Props/ComentProps";
import PostProps from "@components/UI/Props/PostProps";
import Provider from "@context/Provider";
import { Reaction } from "@enum/reactionEnum";
import { renderReaction } from "@lib/Emoji/render";
import {
  faAngleDoubleDown,
  faHeart,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { headers } from "@node_modules/next/headers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function Website() {
  const router = useRouter();
  const { data: session } = useSession();

  if (session?.user) router.replace("home");

  const fixedPositions = [
    { left: "5%", top: "10%", scale: 0.8 },
    { left: "20%", top: "40%", scale: 1 },
    { left: "2%", top: "30%", scale: 1.1 },
    { left: "15%", top: "25%", scale: 1.03 },
    { left: "30%", top: "40%", scale: 1.8 },
    { left: "50%", top: "55%", scale: 1.3 },
    { left: "65%", top: "35%", scale: 1.4 },
    { left: "80%", top: "15%", scale: 2 },
  ];

  const titlePost = [
    { left: "-10%", top: "20%" },
    { left: "-5%", top: "90%" },
    { left: "80%", top: "85%" },
    { left: "20%", top: "-20%" },
    { left: "90%", top: "-10%" },
  ];

  const postPos = [
    { x: 15, y: -10, z: 5, scale: 0.9, right: "0%", zIndex: 1, blur: 0.5 }, // Rotation for the first card
    { x: -5, y: 20, z: -10, scale: 0.7, right: "10%", zIndex: 0, blur: 2 }, // Rotation for the second card
    { x: 10, y: 10, z: -6, scale: 1, right: "25%", zIndex: 1, blur: 0 }, // Rotation for the second card
  ];

  const reactionStyles = [
    {
      reaction: Reaction.LIKE,
      top: "10%",
      right: "10%",
      rotate: "rotate(12deg)",
      scale: 0.8,
    },
    {
      reaction: Reaction.LOVE,
      top: "20%",
      right: "23%",
      rotate: "rotate(-8deg)",
      scale: 1.0,
    },
    {
      reaction: Reaction.HAHA,
      top: "35%",
      right: "32%",
      rotate: "rotate(18deg)",
      scale: 1.3,
    },
    {
      reaction: Reaction.WOW,
      top: "50%",
      right: "25%",
      rotate: "rotate(-22deg)",
      scale: 1.7,
    },
    {
      reaction: Reaction.SAD,
      top: "65%",
      right: "43%",
      rotate: "rotate(15deg)",
      scale: 2.0,
    },
    {
      reaction: Reaction.ANGRY,
      top: "50%",
      right: "67%",
      rotate: "rotate(-10deg)",
      scale: 2.3,
    },
    {
      reaction: Reaction.LIKE,
      top: "5%",
      right: "80%",
      rotate: "rotate(10deg)",
      scale: 2.5,
    },
    {
      reaction: Reaction.HAHA,
      top: "30%",
      right: "15%",
      rotate: "rotate(-12deg)",
      scale: 2.4,
    },
    {
      reaction: Reaction.WOW,
      top: "45%",
      right: "55%",
      rotate: "rotate(5deg)",
      scale: 1.2,
    },
    {
      reaction: Reaction.LOVE,
      top: "60%",
      right: "30%",
      rotate: "rotate(-20deg)",
      scale: 1.8,
    },
    {
      reaction: Reaction.SAD,
      top: "75%",
      right: "20%",
      rotate: "rotate(10deg)",
      scale: 2.1,
    },
    {
      reaction: Reaction.ANGRY,
      top: "85%",
      right: "50%",
      rotate: "rotate(-18deg)",
      scale: 1.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_70%] overflow-y-auto overflow-x-hidden lg:overflow-hidden  w-screen h-screen p-2 relative snap-y ">
      <div className="bloom_right size-full absolute -z-10"></div>
      <div className="mx-auto grid grid-rows-3 justify-center  items-center text-center relative p-2 h-screen snap-start">
        <div className="self-start flex flex-row gap-2  w-full items-center justify-end p-2">
          <button
            className="Button_variant_2 mr-auto"
            onClick={() => {
              router.push("/home");
            }}
          >
            Visit as guest
          </button>
          <HoverButton
            buttonSet={[
              { name: "Sign Up", func: () => {router.push("/sign-in?signUp=true")} },
              { name: "Sign In", func: () => {router.push("/sign-in")} },
            ]}
          />
        </div>
        <div className="light_bottom size-full absolute -z-10"></div>
        <div className="bloom_up size-full absolute -z-10"></div>
        <div className="absolute size-full -z-10">
          {titlePost.map((item, index) => (
            <div
              key={index}
              className="w-[20%] min-w-[150px]  max-w-[200px] aspect-[2/3] absolute"
              style={{ left: item.left, top: item.top }}
            >
              <PostProps />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="font-AppLogo text-9xl ">AppLogo</div>
          <div
            className="title w-full justify-center items-center flex flex-col"
            style={{ fontSize: "3em", lineHeight: "1em" }}
          >
            <span>Welcome to</span>{" "}
            <span className="font-AppName">Le Gallerie</span>
          </div>
          <div className="subtitle" style={{ fontSize: "2em" }}>
            Discover and Share Stunning Artwork
          </div>
          <div className="text-base text-center text-accent/80 max-w-[400px]">
            A social platform for artists and art lovers to share, explore, and
            connect through creativity.
          </div>
        </div>
        <div className="lg:hidden mx-auto flex flex-col gap-2">
          <div className="subtitle ">Read more</div>
          <FontAwesomeIcon
            icon={faAngleDoubleDown}
            className="animate-bounce subtitle "
          />
        </div>
      </div>

      <div className="flex p-2 flex-col gap-4 relative h-fit lg:overflow-y-auto lg:h-screen ">
        <div className="title snap-start">
          What is <span className="font-AppName">Le Gallerie</span> ?
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm w-fit">
          <div className="text_panel w-fit text-lg  ">
            A social platform for artists 🧑‍🎨 and art lovers 🎨 🖼️ to share 🌐,
            explore 🗺️, and connect 🤝 through creativity.
          </div>
          <div className="text_panel w-fit text-lg ">
            A dedicated space exclusively for artists, designers, and creatives
            to showcase their work ✨ and connect with like-minded individuals
            🫂.
          </div>
          <div className="text_panel w-fit  text-xl">
            Join us 🤗 and find out for yourself 🥰
          </div>
        </div>
        <div className="relative w-full h-[300px] min-h-[300px] -z-10">
          <div className="size-full absolute bloom_right"></div>
          <div className="absolute size-full  animate-slideUp">
            <div className={`size-full flex flex-row gap-2 p-4 mb-4 relative `}>
              {fixedPositions.map((pos, index) => (
                <div
                  key={index}
                  className={`absolute  `}
                  style={{
                    left: pos.left,
                    top: pos.top,
                    zIndex: index,
                  }}
                >
                  <div
                    className={`absolute `}
                    style={{
                      transform: `scale(${pos.scale})`,
                      filter: `blur(${2 - pos.scale}px)`, // Dynamic blur calculation
                    }}
                  >
                    <CommentProps />
                    <div className="shadow "></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ul className="size-full z-10 relative animate-slideLeft">
            {postPos.map((pos, index) => (
              <div
                key={index}
                className="grow absolute bottom-0 w-[45%] max-w-[160px] aspect-[1/2]"
                style={{
                  right: pos.right,
                  zIndex: pos.zIndex,
                  transform: `scale(${pos.scale})`,
                }}
              >
                <div
                  className="size-full"
                  style={{
                    transform: `rotateX(${pos.x}deg) rotateY(${pos.y}deg) rotateZ(${pos.z}deg)`,
                  }}
                >
                  <PostProps />
                </div>
                <div className="shadow"></div>
              </div>
            ))}
          </ul>
        </div>
        <div className="title snap-start">What can you do?</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text_panel w-fit ">
            <strong>📌 Create and share your art through posts</strong> Express
            yourself by uploading drawings, paintings, digital art, photography,
            and more. Share your creative process, add descriptions, and let the
            world see your artistic vision.
          </div>
          <div className="text_panel w-fit ">
            <strong>👍 Interact with posts</strong> Engage with other artists by
            liking their artwork, leaving meaningful comments, and discovering
            new talents. Build a supportive and inspiring community around your
            creativity.
          </div>
          <div className="text_panel w-fit ">
            <strong>💬 Chat with other users in real-time</strong> Connect
            instantly with fellow artists, discuss techniques, exchange ideas,
            and build friendships with creatives from all over the world.
          </div>
          <div className="text_panel w-fit ">
            <strong>🤖 Get inspiration from an AI-powered art assistant</strong>{" "}
            Stuck in an art block? Our AI bot helps generate ideas, suggest
            themes, and provide artistic prompts to keep your creativity
            flowing.
          </div>
          <div className="text_panel w-fit ">
            <strong>
              🎨 Customize your profile to reflect your artistic style
            </strong>{" "}
            Personalize your profile with banners, bio descriptions, and a
            curated gallery of your best works. Let your page be a reflection of
            your unique artistic identity.
          </div>
        </div>
        <div className="relative w-full h-[200px] min-h-[200px] animate-slideUp">
          <div className="bloom_right absolute size-full"></div>
          <ul className={`size-full relative`}>
            {reactionStyles.map(
              ({ reaction, top, right, rotate, scale }, index) => (
                <div
                  key={index}
                  className={`absolute size-6 lg:size-8 `}
                  style={{
                    top,
                    right,
                    filter: `blur(${2.5 - scale}px)`,
                  }}
                >
                  <div style={{ transform: rotate + `scale(${scale})` }}>
                    {renderReaction(reaction)}
                  </div>
                  <div className="shadow "></div>
                </div>
              )
            )}
          </ul>
        </div>
        <div className="title snap-start mx-auto">About us</div>
        <div className="w-full flex flex-wrap gap-4 justify-center relative">
          <div className="bloom_up size-full absolute"></div>
          <div
            className={` relative w-[250px] aspect-[2/3] grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0 shadow-md`}
          >
            <div
              className={`size-full bg-cover bg-[url('/images/LeNguyenDongXuan.jpg')]`}
            ></div>
            <div className="flex flex-col justify-between absolute p-2 bottom-0 left-0 size-full">
              <div className="flex flex-row justify-between items-center w-full gap-1">
                <div className="flex flex-row gap-1 items-center bg-secondary-2/70 p-1 rounded-full text-sm">
                  <FontAwesomeIcon icon={faHeart} />
                  <div className="  w-16 rounded-lg bg-secondary-1 h-4"></div>
                </div>
                <div className=" text-black font-semibold py-1 px-2 rounded-full bg-white w-fit text-sm">
                  22521713
                </div>
              </div>
              <div className="h-fit w-full flex flex-row gap-2 items-center justify-start">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/00/Logo_UIT_updated.svg"
                  className="size-12"
                  alt="UIT"
                  title="University of Information Technology"
                ></img>
                <div className="text-black font-semibold py-1 px-2 rounded-full bg-white w-fit text-sm">
                  Lê Nguyễn Đông Xuân
                </div>
              </div>
            </div>
          </div>

          <div
            className={` relative w-[250px] aspect-[2/3] grid grid-cols-1 gap-2 rounded-xl overflow-hidden cursor-pointer z-0 shadow-md`}
          >
            <div
              className={`size-full bg-cover bg-[url('/images/LuuNguyenTheVinh.jpg')]`}
            ></div>
            <div className="flex flex-col justify-between absolute p-2 bottom-0 left-0 size-full">
              <div className="flex flex-row justify-between items-center w-full gap-1">
                <div className="flex flex-row gap-1 items-center bg-secondary-2/70 p-1 rounded-full text-sm">
                  <FontAwesomeIcon icon={faHeart} />
                  <div className="  w-16 rounded-lg bg-secondary-1 h-4"></div>
                </div>
                <div className="  text-black font-semibold py-1 px-2 rounded-full bg-white w-fit text-xs">
                  22521672
                </div>
              </div>
              <div className="h-fit w-full flex flex-row gap-2 items-center justify-start">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/00/Logo_UIT_updated.svg"
                  className="size-12"
                  alt="UIT"
                  title="University of Information Technology"
                ></img>
                <div className=" text-black font-semibold py-1 px-2 rounded-full bg-white w-fit text-sm">
                  Lưu Nguyễn Thế Vinh
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text_panel mx-auto">
          We’re a team of two university students 🧑‍💻 from <b>UIT</b>, passionate about
          building a platform where artists and art lovers can connect, share,
          and explore creativity together. <br /> <br /> Our goal is to create a dedicated
          space for artists, designers, and creatives to showcase their work and
          form meaningful connections. <br /> <br />Join us and be part of this growing
          community! 🥰
        </div>
      </div>
    </div>
  );
}
