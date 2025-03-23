"use client";
import React, { useState } from "react";
import PostSection from "./section/PostSection";
import InteractionSection from "./section/InteractionSection";
import CommentSection from "./section/CommentSection";
import PostInteractionSection from "./section/PostInteractionSection";
import BestPostSection from "./section/BestPostSection";

export default function UserActivities() {
  return (
    <section className="bg-gradient-to-b from-secondary-1/30 to-secondary-2 p-2 rounded-lg flex flex-col gap-10  ">
      <div className="text-3xl font-extrabold text-primary">
        Your Activities
      </div>

      <PostSection />
      <InteractionSection />

      <CommentSection />

      <PostInteractionSection />

      <BestPostSection/>
    </section>
  );
}
