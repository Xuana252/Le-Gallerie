"use client";
import { useTransition, animated } from "@react-spring/web";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";

type DropDownButtonProps = {
  dropDirection?: "left" | "right" | "top" | "bottom";
  children: ReactNode;
  hover?: boolean,
  dropDownList: ReactNode;
  Zindex?: number;
};
export default function DropDownButton({
  hover,
  children,
  dropDownList,
  dropDirection = "bottom",
  Zindex = 10,
}: DropDownButtonProps) {
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownBoxTransition = useTransition(toggleDropDown, {
    from: {
      opacity: 0,
      transform: getTransform("from", dropDirection),
    },
    enter: {
      opacity: 1,
      transform: getTransform("enter", dropDirection),
    },
    leave: {
      opacity: 0,
      transform: getTransform("leave", dropDirection),
    },
    config: { duration: 300, easing: (t) => t * (2 - t) },
    // Adjust the duration as needed
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setToggleDropDown((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(e.target as Node)&&
      !buttonRef.current?.contains(e.target as Node)
    ) {
      setToggleDropDown(false);
    }
  };

  useEffect(() => {
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        return ` translateY(0px)`;
    }
  }
  const dropStyle = useMemo(() => {
    switch (dropDirection) {
      case "left":
        return { right: "100%", top: "0" };
      case "right":
        return { left: "100%", top: "0" };
      case "top":
        return { left: "0", bottom: "100%" };
      case "bottom":
        return { right: "0", top: "100%" };
      default:
        return { right: "0", top: "100%" };
    }
  }, [dropDirection]);
  return (
    <div onMouseEnter={hover?handleToggle:()=>{}} onMouseLeave={hover?handleToggle:()=>{}} className={`relative flex z-${Zindex.toString()}`}>
      <button  onClick={handleToggle}  ref={buttonRef}>
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
               zIndex: Zindex + 1,
            }}
            ref={dropDownRef}
            className="rounded-xl bg-secondary-1/50 backdrop-blur-md border-[1.5px] border-accent shadow-2xl size-fit p-2"
          >
            {dropDownList}
          </animated.div>
        ) : null
      )}
    </div>
  );
}
