// components/ThemeManager.tsx 
"use server";
import "@styles/globals.css";
import "@styles/theme.css";
import { cookies } from "next/headers";

export async function changeTheme(theme: string) {
  cookies().set("Theme", theme);
}

export async function getStoredTheme() {
  const storedTheme = cookies().get("Theme");
  return storedTheme
    ? storedTheme.value
    : "theme1";
}

export default async function ThemeManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getStoredTheme();

  return <body className={`${theme}`}>{children}</body>;
}
