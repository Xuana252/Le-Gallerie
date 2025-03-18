import React, { act, useEffect, useState } from "react";
import ButtonWithTimeOut from "./ButtonWithTimeOut";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { faHeart } from "@node_modules/@fortawesome/free-regular-svg-icons";
import { useTransition, animated, useSpring } from "@react-spring/web";
import { Reaction } from "@app/enum/reactionEnum";
import { renderReaction } from "@lib/Emoji/render";

type ReactionButtonProps = {
  style?: "vertical"|"horizontal"
  drop: "left"|"right"
  type: string;
  reaction: Reaction | null;
  action: (r: Reaction | null) => void;
};

export default function ReactionButton({
  style = "horizontal",
  drop = "left",
  type = "Icon_small",
  reaction,
  action,
}: ReactionButtonProps) {
  const [isReactionBarVisible, setReactionBarVisibility] = useState(false);

  const reactionBarTransition = useTransition(isReactionBarVisible, {
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { tension: 300, friction: 10 },
  });

  // Create a spring for the reaction icon and get the API.
  const [animationProps, api] = useSpring(() => ({
    transform: "scale(1)",
    config: { tension: 300, friction: 10 },
  }));
  // When reaction changes, trigger a "pop" animation.
  useEffect(() => {
    api.start({
      from: { transform: "scale(0.8)" },
      to: { transform: "scale(1)" },
    });
  }, [reaction, api]);

  const handleSetReaction = () => {
    if (!reaction) action(Reaction.LIKE);
    else action(null);
  };

  const handleSetReactionFromBar = (newReaction: Reaction) => {
    action(newReaction === reaction ? null : newReaction);
    setReactionBarVisibility(false)
  };

  return (
    <div
      className="relative w-fit"
      onMouseOver={() => setReactionBarVisibility(true)}
      onMouseLeave={() => setReactionBarVisibility(false)}
      onTouchStart={() => setReactionBarVisibility(true)}
      onTouchEnd={() => setReactionBarVisibility(false)}
      onTouchCancel={() => setReactionBarVisibility(false)}
    >
      <ButtonWithTimeOut
        timeOut={1000}
        className={`${type} p-1`}
        onClick={() => handleSetReaction()}
      >
        {/* Wrap the reaction icon with the animated div */}
        <animated.div style={animationProps}>
          {renderReaction(reaction)}
        </animated.div>
      </ButtonWithTimeOut>
      {reactionBarTransition((styles, item) =>
        item ? (
          <animated.div
            style={styles}
            className={`absolute bottom-0 grid ${style==="horizontal"?"grid-cols-6 w-[200px]":"grid-cols-2 w-[60px]"} ${drop==="left"?"-left-[100%]":"-right-[100%]"} gap-2 p-2 bg-secondary-2/70 rounded-xl shadow-md  z-50`}
          >
            <img
              src={`/icons/like.png`}
              alt="like"
              className="ReactionItem"
              onClick={() => handleSetReactionFromBar(Reaction.LIKE)}
            />
            <img
              src={`/icons/love.png`}
              alt="love"
              className="ReactionItem"
              onClick={() => handleSetReactionFromBar(Reaction.LOVE)}
            />
            <img
              src={`/icons/haha.png`}
              alt="haha"
              className="ReactionItem"
              onClick={() => handleSetReactionFromBar(Reaction.HAHA)}
            />
            <img
              src={`/icons/sad.png`}
              alt="sad"
              className="ReactionItem"
              onClick={() => handleSetReactionFromBar(Reaction.SAD)}
            />
            <img
              src={`/icons/wow.png`}
              alt="wow"
              className="ReactionItem"
              onClick={() => handleSetReactionFromBar(Reaction.WOW)}
            />
            <img
              src={`/icons/angry.png`}
              alt="angry"
              className="ReactionItem"
              onClick={() => handleSetReactionFromBar(Reaction.ANGRY)}
            />
          </animated.div>
        ) : null
      )}
    </div>
  );
}
