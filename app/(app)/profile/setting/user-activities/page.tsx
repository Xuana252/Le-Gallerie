"use client";
import React, { useEffect, useRef, useState } from "react";
import PostSection from "./section/PostSection";
import InteractionSection from "./section/InteractionSection";
import CommentSection from "./section/CommentSection";
import PostInteractionSection from "./section/PostInteractionSection";
import BestPostSection from "./section/BestPostSection";
import FrequentlyInteractedSection from "./section/FrequentlyInteractedSection";
import BestBuddySection from "./section/BestBuddySection";
import { useSession } from "@node_modules/next-auth/react";
import { fetchUserPost } from "@actions/postActions";
import { Like, Post, Comment } from "@lib/types";
import {
  fetchUserCommentLikes,
  fetchUserComments,
  fetchUserPostsComments,
} from "@actions/commentAction";
import { fetchUserLikes, fetchUserPostsLikes } from "@actions/likesAction";
import { userAgent } from "@node_modules/next/server";
import BiggestFansSection from "./section/BiggestFansSection";

export default function UserActivities() {
  const { data: session } = useSession();
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [animatedSections, setAnimatedSections] = useState<
    Record<number, boolean>
  >({});

  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [postsLikes, setPostsLikes] = useState<Like[]>([]);
  const [postsComments, setPostsComments] = useState<Comment[]>([]);
  const [commentLikes, setCommentLikes] = useState<Like[]>([]);

  const fetchPosts = async (id: string) => {
    fetchUserPost(id, 1, 0).then((res) => {
      setPosts(res.posts);
    });
  };

  const fetchComments = async (id: string) => {
    fetchUserComments(id).then((res) => {
      setComments(res.comments);
    });
  };

  const fetchLikes = async (id: string) => {
    fetchUserLikes(id).then((res) => {
      setLikes(res.likes);
    });
  };

  const fetchCommentLikes = async (id: string) => {
    fetchUserCommentLikes(id).then((res) => {
      setCommentLikes(res.commentLikes);
    });
  };

  const fetchPostsLikes = async (id: string) => {
    fetchUserPostsLikes(id).then((res) => {
      setPostsLikes(res.likes);
    });
  };

  const fetchPostsComments = async (id: string) => {
    fetchUserPostsComments(id).then((res) => {
      setPostsComments(res.comments);
    });
  };

  const fetchData = async () => {
    const userId = session?.user.id;
    if (!userId) return;
    await Promise.all([
      fetchPosts(userId),
      fetchComments(userId),
      fetchLikes(userId),
      fetchCommentLikes(userId),
      fetchPostsLikes(userId),
      fetchPostsComments(userId),
    ]);
  };

  useEffect(() => {
    fetchData();
  }, [session?.user.id]);

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
    <section className="flex flex-col gap-20  ">
      <div className="text-3xl font-extrabold text-primary">
        Your Activities
      </div>

      <div
        ref={(el) => {
          sectionsRef.current[0] = el;
        }}
      >
        <PostSection isVisible={animatedSections[0]} postCount={posts.length} />
      </div>
      <div
        ref={(el) => {
          sectionsRef.current[1] = el;
        }}
      >
        <InteractionSection
          isVisible={animatedSections[1]}
          likesCount={likes.length}
          commentLikesCount={commentLikes.length}
        />
      </div>
      <div
        ref={(el) => {
          sectionsRef.current[2] = el;
        }}
      >
        <CommentSection
          isVisible={animatedSections[2]}
          commentCount={comments.length}
        />
      </div>
      <div
        ref={(el) => {
          sectionsRef.current[3] = el;
        }}
      >
        <PostInteractionSection
          isVisible={animatedSections[3]}
          postsLikes={postsLikes}
          postsComments={postsComments}
        />
      </div>
      <div
        ref={(el) => {
          sectionsRef.current[4] = el;
        }}
      >
        <BiggestFansSection
          isVisible={animatedSections[4]}
          postsLikes={postsLikes}
          postsComments={postsComments}
        />
      </div>
      <div
        ref={(el) => {
          sectionsRef.current[5] = el;
        }}
      >
        <BestPostSection
          isVisible={animatedSections[5]}
          postsLikes={postsLikes}
          postsComments={postsComments}
          posts={posts}
        />
      </div>
      <div
        ref={(el) => {
          sectionsRef.current[6] = el;
        }}
      >
        <FrequentlyInteractedSection
          isVisible={animatedSections[6]}
          likes={likes}
          comments={comments}
        />
      </div>
      <div
        ref={(el) => {
          sectionsRef.current[7] = el;
        }}
      >
        <BestBuddySection isVisible={animatedSections[7]} />
      </div>
    </section>
  );
}
