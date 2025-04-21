"use client";
import React, { MouseEventHandler, useRef, useState } from "react";
import InputBox from "./InputBox";
import { formatDate, formatDateForInput } from "@lib/dateFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCableCar, faClose, faX } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

export default function DateTimePicker({
  name,
  value,
  onChange,
  showName = true,
}: {
  name: string;
  value: string;
  onChange: (date: string) => void;
  showName?: boolean;
}) {
  const datePickerRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if(value)
      onChange(formatDate(new Date(value)));
    else 
      onChange("")
  };

  const handleClearText = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange("");
  };
  return (
    <label className="grow">
      {showName&&<p className="text-sm pl-4 text-accent/60 m-0">{name}</p>}
      <div className="Input_box_variant_1 items-center flex">
        <div className="relative flex flex-row items-center grow">
          <input
            ref={datePickerRef}
            type="date"
            readOnly={false}
            tabIndex={-1}
            onKeyDown={(e) => e.preventDefault()}
            className="bg-transparent text-accent w-full h-0 pointer-events-none outline-none opacity-0 absolute top-0 left-0 "
            onChange={handleDateChange}
            onClick={(e) => {
              e.preventDefault();
              datePickerRef.current && datePickerRef.current.showPicker();
            }}
          />
          <div className="text-accent grow px-2 text-sm">
            {value ? (
              value
            ) : (
              <span className="opacity-50 ">dd-mm-yyyy</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2  h-8 justify-end p-2 Input_box_base cursor-pointer">
          {value && (
            <button onClick={handleClearText} tabIndex={-1}>
              <FontAwesomeIcon icon={faClose} size="sm" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              datePickerRef.current && datePickerRef.current.showPicker();
            }}
          >
            <FontAwesomeIcon icon={faCalendar} />
          </button>
        </div>
      </div>
    </label>
  );
}
