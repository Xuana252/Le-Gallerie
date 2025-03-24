import { fetchUserWithId } from "@actions/accountActions";
import UserProfileIcon from "@components/UI/Profile/UserProfileIcon";
import { Comment, Like, User } from "@lib/types";
import {
  faHeart,
  faComment,
  faUser,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { animated } from "@node_modules/@react-spring/web/dist/react-spring_web.modern";
import React, { useEffect, useState } from "react";

export default function BiggestFansSection({
  isVisible,
  postsLikes,
  postsComments,
}: {
  isVisible: boolean;
  postsLikes: Like[];
  postsComments: Comment[];
}) {
  const [animated, setAnimate] = useState(isVisible);
  const [users, setTop3User] = useState<
    { user: User; reaction: number; comment: number }[]
  >([]);

  const [displayNumber, setIsDisplayNumber] = useState("");

  useEffect(() => {
    setAnimate(isVisible);
  }, [isVisible]);

  useEffect(() => {
    const getTop3 = async () => {
      const interactions = [
        ...(postsLikes?.map((like) => ({
          userId: like.user.toString(),
          type: "reaction" as const,
        })) || []),
        ...(postsComments?.map((comment) => ({
          userId: comment.user.toString(),
          type: "comment" as const,
        })) || []),
      ];

      const userCounts = interactions.reduce((acc, interaction) => {
        if (!acc[interaction.userId]) {
          acc[interaction.userId] = { reaction: 0, comment: 0 };
        }
        acc[interaction.userId][interaction.type]++;
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
    };

    getTop3();
  }, [postsLikes, postsComments]);

  const peoplePos = [
    { x: 20, y: 0, z: 0, scale: 1.1, left: "40%", top: "10%" }, // Rotation for the second card
    { x: 30, y: -10, z: 10, scale: 0.9, left: "20%", top: "50%" }, // Rotation for the first card
    { x: 10, y: 10, z: -20, scale: 1, left: "65%", top: "60%" }, // Rotation for the second card
  ];
  return (
    <section>
      <div className="h-[300px] flex flex-col relative">
        <div
          className={`${
            animated ? "animate-slideRight" : ""
          } title m-auto mt-6`}
        >
          Your biggest fans
        </div>
        <div className="light_bottom size-full absolute"></div>
        <div className="light_bottom_right size-full absolute"></div>
        <div className="bloom_left size-full absolute bottom-0"></div>
        <div className="bloom_up size-full absolute bottom-0 left-[50%] -translate-x-1/2"></div>
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
                    {users[index].comment} <FontAwesomeIcon icon={faComment} />
                  </span>
                </div>
              )}
              <div
                className={`${
                  animated ? "animate-slideUp" : ""
                } flex flex-col items-center`}
              >
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
                {users[index] && (
                  <div className="font-bold">{users[index].user.username}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
