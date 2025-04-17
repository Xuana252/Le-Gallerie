"use client";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import PostSection from "./section/PostSection";
import CommentSection from "./section/CommentSection";
import PostInteractionSection from "./section/PostInteractionSection";
import BestPostSection from "./section/BestPostSection";
import BestBuddySection from "./section/BestBuddySection";
import { useSession } from "@node_modules/next-auth/react";
import { fetchUserPost } from "@actions/postActions";
import { Like, Post, Comment, User } from "@lib/types";
import {
  fetchUserCommentLikes,
  fetchUserComments,
  fetchUserPostsComments,
} from "@actions/commentAction";
import { fetchUserLikes, fetchUserPostsLikes } from "@actions/likesAction";
import BiggestFansSection from "./section/BiggestFansSection";
import ReactionSection from "./section/ReactionSection";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "@node_modules/next/navigation";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { faChartSimple } from "@node_modules/@fortawesome/free-solid-svg-icons";
import ActivitiesHighlightsSection from "./section/ActivitiesHighlightsSection";
import FavoriteTopicsSection from "./section/FavoriteTopicsSection";
import { SubPathContext } from "@components/UI/Layout/SideBar";
import FollowsAndFriendsSection from "./section/FollowsAndFriendsSection";
import { fetchUserFollowers } from "@actions/followsActions";
import { fetchUserFriends } from "@actions/friendActions";

