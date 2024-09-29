"use client";
import React, { MouseEventHandler, useRef, useState } from "react";
import InputBox from "./InputBox";
import { formatDate, formatDateForInput } from "@lib/dateFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCableCar, faX } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

export default function DateTimePicker({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (date: string) => void;
}) {
  const datePickerRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(formatDate(new Date(value)));
  };

  const handleClearText = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange("");
  };
  return (
    <label className="grow">
      <p className="text-sm pl-4 text-accent/60 m-0">{name}</p>
      <div className="Input_box_variant_1 ">
        <div className="relative flex flex-row grow">
          <input
            ref={datePickerRef}
            type="date"
            readOnly={false}
            tabIndex={-1}
            onKeyDown={(e) => e.preventDefault()}
            className="bg-transparent text-accent w-full pointer-events-none outline-none opacity-0 absolute top-0 left-0"
            onChange={handleDateChange}
          />
          <div className="text-accent grow px-2">
            {value ? value : "dd-mm-yyyy"}
          </div>
          <button
            className=""
            onClick={(e) => {
              e.preventDefault();
              datePickerRef.current && datePickerRef.current.showPicker();
            }}
          >
            <FontAwesomeIcon icon={faCalendar} />
          </button>
        </div>
        <div className="flex items-center size-8 justify-center Input_box_base cursor-pointer">
          {value && (
            <button onClick={handleClearText} tabIndex={-1}>
              <FontAwesomeIcon icon={faX} size="sm" />
            </button>
          )}
        </div>
      </div>
    </label>
  );
}
