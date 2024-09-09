import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
type PopupButtonProps = {
  children: React.ReactNode;
  popupItem: React.ReactNode;
};
export default function PopupButton({ children, popupItem }: PopupButtonProps) {
  const [popupVisibility, setPopupVisibility] = useState(false);
  return (
    <>
      <button onClick={()=>setPopupVisibility(prev=>!prev)}>{children}</button>
      {popupVisibility && (
        <div className="fixed z-50 top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center ">
          <div className="flex flex-col size-fit rounded-xl bg-secondary-1/50 backdrop-blur-md border-[1px] border-accent p-2">
            <button className="Icon_small self-end" onClick={()=>setPopupVisibility(false)}>
                <FontAwesomeIcon icon={faX} />
            </button>
            {popupItem}
          </div>
        </div>
      )}
    </>
  );
}
