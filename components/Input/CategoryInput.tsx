import { getCategories } from "@actions/categoriesActions";
import toastError from "@components/Notification/Toaster";
import { Category } from "@lib/types";
import {
  faPlug,
  faPlus,
  faX,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

import { useRef, useState, useEffect } from "react";
import { useTransition, animated } from "@react-spring/web";

type CategoriesInputProps = {
  selectedCategories: Category[];
  onSelected: (category: Category) => void;
  onRemoved: (category: Category) => void;
};
export function CategoriesInput({
  selectedCategories,
  onSelected,
  onRemoved,
}: CategoriesInputProps) {
  const selectedList = useRef<HTMLUListElement>(null);
  const selectingList = useRef<HTMLUListElement>(null);
  const [mouseDownCoordX, setMouseDownCoordX] = useState(0);
  const [mouseDownCoordY, setMouseDownCoordY] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSelecting, setIsSelecting] = useState<Boolean>(false);
  const categoryItemListTransition = useTransition(selectedCategories, {
    keys: (item) => item._id,
    from: { opacity: 0, transform: "translateY(20px)" }, // Starting state
    enter: { opacity: 1, transform: "translateY(0px)" }, // End state when the item appears
    leave: { opacity: 0, transform: "translateY(20px)" }, // End state when the item disappears
    config: { duration: 300 }, // Transition duration
  });
  const selectBoxTransition = useTransition(isSelecting, {
    from: {
      clipPath: "polygon( 0% 17%,100% 17% , 100% 17% ,0% 17%)",
      transform: "translateY(-20%)",
      opacity: 1,
    },
    enter: [
      {
        opacity: 1,
        transform: "translateY(0px)",
        clipPath: "polygon(0% 0%, 100% 0%,100% 17% ,0% 17%)",
      },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
    ],
    leave: [
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 17%,0% 17%)" },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 17%,0% 17%)" },
      {
        opacity: 1,
        transform: "translateY(-30%)",
        clipPath: "polygon( 0% 17%,100% 17% , 100% 17% ,0% 17%)",
      },
    ],
    config: { duration: 300, easing: (t) => t * (2 - t) },
  });

  useEffect(() => {
    if (selectedList.current) {
      selectedList.current.scrollTo({
        left: selectedList.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selectedCategories]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      console.log("Error while fetching for categories: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categorySelectBox = (
    <>
      <div
        onClick={() => setIsSelecting(false)}
        className="bg-accent text-primary w-full h-[28px] text-center font-semibold"
      >
        ▲
      </div>
      <ul
        className="z-30 snap-y pointer-events-auto size-full flex flex-wrap justify-center p-2 gap-2  overflow-y-auto bg-secondary-2"
        ref={selectingList}
      >
        {categories.map((category) =>
          !selectedCategories.some((s) => s.name === category.name) ? (
            <li
              className="Cate_tag snap-start"
              key={category._id}
              onClick={() => onSelected(category)}
            >
              {category.name}
            </li>
          ) : null
        )}
      </ul>
    </>
  );

  return (
    <div className="relative">
      <ul
        onClick={() => setIsSelecting(true)}
        ref={selectedList}
        className={`Cate_box min-h-14 relative ${
          isSelecting ? "bg-secondary-2" : "bg-primary"
        }`}
      >
        {categoryItemListTransition((style, item) =>
          item ? (
            <animated.div
              style={{ ...style }}
              className="Cate_tag"
              key={item._id}
            >
              <span className="select-none">{item.name}</span>
              <FontAwesomeIcon
                icon={faX}
                size="sm"
                onClick={() => onRemoved(item)}
              />{" "}
            </animated.div>
          ) : null
        )}
        {!(selectedCategories.length > 0) && (
          <div className="absolute">click here to add categories...</div>
        )}
      </ul>
      {selectBoxTransition((style, item) =>
        item ? (
          <animated.div
            style={{
              ...style,
            }}
            className="origin-top z-10 border-4 border-accent w-full flex flex-col rounded-lg overflow-hidden items-center mt-2 h-[160px] absolute bg-primary"
          >
            {categorySelectBox}
          </animated.div>
        ) : null
      )}
    </div>
  );
}
