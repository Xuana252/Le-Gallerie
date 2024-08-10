"use client";
import React, { useEffect, useRef, useState } from "react";
import { type Category } from "@lib/types";

export default function CategoryBar() {
  const listRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startClientX, setStartClientX] = useState(0);
  const [mouseDownCoordX, setMouseDownCoordX] = useState(0);
  const [mouseUpCoordX, setMouseUpCoordX] = useState(0);
  const [categories, setCategories] = useState([{
    id:1,
    name:'Food',
    state:false
  }]);

  const fetchCategories = async () => {
    const response = await fetch('/api/categories')
    const data = await response.json()

    setCategories(data)
  }

  useEffect(() => {
    fetchCategories()
  }, []);


  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    setMouseDownCoordX(e.clientX);
    setIsDragging(true);
    setStartClientX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    if (isDragging && listRef.current) {
      const scrollAmount = startClientX - e.clientX;
      listRef.current.scrollLeft += scrollAmount;
      setStartClientX(e.clientX);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLUListElement>) => {
    setMouseUpCoordX(e.clientX);
    setIsDragging(false);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLUListElement>) => {
    if (isDragging) {
      setIsDragging(false);
    }
  };
  // const onCateSelect = () => {
  //   if(mouseUpCoordX===mouseDownCoordX)
  //     onCateStateChange()
  // }
  return (
    <ul
      className="pointer-events-auto align-middle flex px-2 justify-start md:justify-center w-full h-fit bg-background gap-2 overflow-x-scroll no-scrollbar"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      ref={listRef}
    >
      {categories.map((category) => (
          <div
            className={`h-fit w-fit my-2 text-center rounded-full py-1 px-3 text-cate font-bold select-none transition ease-in-out duration-300 ${
              !category.state
                ? "bg-secondary-1 border-2 border-accent text-accent"
                : "bg-accent border-2 border-accent text-primary"
            }`}
            // onClick={() =>  onCateSelect(category.id)}
          >
            {category.name}
          </div>
        ))}
    </ul>
  );
}
