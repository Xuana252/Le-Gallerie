"use client";
import React, { ReactNode, useState } from "react";

export default function ButtonWithTimeOut({
  className,
  timeOut,
  onClick,
  children,
}: {
  className: string;
  timeOut: number;
  onClick: any;
  children: ReactNode;
}) {
  const [isTimeOuted, setIsTimeOuted] = useState(false);
  const handleTimeOutClick = async () => {
    if (isTimeOuted) return;
    setIsTimeOuted(true);
    console.log("is Time out")
    await onClick();
    setTimeout(() => {
      setIsTimeOuted(false);
    }, timeOut);
  };
  return (
    <button
      className={`${className}`}
      onClick={handleTimeOutClick}
      disabled={isTimeOuted}
    >
      {children}
    </button>
  );
}
