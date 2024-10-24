"use client";
import React, { useEffect, useRef, useState } from "react";
import { type Category } from "@lib/types";
import { getCategories } from "@actions/categoriesActions";

type CategoryItemProps = {
  category: Category;
  selected?: boolean;
  onSelected: (category: Category) => void;
};
export function CategoryItem({
  category,
  selected = false,
  onSelected,
}: CategoryItemProps) {
  const [isSelected, setIsSelected] = useState<boolean>();
  const [mouseDown, setMouseDownCoordX] = useState(0);

  const handleCateSelect = (e: React.MouseEvent) => {
    if (e.clientX === mouseDown) {
      setIsSelected((prev) => !prev);
      onSelected(category);
    }
  };
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);
  return (
    <div
      onMouseDown={(e) => setMouseDownCoordX(e.clientX)}
      onMouseUp={handleCateSelect}
      className={`h-fit w-fit my-2 text-center rounded-full py-1 px-3 text-cate font-bold select-none ${
        !isSelected
          ? "bg-secondary-1 border-2 border-accent text-accent"
          : "bg-accent border-2 border-accent text-primary"
      } `}
    >
      <span className="whitespace-nowrap">{category.name}</span>
    </div>
  );
}

type CategoryBarProps = {
  selected?: Category[];
  onCategoriesChange: (categories: Category[]) => void;
};

export default function CategoryBar({
  selected = [],
  onCategoriesChange,
}: CategoryBarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startClientX, setStartClientX] = useState(0);
  const [selectedCategories, setSelectedCategories] =
    useState<Category[]>(selected);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const response = await getCategories();

    setCategories(response);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategories(selected);
  }, [selected.toString()]);

  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
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
    setIsDragging(false);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLUListElement>) => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleCateSelect = (category: Category) => {
    let updatedSelectedCategories = selectedCategories;
    if (selectedCategories.some((c) => c.name === category.name)) {
      updatedSelectedCategories = selectedCategories.filter(
        (c) => c.name !== category.name
      );
    } else {
      updatedSelectedCategories = [...selectedCategories, category];
    }
    setSelectedCategories(updatedSelectedCategories);
    onCategoriesChange(updatedSelectedCategories);
  };
  return (
    <div className="sticky top-[60px] z-10 bg-primary h-[50px] flex justify-center animate-fadeIn">
      <ul
        className="pointer-events-auto flex px-2 justify-start w-full h-fit gap-2 overflow-x-scroll no-scrollbar"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        ref={listRef}
      >
        {[
          ...selectedCategories, // Selected categories first
          ...categories.filter(
            (c) => !selectedCategories.some((sc) => sc.name === c.name)
          ), // Non-selected categories
        ].map((category) => (
          <CategoryItem
            key={category._id}
            category={category}
            selected={selectedCategories.some((c) => c.name === category.name)}
            onSelected={handleCateSelect}
          />
        ))}
      </ul>
    </div>
  );
}
