"use client";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faLock,
  faMagnifyingGlass,
  faUnlock,
  faX,
} from "@fortawesome/free-solid-svg-icons";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  type: "Input" | "SearchBox" | "Password";
  styleVariant?: string;
  showName?: boolean;
  onTextChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
};
export default function InputBox({
  name,
  type,
  style,
  children,
  value,
  styleVariant = "Input_box_variant_1",
  showName = true,
  onTextChange,
  onKeyDown,
  onClear,
  ...rest
}: InputProps) {
  const inputBar = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };
  const handleClearText = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClear) onClear();
    if (onTextChange) {
      onTextChange({
        target: { name: name ?? "", value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
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
        {type === "SearchBox" && (
          <button className="size-8">
            <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" className="" />
          </button>
        )}
        <input
          ref={inputBar}
          name={name ? name : ""}
          value={value}
          onChange={(e) => onTextChange && onTextChange(e)}
          onKeyDown={onKeyDown}
          type={showPassword || type !== "Password" ? "text" : "password"}
          spellCheck="false"
          className={`bg-transparent placeholder:text-inherit placeholder:opacity-50 outline-none w-full px-2`}
          placeholder={children as string}
          autoComplete="off"
          {...rest}
        />
        <div className="flex items-center size-8 justify-center Input_box_base cursor-pointer">
          {type === "Password" ? (
            <button onClick={handleShowPassword} tabIndex={-1}>
              {showPassword ? (
                <FontAwesomeIcon icon={faUnlock} />
              ) : (
                <FontAwesomeIcon icon={faLock} />
              )}
            </button>
          ) : (
            value !== "" && (
              <button onClick={handleClearText} tabIndex={-1}>
                <FontAwesomeIcon icon={faClose} size="sm" />
              </button>
            )
          )}
        </div>
      </div>
    </label>
  );
}
