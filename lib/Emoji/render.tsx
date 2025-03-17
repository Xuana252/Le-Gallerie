import { Reaction } from "@enum/reactionEnum";
import { faHeart } from "@node_modules/@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { Like } from "../types";

export const renderReaction = (reaction: Reaction | null) => {
  switch (reaction) {
    case "like":
      return <img src={`/icons/like.png`} alt="like" className="size-full" />;
    case "love":
      return <img src={`/icons/love.png`} alt="love" className="size-full" />;
    case "haha":
      return <img src={`/icons/haha.png`} alt="haha" className="size-full" />;
    case "sad":
      return <img src={`/icons/sad.png`} alt="sad" className="size-full" />;
    case "wow":
      return <img src={`/icons/wow.png`} alt="wow" className="size-full" />;
    case "angry":
      return <img src={`/icons/angry.png`} alt="angry" className="size-full" />;
    default:
      return <FontAwesomeIcon icon={faHeart} />;
  }
};

export const getTop3Reactions = (likes: Like[]) => {
  // Build a frequency map counting each reaction occurrence
  const frequencyMap = likes.reduce((acc: Record<Reaction, number>, like) => {
    const reaction = like.reaction as Reaction;
    acc[reaction] = (acc[reaction] || 0) + 1;
    return acc;
  }, {} as Record<Reaction, number>);

  // Convert the frequency map to an array of [reaction, count] pairs,
  // sort it descending by count, then extract the top three reaction keys.
  const top3 = Object.entries(frequencyMap)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3)
    .map(([reaction]) => reaction as Reaction);

  return top3;
};
