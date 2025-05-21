import { fetchSystemCategoryData } from "@actions/categoriesActions";
import Chart from "@components/UI/Layout/Chart";
import { CategoryData, CategoryDataItem } from "@lib/types";
import {
  faCalendar,
  faTags,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function CategorySection() {
  const [data, setData] = useState<CategoryData | null>(null);

  const fetchCategoryData = async () => {
    const res = await fetchSystemCategoryData();

    setData(res);
  };

  const sampleCategories = [
    { categoryId: "1", name: "Technology" },
    { categoryId: "2", name: "Health" },
    { categoryId: "3", name: "Education" },
    { categoryId: "4", name: "Travel" },
    { categoryId: "5", name: "Food" },
    { categoryId: "6", name: "Finance" },
    { categoryId: "7", name: "Entertainment" },
    { categoryId: "8", name: "Science" },
    { categoryId: "9", name: "Lifestyle" },
    { categoryId: "10", name: "Gaming" },
    { categoryId: "11", name: "Art" },
    { categoryId: "12", name: "Politics" },
    { categoryId: "13", name: "Fashion" },
    { categoryId: "14", name: "Sports" },
    { categoryId: "15", name: "Business" },
  ];

  function generateMockCategoryData(): CategoryData {
    const category: CategoryDataItem[] = sampleCategories.map((cat) => ({
      categoryId: cat.categoryId,
      name: cat.name,
      count: Math.floor(Math.random() * 1000), // total count
    }));

    const thisMonth: CategoryDataItem[] = sampleCategories.map((cat) => ({
      categoryId: cat.categoryId,
      name: cat.name,
      count: Math.floor(Math.random() * 200), // current month count
    }));

    return {
      category,
      thisMonth,
    };
  }

  useEffect(() => {
    fetchCategoryData();
    // setData(generateMockCategoryData());
  }, []);
  return (
    <div className="panel flex flex-col gap-2 ">
      <div className="font-bold text-xl panel">
        <FontAwesomeIcon icon={faTags} /> Categories
      </div>
      <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[60%_auto] ">
        <Chart
          type={"Pie"}
          name={
            <div>
              <FontAwesomeIcon icon={faCalendar} /> Monthly Categories
            </div>
          }
          data={
            data?.thisMonth.slice(0, 10)?.map((item) => {
              return {
                id: `${item.name}`,
                value: { category: item.count },
              };
            }) || null
          }
        />
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto grow    panel_2">
          <div>
            <FontAwesomeIcon icon={faTags} /> All time
          </div>
          <div className=" overflow-y-auto flex flex-wrap gap-2 font-mono">
            {data?.category
              ?.sort((a, b) => b.count - a.count)
              .map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-primary px-2 rounded-full max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
                  title={item.name}
                >
                  {item.count} {item.name}
                </div>
              )) ||
              Array.from({ length: 10 }).map((item, index) => (
                <div
                  key={index}
                  className="border-2 text-transparent animate-pulse border-primary bg-primary px-2 rounded-full"
                >
                  Category
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
