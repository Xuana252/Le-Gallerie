import InputBox from "@components/Input/InputBox";
import {
  faAngleLeft,
  faAngleRight,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useEffect } from "react";

export default function Pagination({
  limit,
  count,
  current,
  onPageChange,
}: {
  limit: number;
  count: number;
  current: number;
  onPageChange: Dispatch<SetStateAction<number>>;
}) {
  const totalPages = Math.ceil(count / limit);

  const handleClick = (page: number) => {
    if (page !== current && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  useEffect(()=> {
    if(current>totalPages) 
      onPageChange(1)
  },[totalPages])

  const getPagesToDisplay = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (current > 4) {
      pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const displayPages = getPagesToDisplay();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = e.currentTarget.value.trim();
      const pageNum = parseInt(input);

      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum); // replace with your page change function
      }
    }
  };

  return (
    <div className="flex flex-wrap justify-center sm:justify-end  items-center gap-2 mt-4">
      <div className="flex items-center gap-2  text-sm justify-end">
        <button
          onClick={() => handleClick(current - 1)}
          disabled={current === 1}
          className="aspect-square w-7 p-1 rounded-full disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {displayPages.map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              onClick={() => handleClick(page)}
              className={`aspect-square w-7  rounded-full ${
                page === current
                  ? "bg-accent text-primary"
                  : "hover:bg-secondary-2"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 ">
              {page}
            </span>
          )
        )}
        <button
          onClick={() => handleClick(current + 1)}
          disabled={current === totalPages}
          className="aspect-square w-7  rounded-full disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <span>Go to:</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          className="Input_box_variant_1 px-2 text-center"
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
