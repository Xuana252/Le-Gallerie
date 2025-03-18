"use client";
import { useTransition, animated, useSpring } from "@react-spring/web";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { setTimeout } from "timers/promises";

type DropDownButtonProps = {
  dropDirection?: "left" | "right" | "top" | "bottom";
  children: ReactNode;
  hover?: boolean;
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
  const springProps = useSpring({
    display: "flex",
    opacity: toggleDropDown ? 1 : 0,
    transform: getAnimation(toggleDropDown,dropDirection),
    config: { duration: 300, easing: (t) => t * (2 - t) },
  });
  const hoverTimeout = useRef<number|null >(null)
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

  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current); // Clear any existing timeout
    }
    setToggleDropDown(true); // Show the dropdown
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = window.setTimeout(() => {
      setToggleDropDown(false); // Hide the dropdown after 1 second
    }, 500);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(e.target as Node) &&
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

  function getAnimation(flag: boolean, direction: string) {
    switch (direction) {
      case "left":
        return flag ? "translateX(-20px)" : "translateX(20px)";
      case "right":
        return flag ? "translateX(20px)" : "translateX(-20px)";
      case "top":
        return flag ? "translateY(-20px)" : "translateY(20px)";
      case "bottom":
        return flag ? "translateY(20px)" : "translateY(-20px)";
      default:
        return ` translateY(0px)`;
    }
  }
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
    <div
      onMouseEnter={hover ? handleMouseEnter  : () => {}}
      onMouseLeave={hover ? handleMouseLeave  : () => {}}
      className={`relative flex z-${Zindex.toString()}`}
    >
      <button onClick={hover?()=>{}:() => setToggleDropDown((prev) => !prev)} ref={buttonRef}>
        {children}
      </button>
      <animated.div
        style={{
          ...springProps,
          ...dropStyle,
          boxSizing: "border-box",
          position: "absolute",
          pointerEvents: toggleDropDown ? "auto" : "none",
        }}
        ref={dropDownRef}
        className="rounded-xl bg-secondary-1/50 backdrop-blur-md border-[1.5px] border-accent shadow-2xl size-fit p-2 gap-2 flex flex-col"
      >
        {dropDownList}
      </animated.div>
    </div>
  );
}
