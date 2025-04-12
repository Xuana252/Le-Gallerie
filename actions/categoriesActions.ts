"use server";

import { headers, cookies } from "next/headers";

//Get Categories
export const getCategories = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/categories`
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return [];
};

export const fetchSystemCategoryData = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/admin/categories`,
    {
      headers: new Headers(headers()),
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
};
