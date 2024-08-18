"use client";
import { useTransition, animated } from "@react-spring/web";
import React, { ReactNode, useMemo, useState } from "react";

type DropDownButtonProps = {
  dropDirection?: "left" | "right" | "top" | "bottom";
  children: ReactNode;
  dropDownList: ReactNode;
};
export default function DropDownButton({
  children,
  dropDownList,
  dropDirection = "bottom",
}: DropDownButtonProps) {
  const [toggleDropDown, setToggleDropDown] = useState(false);

  const dropDownBoxTransition = useTransition(toggleDropDown, {
    from: {
      opacity: 0,
      transform: getTransform("from", dropDirection),
    },
    enter: {
      opacity: 1,
      transform: getTransform("enter",dropDirection)
    },
    leave: {
      opacity: 0,
      transform: getTransform("leave", dropDirection),
    },
    config: { duration: 300, easing: t => t * (2 - t)},
    // Adjust the duration as needed
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setToggleDropDown((t) => !t);
  };

  function getTransform(phase: "from" | "enter" | "leave", direction: string) {
    switch (direction) {
      case "left":
        return phase === "from"
          ? `translateX(20%)`
          : phase === "leave"
          ? `translateX(20%)`
          : ` translateX(0px) `;
      case "right":
        return phase === "from"
          ? ` translateX(-20%)`
          : phase === "leave"
          ? ` translateX(-20%)`
          : ` translateX(0px)`;
      case "top":
        return phase === "from"
          ? `  translateY(20%)`
          : phase === "leave"
          ? ` translateY(20%)`
          : ` translateY(0px)`;
      case "bottom":
        return phase === "from"
          ? ` translateY(-20%)`
          : phase === "leave"
          ? ` translateY(-20%)`
          : `translateY(0px)`;
      default:
        return ` translateY(0)`;
    }
  }
  const dropStyle = useMemo(() => {
    switch (dropDirection) {
      case "left":
        return { right: "100%", top: "0", marginRight: "16px" };
      case "right":
        return { left: "100%", top: "0", marginLeft: "16px" };
      case "top":
        return { left: "0", bottom: "100%", marginBottom: "16px" };
      case "bottom":
        return { right: "0", top: "100%", marginTop: "16px" };
      default:
        return { right: "0", top: "100%", marginTop: "16px" };
    }
  }, [dropDirection]);
  return (
    <div className={`relative flex z-100`}>
      <button className="Icon" onClick={handleToggle}>
        {children}
      </button>
      {dropDownBoxTransition((style, item) =>
        item ? (
          <animated.div
            style={{
              ...style,
              position: "absolute",
              ...dropStyle,
              boxSizing: "border-box",
            }}
            className="rounded-xl bg-secondary-1 shadow-xl size-fit p-2"
          >
            {dropDownList}
          </animated.div>
        ) : null
      )}
    </div>
  );
}
