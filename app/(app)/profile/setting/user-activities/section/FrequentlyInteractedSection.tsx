import { fetchUserWithId } from "@actions/accountActions";
import PostCard from "@components/UI/Post/PostCard";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import CommentProps from "@components/UI/Props/ComentProps";
import { renderReaction } from "@lib/Emoji/render";
import { Like, Comment, User, Category } from "@lib/types";
import {
  faComment,
  faHeart,
  faUser,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { Profiler, use, useEffect, useRef, useState } from "react";

export default function FrequentlyInteractedSection({
  isVisible,
  likes,
  comments,
}: {
  likes: Like[];
  comments: Comment[];
  isVisible: boolean;
}) {
  const [animated, setAnimate] = useState(isVisible);
  const [displayNumber, setIsDisplayNumber] = useState("");

  const [users, setTop3User] = useState<
    { user: User; reaction: number; comment: number }[]
  >([]);
  const [categories, setTop3Category] = useState<
    { category: string; reaction: number; comment: number }[]
  >([]);

  useEffect(() => {
    setAnimate(isVisible);
  }, [isVisible]);

  useEffect(() => {
    const getTop3 = async () => {
      const interactions = [
        ...(likes?.map((like) => ({
          creator: like.post.creator.toString(),
          categories: like.post.categories,
          type: "reaction" as const,
        })) || []),
        ...(comments?.map((comment) => ({
          creator: comment.post.creator.toString(),
          categories: comment.post.categories,
          type: "comment" as const,
        })) || []),
      ];

      const userCounts = interactions.reduce((acc, interaction) => {
        if (!acc[interaction.creator]) {
          acc[interaction.creator] = { reaction: 0, comment: 0 };
        }
        acc[interaction.creator][interaction.type]++;
        return acc;
      }, {} as Record<string, { reaction: number; comment: number }>);

      const categoryCounts = interactions.reduce((acc, interaction) => {
        interaction.categories.forEach((category: Category) => {
          if (!acc[category.name]) {
            acc[category.name] = { reaction: 0, comment: 0 };
          }
          acc[category.name][interaction.type]++;
        });
        return acc;
      }, {} as Record<string, { reaction: number; comment: number }>);

      const top3UsersIds = Object.entries(userCounts)
        .sort(
          ([, a], [, b]) => b.reaction + b.comment - (a.reaction + a.comment)
        )
        .slice(0, 3)
        .map(([userId, counts]) => ({
          id: userId,
          reaction: counts.reaction,
          comment: counts.comment,
        }));

      const top3Users = await Promise.all(
        top3UsersIds.map(async (user) => {
          const res = await fetchUserWithId(user.id);
          return { user: res, reaction: user.reaction, comment: user.comment };
        })
      );

      setTop3User(top3Users);

      const top3Categories = Object.entries(categoryCounts)
        .sort(
          ([, a], [, b]) => b.reaction + b.comment - (a.reaction + a.comment)
        )
        .slice(0, 3)
        .map(([category, counts]) => ({
          category: category,
          reaction: counts.reaction,
          comment: counts.comment,
        }));

      setTop3Category(top3Categories);

      console.log(top3Users,top3Categories)
    };

    getTop3();
  }, [likes, comments]);

  const peoplePos = [
    { x: -5, y: 10, z: -10, scale: 1.1, left: "45%", top: "10%" }, // Rotation for the second card
    { x: 30, y: -10, z: 5, scale: 0.9, left: "20%", top: "50%" }, // Rotation for the first card
    { x: 10, y: 30, z: -6, scale: 1, left: "70%", top: "60%" }, // Rotation for the second card
  ];

  const categoriesPos = [
    { x: -5, y: 10, z: 10, scale: 1.1, left: "45%", top: "30%" }, // Rotation for the second card
    { x: 10, y: 20, z: 2, scale: 0.9, left: "70%", top: "60%" }, // Rotation for the second card
    { x: 30, y: -10, z: 5, scale: 0.8, left: "25%", top: "70%" }, // Rotation for the first card
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
            {peoplePos.map((person, index) => (
              <div
                onMouseEnter={() => setIsDisplayNumber("p" + index)}
                onMouseLeave={() => setIsDisplayNumber("null")}
                key={index}
                className="absolute flex flex-col items-center"
                style={{
                  left: person.left,
                  top: person.top,
                  transform: `rotateX(${person.x}deg) rotateY(${person.y}deg) rotateZ(${person.z}deg)`,
                }}
              >
                {users[index] && (
                  <div
                    className={`${
                      displayNumber === "p" + index
                        ? "animate-slideUp text-accent/70 text-xs font-semibold rounded-md bg-primary p-1 w-fit absolute flex flex-col z-auto bottom-[100%]"
                        : "hidden"
                    }`}
                  >
                    <span>
                      {users[index].reaction} <FontAwesomeIcon icon={faHeart} />
                    </span>{" "}
                    <span>
                      {users[index].comment}{" "}
                      <FontAwesomeIcon icon={faComment} />
                    </span>
                  </div>
                )}
                <div className={`${animated ? "animate-slideUp" : ""} flex flex-col items-center`}>
                  <div style={{ scale: person.scale }}>
                    {users[index] ? (
                      <UserProfileIcon
                        currentUser={false}
                        user={users[index].user}
                        size="Icon_bigger"
                      />
                    ) : (
                      <div className="rounded-full size-20 bg-secondary-1  overflow-hidden  shadow-md">
                        <FontAwesomeIcon icon={faUser} className="size-full" />
                      </div>
                    )}
                  </div>
                  {users[index] && <div className="font-bold">{users[index].user.username}</div>}
                </div>
              </div>
            ))}
          </div>
          <div
            className={`${
              animated ? "animate-slideRight" : ""
            } title m-auto mt-6`}
          >
            People You Engage With
          </div>
        </div>
        <div className="h-[300px] flex flex-col relative">
          <div className="bloom_right size-full absolute bottom-0 left-[50%] -translate-x-1/2"></div>
          <div className="light_bottom size-full absolute"></div>
          <div className="relative grow mb-2">
            {categoriesPos.map((category, index) => (
              <div
                onMouseEnter={() => setIsDisplayNumber("c" + index)}
                onMouseLeave={() => setIsDisplayNumber("null")}
                key={index}
                className="absolute flex flex-col items-center"
                style={{
                  left: category.left,
                  top: category.top,
                  transform: `rotateX(${category.x}deg) rotateY(${category.y}deg) rotateZ(${category.z}deg)`,
                }}
              >
                {categories[index] && (
                  <div
                    className={`${
                      displayNumber === "c" + index
                        ? "animate-slideUp text-accent/70 text-xs font-semibold rounded-md bg-primary p-1 w-fit absolute flex flex-col z-auto bottom-[100%]"
                        : "hidden"
                    }`}
                  >
                    <span>
                      {categories[index].reaction} <FontAwesomeIcon icon={faHeart} />
                    </span>{" "}
                    <span>
                    {categories[index].comment} <FontAwesomeIcon icon={faComment} />
                    </span>
                  </div>
                )}
                <div className={`  ${animated ? "animate-slideUp" : ""}`}>
                  <div
                    className="bg-secondary-2 shadow-md p-2 rounded-xl italic text-xl"
                    style={{ scale: category.scale }}
                  >
                    #{categories[index]?.category||"hastag"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className={`${
              animated ? "animate-slideLeft" : ""
            } title m-auto mt-6`}
          >
            Things you care about
          </div>
        </div>
      </div>
    </section>
  );
}
