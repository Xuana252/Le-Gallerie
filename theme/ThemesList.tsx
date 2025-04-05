"use client";
import React, { useState, useRef, useEffect } from "react";
import { changeTheme } from "@theme/ThemeManager";

export const themeCategories = [
  { name: "System", list: ["theme-light-elegant", "theme-dark-premium"] },
  {
    name: "Retro",
    list: ["theme-ocean-breeze", "theme-crimson-night", "theme-deep-space"],
  },
  {
    name: "Vintage",
    list: [
      "theme-earthy-warm",
      "theme-sunset-glow",
      "theme-spring-garden",
      "theme-coastal-vibes",
    ],
  },
  {
    name: "Space",
    list: [
      "theme-midnight-ruby",
      "theme-dark-inferno",
      "theme-modern-contrast",
      "theme-vibrant-violet",
    ],
  },
  {
    name: "Pastel",
    list: ["theme-peach-dream", "theme-soft-blossom", "theme-spring-breeze"],
  },
  {
    name: "Spiderman",
    list: [
      "theme-spiderman-classic",
      "theme-spiderman-miles",
      "theme-spiderman-2099",
      "theme-spiderman-symbiote",
      "theme-spiderman-gwen",
    ],
  },
  {
    name: "Gaming",
    list: [
      "theme-playstation",
      "theme-legend-of-zelda",
      "theme-animal-crossing",
      "theme-red-dead-redemption",
      "theme-cyberpunk2077",
      "theme-max-caulfield"
    ],
  },
];

export default function ThemeList() {
  const themeList = useRef<HTMLUListElement>(null);



  return (
    <div className="relative">
      <ul className={`Theme_list `} ref={themeList}>
        {themeCategories.map((category, index) => (
          <div key={index} className="w-full">
            <div className="sticky top-0 bg-accent text-primary my-2 font-bold px-2 pb-1">
              {category.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {category.list.map((theme) => (
                <div
                  key={theme}
                  className={`Theme_item  ${theme}`}
                  onClick={async () => {
                    changeTheme(theme);
                  }}
                  title={theme.replace(/-/g," ").replace("theme ","")}
                >
                  <div className={` bg-primary`}></div>
                  <div className={` bg-secondary-1`}></div>
                  <div className={` bg-secondary-2`}></div>
                  <div className={` bg-accent`}></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
