import { IconDefinition } from "@node_modules/@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useState } from "react";

export default function FilterButton({
  name,
  icon,
  option,
  onChange,
}: {
  name: string;
  icon: IconDefinition;
  option: { text: string; value: any; icon?: IconDefinition }[];
  onChange: Dispatch<SetStateAction<any>>;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelect = (index: number) => {
    setIsSelecting(false);
    setSelectedIndex(index);
    onChange && onChange(option[index].value);
  };

  return (
    <div  tabIndex={0} onBlur={() => setIsSelecting(false)} className="relative font-mono">
      <div className="flex flex-row items-center p-1 rounded-md bg-accent/20 border-secondary-1 border-2">
        {name && (
          <>
            <div
              className="text-sm max-w-[100px] whitespace-nowrap  overflow-hidden text-ellipsis"
              title={name}
            >
              {name}
            </div>{" "}
            {": "}
          </>
        )}
        <button
          className="ml-1 grid grid-cols-[1fr_auto] bg-secondary-2 rounded-md p-[2px] text-sm "
          onClick={() => setIsSelecting((prev) => !prev)}
        >
          <div className="p-[2px] items-center flex justify-center">
            {option[selectedIndex].text}
          </div>
          <div className="flex items-center justify-center aspect-square h-full rounded-md bg-accent text-secondary-1">
            <FontAwesomeIcon icon={option[selectedIndex].icon ?? icon} />
          </div>
        </button>
      </div>

      <div
        className={`mt-1 bg-secondary-1 border-2 border-accent text-accent rounded-md w-full absolute top-[100%] ${
          isSelecting ? "flex" : "hidden"
        } flex-col p-1 z-40 `}
      >
        {option.map((item, index) =>
          index !== selectedIndex ? (
            <div
              key={index}
              onMouseDown={() => handleSelect(index)}
              className=" grid grid-cols-2 text-right p-1 gap-2 text-xs hover:bg-accent hover:text-primary rounded-md items-center"
            >
              <span>{item.text}</span>
              <FontAwesomeIcon icon={option[index].icon ?? icon} />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
