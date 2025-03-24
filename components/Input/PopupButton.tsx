import { faClose, faGripLines, faWindowClose, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPortal } from "react-dom";
import { useTransition, animated } from "@react-spring/web";
import React, { useState } from "react";
type PopupButtonProps = {
  children: React.ReactNode;
  popupItem: React.ReactNode;
};
export default function PopupButton({ children, popupItem }: PopupButtonProps) {
  const [popupVisibility, setPopupVisibility] = useState(false);
  const popupTransition = useTransition(popupVisibility, {
    from: { opacity: 0, transform: "scale(0.8)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.8)" },
    config: { tension: 300, friction: 20 },
  });
  return (
    <>
      <button onClick={() => setPopupVisibility((prev) => !prev)}>
        {children}
      </button>
      {popupTransition((styles, item) =>
        item ? (
          createPortal(<div className="fixed z-100 top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50 text-accent">
            <animated.div
              style={styles}
              className="flex flex-col size-fit rounded-xl bg-secondary-1/50 backdrop-blur-md border-[1px] border-accent p-2"
            >
              <button
                className="Icon_smaller self-end"
                onClick={() => setPopupVisibility(false)}
              >
                <FontAwesomeIcon icon={faGripLines} />
              </button>
              {popupItem}
            </animated.div>
          </div>,document.body)
        ) : null
      )}
    </>
  );
}
