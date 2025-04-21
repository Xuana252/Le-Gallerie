"use client";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faLock,
  faMagnifyingGlass,
  faUnlock,
  faX,
} from "@fortawesome/free-solid-svg-icons";

type InputProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  styleVariant?: string;
  height?: "fit" | "full";
  showName?: boolean;
  onTextChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear?: () => void;
};
export default function TextAreaInput({
  name,
  style,
  children,
  value = "",
  height = "fit",
  styleVariant = "Input_box_variant_1",
  showName = true,
  onTextChange,
  onClear,
  ...rest
}: InputProps) {
  const inputBar = useRef<HTMLTextAreaElement>(null);

  const lineHeight = 28; // Adjust based on your textarea's CSS line height
  const maxRows = 3;

  // Auto-resize the textarea height up to maxRows
  useEffect(() => {
    if (inputBar.current && height === "fit") {
      inputBar.current.scrollTop = inputBar.current.scrollHeight;
      inputBar.current.style.height = "auto"; // Reset height
      const scrollHeight = inputBar.current.scrollHeight;
      const maxHeight = lineHeight * maxRows; // Calculate max height for 3 rows
      inputBar.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  const handleClearText = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClear) onClear();
    if (onTextChange) {
      onTextChange({
        target: { name: name ?? "", value: "" },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  };

  return (
    <label className="grow">
      {showName && name && (
        <p className="text-sm pl-4 text-accent/60 m-0">{name}</p>
      )}
      <div
        className={`${styleVariant}`}
        style={style}
        onClick={() => {
          inputBar.current ? inputBar.current.focus() : {};
        }}
      >
        <textarea
          ref={inputBar}
          name={name ? name : ""}
          value={value}
          onChange={(e) => onTextChange && onTextChange(e)}
          className={`bg-transparent no-scrollbar h-fit placeholder:text-inherit placeholder:opacity-50 outline-none w-full  px-2 resize-none `}
          rows={height === "fit" ? 1 : 5}
          placeholder={children as string}
          autoComplete="off"
          {...rest}
        />
        <div className="flex items-center size-8 justify-center Input_box_base cursor-pointer">
          {value !== "" && (
            <button onClick={handleClearText} className="text-sm"  tabIndex={-1}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          )}
        </div>
      </div>
    </label>
  );
}
