import {
  faAngleDoubleUp,
  faAngleDown,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpring, animated } from "@react-spring/web";
import React, { ReactNode, useState } from "react";

export default function MultipleOptionsButton({
  children,
}: {
  children: ReactNode[];
}) {
  const [toggleDropDown, setToggleDropDown] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const dropDownAnimation = useSpring({
    transformOrigin: "top",
    display: "inline-block",
    transform: toggleDropDown ? "scaleY(1)" : "scaleY(0)",
    config: { duration: 500, easing: (t) => t * (2 - t) },
  });
  return (
    <div className="relative grid-cols-1">
      <div className="rounded-3xl overflow-hidden bg-secondary-2 z-20 relative flex flex-row h-9 items-center w-full">
        <div
          className="hover:bg-accent hover:text-primary h-full max-w-[100px] overflow-ellipsis whitespace-nowrap overflow-scroll no-scrollbar"
          onClick={() => setToggleDropDown(false)}
        >
          {children[selectedIndex]}
        </div>
        <button
          className=" h-full w-8 border-l-2 border-accent hover:bg-accent hover:text-primary text-accent"
          onClick={() => setToggleDropDown((prev) => !prev)}
        >
          {toggleDropDown ? (
            <FontAwesomeIcon icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} />
          )}
        </button>
      </div>
      <animated.div
        style={{
          ...dropDownAnimation,
          boxSizing: "border-box",
          position: "absolute",
          pointerEvents: toggleDropDown ? "auto" : "none",
        }}
        className={
          "z-10 w-full bg-secondary-1 rounded-b-2xl pt-7 -mt-6 shadow-md"
        }
      >
        <ul
          className={` max-h-[400px] w-full overflow-y-scroll no-scrollbar flex-col flex  items-center `}
        >
          {children.map((item, index) =>
            index !== selectedIndex ? (
              <div
                key={index}
                onClick={() => {
                  setToggleDropDown(false);
                  setSelectedIndex(index);
                }}
                className="w-full whitespace-nowrap"
              >
                {item}
              </div>
            ) : null
          )}
        </ul>
      </animated.div>
    </div>
  );
}
