import {
  faAngleDoubleUp,
  faAngleDown,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpring, animated } from "@react-spring/web";
import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export default function MultipleOptionsButton({
  children,
}: {
  children: ReactNode[];
}) {
  const [toggleDropDown, setToggleDropDown] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const selectedWidth =
      selectedRef.current?.getBoundingClientRect().width || 0;
    const dropdownWidth =
      dropdownRef.current?.getBoundingClientRect().width || 0;
    setMaxWidth(Math.max(selectedWidth, dropdownWidth));
  }, [children, selectedIndex, toggleDropDown]);

  const dropDownAnimation = useSpring({
    transformOrigin: "top",
    display: "inline-block",
    opacity: toggleDropDown ? "100%" : "0%",
    transform: toggleDropDown ? "scaleY(1)" : "scaleY(0)",
    config: { duration: 200, easing: (t) => t * (2 - t) },
  });
  return (
    <div className="relative" style={{ width: maxWidth || "auto" }}>
      <div
        ref={selectedRef}
        className="rounded-lg w-auto bg-secondary-2 overflow-hidden z-20 relative flex flex-row h-9 items-center min-w-fit"
        style={{ width: maxWidth || "auto" }}
      >
        <div
          className="hover:bg-accent hover:text-primary h-full w-full flex flex-row items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            setToggleDropDown(false);
          }}
        >
          {children[selectedIndex]}
        </div>
        <button
          className=" h-full w-8 border-l-2 aspect-square border-accent hover:bg-accent hover:text-primary text-accent"
          onClick={(e) => {
            e.preventDefault();
            setToggleDropDown((prev) => !prev);
          }}
        >
          <FontAwesomeIcon
            icon={faAngleUp}
            className={`${
              toggleDropDown ? "rotate-180" : "rotate-0"
            } transition-all duration-200 ease-in-out`}
          />
        </button>
      </div>
      <animated.div
        ref={dropdownRef}
        style={{
          ...dropDownAnimation,
          boxSizing: "border-box",
          position: "absolute",
          pointerEvents: toggleDropDown ? "auto" : "none",
          width: maxWidth || "auto",
        }}
        className={
          "z-10 bg-secondary-1 rounded-b-lg pt-7 -mt-6 shadow-md min-w-fit"
        }
      >
        <ul
          className={` max-h-[400px] w-full overflow-y-scroll no-scrollbar flex-col flex  items-center p-1 `}
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
