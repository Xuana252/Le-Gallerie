"use client";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";

type InputProps = {
  type: "Input"|"SearchBox",
  style?: React.CSSProperties,
  children?:string,
  value?:string,
  name?:string,
  onTextChange?:(e: React.ChangeEvent<HTMLInputElement>) => void
  onClear?:()=>void
};
export default function InputBox({name, type,style,children,value,onTextChange,onClear }: InputProps) {
  const inputBar = useRef<HTMLInputElement>(null); 
  const handleClearText = (e: React.MouseEvent) =>{
    e.preventDefault()
    onClear&&onClear()
    if(inputBar.current) {
      inputBar.current.value=''
      onTextChange && onTextChange({ target: { name: inputBar.current.name, value: '' } } as React.ChangeEvent<HTMLInputElement>);
    } 
  }
  return (
    <div
      className="Input_box"
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
        name={name?name:''}
        value={value}
        onChange={(e) =>onTextChange&& onTextChange(e)}
        type="text"
        spellCheck='false'
        className="bg-transparent outline-none w-full px-2"
        placeholder={children?children:'add text here...'}
      />
      <div className="flex items-center size-8 justify-center ">
        {value !== "" && (
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
