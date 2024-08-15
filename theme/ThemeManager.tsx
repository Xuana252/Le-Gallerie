// components/ThemeManager.tsx
"use client";

import { useEffect } from "react";

const ThemeManager = () => {
  useEffect(() => {
    const storedTheme = localStorage.getItem("Theme");
    if (storedTheme) {
      document.documentElement.className = storedTheme;
    } else {
      document.documentElement.className = "light"; // Default theme
    }
  }, []);

  return null; // This component does not render anything
};

export default ThemeManager;
