// components/ThemeManager.tsx 
"use server";
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

  return <div className={`${theme}`}>{children}</div>;
}