export default function UserActivities() {
  const { data: session } = useSession();
  const { subPath, setSubPath } = useContext(SubPathContext);
  const router = useRouter();
  const pathName = usePathname();

  const [animatedSections, setAnimatedSections] = useState<
    Record<string, boolean>
  >({});

  const [posts, setPosts] = useState<Post[]|null>(null);
  const [comments, setComments] = useState<Comment[]|null>(null);
  const [likes, setLikes] = useState<Like[]|null>(null);
  const [postsLikes, setPostsLikes] = useState<Like[]|null>(null);
  const [postsComments, setPostsComments] = useState<Comment[]|null>(null);
  const [commentLikes, setCommentLikes] = useState<Like[]|null>(null);
  const [followers, setFollowers] = useState<User[]|null>(null);
  const [following, setFollowing] = useState<User[]|null>(null);
  const [friends, setFriends] = useState<User[]|null>(null);

  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({
    "Total Post": null,
    "Total Reaction": null,
    "Total Comment": null,
    "Received Interactions": null,
    "Follows & Friends": null,
    "Biggest Fans": null,
    "Best Posts": null,
    "Activities Highlights": null,
    "Favorite Topics": null,
    "Best Buddy": null,
  });

  const sectionKeys = Object.keys(sectionsRef.current);

  const fetchPosts = async (id: string) => {
    const res = await fetchUserPost(id, 1, 0);
    setPosts(res.posts);
  };

  const fetchFollower = async (id: string) => {
    const res = await fetchUserFollowers(id);
    setFollowers(res?.users);
  };

  const fetchFollowing = async (id: string) => {
    const res = await fetchUserFollowers(id);
    setFollowing(res?.users);
  };
  const fetchFriends = async (id: string) => {
    const res = await fetchUserFriends(id);
    setFriends(res?.users);
  };
  const fetchComments = async (id: string) => {
    const res = await fetchUserComments(id);
    setComments(res.comments);
  };

  const fetchLikes = async (id: string) => {
    const res = await fetchUserLikes(id);
    setLikes(res.likes);
  };

  const fetchCommentLikes = async (id: string) => {
    const res = await fetchUserCommentLikes(id);
    setCommentLikes(res.commentLikes);
  };

  const fetchPostsLikes = async (id: string) => {
    const res = await fetchUserPostsLikes(id);
    setPostsLikes(res.likes);
  };

  const fetchPostsComments = async (id: string) => {
    const res = await fetchUserPostsComments(id);
    setPostsComments(res.comments);
  };

  const fetchData = async () => {
    const userId = session?.user.id;
    if (!userId) return;
    try {
      await Promise.all([
        fetchPosts(userId),
        fetchComments(userId),
        fetchLikes(userId),
        fetchCommentLikes(userId),
        fetchPostsLikes(userId),
        fetchPostsComments(userId),
        fetchFollower(userId),
        fetchFollowing(userId),
        fetchFriends(userId),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session?.user.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute("data-section");
            setAnimatedSections((prev) => ({
              ...prev,
              [section || ""]: true,
            }));
            if (section) {
              setSubPath({ path: section, scroll: false });
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    sectionKeys.forEach((key) => {
      const section = sectionsRef.current[key];
      if (section) {
        section.setAttribute("data-section", key);
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (subPath.path && subPath.scroll && sectionsRef.current[subPath.path]) {
      const section = sectionsRef.current[subPath.path];
      if (!section) return;

      section.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [subPath]);

  return (
    <section className="flex flex-col gap-20">
      <div className="text-3xl font-extrabold text-accent relative">
        <FontAwesomeIcon icon={faChartSimple} /> Your Activities
      </div>

      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Total Post"] = el;
        }}
      >
        <PostSection
          isVisible={animatedSections["Total Post"]}
          postCount={posts?.length??null}
        />
      </div>
      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Total Reaction"] = el;
        }}
      >
        <ReactionSection
          isVisible={animatedSections["Total Reaction"]}
          likesCount={likes?.length??null}
          commentLikesCount={commentLikes?.length??null}
        />
      </div>
      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Total Comment"] = el;
        }}
      >
        <CommentSection
          isVisible={animatedSections["Total Comment"]}
          commentCount={comments?.length??null}
        />
      </div>
      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Received Interactions"] = el;
        }}
      >
        <PostInteractionSection
          isVisible={animatedSections["Received Interactions"]}
          postsLikes={postsLikes}
          postsComments={postsComments}
        />
      </div>

      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Follows & Friends"] = el;
        }}
      >
        <FollowsAndFriendsSection
          isVisible={animatedSections["Follows & Friends"]}
          followers={followers}
          following={following}
          friends={friends}
        />
      </div>

      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Biggest Fans"] = el;
        }}
      >
        <BiggestFansSection
          isVisible={animatedSections["Biggest Fans"]}
          postsLikes={postsLikes}
          postsComments={postsComments}
        />
      </div>

      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Best Posts"] = el;
        }}
      >
        <BestPostSection
          isVisible={animatedSections["Best Posts"]}
          postsLikes={postsLikes}
          postsComments={postsComments}
          posts={posts}
        />
      </div>

      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Activities Highlights"] = el;
        }}
      >
        <ActivitiesHighlightsSection
          isVisible={animatedSections["Activities Highlights"]}
          likes={likes}
          comments={comments}
        />
      </div>

      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Favorite Topics"] = el;
        }}
      >
        <FavoriteTopicsSection
          isVisible={animatedSections["Favorite Topics"]}
          posts={posts}
        />
      </div>

      <div
        className="min-h-[50vh] "
        ref={(el) => {
          sectionsRef.current["Best Buddy"] = el;
        }}
      >
        <BestBuddySection isVisible={animatedSections["Best Buddy"]} />
      </div>

      <div className="text-justify w-fit mx-auto bg-gradient-to-b from-secondary-1/20 to-secondary-2/20 shadow-lg p-6 md:p-8 lg:p-10 text-accent">
        <div className="text-center text-xl font-bold text-accent/50">
          Hey <b className="text-accent">🚀{session?.user.name} 🚀!!</b>
        </div>
        <div className="mt-6 leading-relaxed text-lg">
          We just wanted to take a moment to{" "}
          <b className="text-red-500 font-semibold">thank you</b> for being part
          of <span className="text-red-500 font-semibold"> our community</span>
          !
          <br /> Your engagement{" "}
          <span className="text-red-500 font-semibold">
            means the world to us
          </span>
          , and we <i className="font-bold">love</i> seeing you
          <span className="text-red-500 font-semibold ">
            {" "}
            share, connect, and interact
          </span>{" "}
          with others.
        </div>
        <div className="mt-6 leading-relaxed text-lg">
          Keep <b className="text-red-500">exploring</b>,
          <b className="text-red-500"> posting</b>, and
          <b> making new connections</b>.
          <br /> We’re always working on making the experience
          <span className="text-red-500 font-semibold">
            {" "}
            even better for you! 💙
          </span>
        </div>
        <div className="mt-6 text-center text-xl font-semibold ">
          🥂Stay <span className="text-accent font-bold">awesome</span>, and see
          you around!🥂
        </div>
        <div className="text-center italic mt-8">
          - <span className="font-semibold">Le-Gallerie Team</span> -
        </div>
      </div>
    </section>
  );
}
