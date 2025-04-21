import {
  faAngleUp,
  faCircle,
  faList,
  IconDefinition,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  useSpring,
  animated,
} from "@node_modules/@react-spring/web/dist/react-spring_web.modern";
import React, {
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export default function MultipleChoiceButton({
  name,
  option,
  onChange,
}: {
  name: string;
  option: { text: string; value: any; icon?: IconDefinition }[];
  onChange: Dispatch<SetStateAction<any>>;
}) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);


  const handleSelect = (index: number) => {
    setSelectedIndices((prevSelected) => {
      const alreadySelected = prevSelected.includes(index);

      // Toggle selection: remove if already selected, add if not
      const newSelected = alreadySelected
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index];

      // Call onChange with all selected values
      if (onChange) {
        const selectedValues = newSelected.map((i) => option[i].value);
        onChange(selectedValues);
      }
      return newSelected;
    });
  
  };

  return (
    <div
      tabIndex={0}
      className="relative font-mono h-fit"
    >
      <button
        className="flex flex-row items-center p-1 px-2 gap-1 rounded-full bg-secondary-1 shadow-sm "
        onClick={() => setIsSelecting((prev) => !prev)}
      >
        {name}{" "}
        <span className="min-w-4 rounded bg-accent text-xs text-primary font-bold text-center aspect-square">
          {selectedIndices.length}
        </span>
      </button>

      <div
        className={`mt-1 bg-secondary-1 border-2 border-accent gap-2 text-accent rounded-md w-fit absolute top-[100%] ${
          isSelecting ? "flex" : "hidden"
        } flex-wrap p-1 z-40 `}
      >
        {option.map((item, index) => (
          <button
            key={index}
            onMouseDown={() => handleSelect(index)}
            className={`${
              selectedIndices.includes(index)
                ? "bg-accent text-primary"
                : "bg-primary"
            } flex flex-row p-1 gap-2  text-xs  rounded-md items-center border border-accent`}
          >
            {item.text}
            <FontAwesomeIcon icon={item.icon ?? faCircle} className="ml-auto" />
          </button>
        ))}
      </div>
    </div>
  );
}
