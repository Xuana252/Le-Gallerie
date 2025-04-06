import { toastMessage } from "@components/Notification/Toaster";
import { Post } from "@lib/types";
import {
  faFacebook,
  faFacebookMessenger,
  faInstagram,
  faTwitter,
} from "@node_modules/@fortawesome/free-brands-svg-icons";
import {
  faLink,
  faListDots,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React from "react";

export default function SharePostForm({ post }: { post: Post }) {
  const url = `${window.location.origin}/post/${post._id}`;

  const handleCopyLink = () => {
    if (!post._id) return;

    navigator.clipboard.writeText(url).then(() => {
      toastMessage("Link copied to clipboard!");
    });
  };

  const handleShareToFacebook = () => {
    if (!post._id) return;

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookShareUrl, "_blank");
  };

  const handleShareToTwitter = () => {
    if (!post._id) return;

    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      "Check out this photo!"
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterShareUrl, "_blank");
  };

  const handleShare = () => {
    if (!post._id) return;
    if (navigator.share) {
      // Use the Web Share API if available
      navigator
        .share({
          title: post.title,
          text: "check out this photo",
          url: url,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      toastMessage("Web Share API not supported in this browser.");
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div>Share</div>
      <div className="flex flex-row gap-2 items-center">
        <button
          className="Icon_small bg-secondary-1"
          onClick={handleCopyLink}
          title="copy link"
        >
          <FontAwesomeIcon icon={faLink} />
        </button>
        <button
          className="Icon_small bg-secondary-1"
          onClick={handleShareToFacebook}
          title="share to Facebook"
        >
          <img src="/providers/facebook.png" alt="facebook" />
        </button>
        <button
          className="Icon_small bg-secondary-1"
          onClick={handleShareToTwitter}
          title="share to X"
        >
          <img src="/providers/x.png" alt="x" />
        </button>
        <button className="Icon_small bg-secondary-1" onClick={handleShare} title="Others">
          <FontAwesomeIcon icon={faListDots} />
        </button>
      </div>

      <div>Or</div>
    </div>
  );
}
