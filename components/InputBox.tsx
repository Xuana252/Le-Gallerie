"use client";
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";

type InputProps = {
  type: "Input"|"SearchBox",
  style?: React.CSSProperties,
  children?:string,
  
};
export default function InputBox({ type,style,children }: InputProps) {
  const searchBar = useRef<HTMLInputElement>(null);
  const [textValue, setTextValue] = useState("");
  const handleClearText = (e: React.MouseEvent) =>{
    e.preventDefault()
    setTextValue('')
  }
  return (
    <div
      className="Input_box"
      style={style}
      onClick={() => {
        searchBar.current ? searchBar.current.focus() : {};
      }}
    >
      {type === "SearchBox" && (
        <button className="size-8">
          <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" className="" />
        </button>
      )}
      <input
        ref={searchBar}
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        type="text"
        spellCheck='false'
        className="bg-transparent outline-none w-full px-2"
        placeholder={children?children:'add text here...'}
      />
      <div className="flex items-center size-8 justify-center ">
        {textValue !== "" && (
          <FontAwesomeIcon
            icon={faX}
            size="sm"
            onClick={handleClearText}
          />
        )}
      </div>
    </div>
  );
}
