"use client";
import React, { useEffect, useRef, useState } from "react";
import PostSection from "./section/PostSection";
import InteractionSection from "./section/InteractionSection";
import CommentSection from "./section/CommentSection";
import PostInteractionSection from "./section/PostInteractionSection";
import BestPostSection from "./section/BestPostSection";
import FrequentlyInteractedSection from "./section/FrequentlyInteractedSection";

export default function UserActivities() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [animatedSections, setAnimatedSections] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const sections = sectionsRef.current;
    if (!sections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setAnimatedSections((prev) => ({ ...prev, [index]: true }));
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    sectionsRef.current.forEach((section, index) => {
      if (section) {
        section.dataset.index = index.toString();
        observer.observe(section);
      }
    });

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, []);

  return (
    <section className="bg-gradient-to-b from-secondary-1/30  to-secondary-2 p-2 rounded-lg flex flex-col gap-20  ">
      <div className="text-3xl font-extrabold text-primary">
        Your Activities
      </div>

      {[
        PostSection,
        InteractionSection,
        CommentSection,
        FrequentlyInteractedSection,
        PostInteractionSection,
        BestPostSection,
      ].map((SectionComponent, index) => (
        <div
          key={index}
          ref={(el) => {
            sectionsRef.current[index] = el;
          }}
          className={`transition-opacity duration-500 ${
            animatedSections[index] ? "opacity-100" : "opacity-0"
          }`}
        >
          <SectionComponent isVisible={animatedSections[index]} />
        </div>
      ))}
    </section>
  );
}
