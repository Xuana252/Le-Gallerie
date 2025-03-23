import { PostPrivacy } from "@enum/postPrivacyEnum";
import {
  faEarthAfrica,
  faEarthAsia,
  faUsers,
  faUserSecret,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

export const getRandomColor = () => {
  const colors = [
    "bg-gradient-to-b from-red-200 to-yellow-300",
    "bg-gradient-to-br from-blue-200 to-indigo-300",
    "bg-gradient-to-tl from-green-200 to-teal-300",
    "bg-gradient-to-t from-purple-200 to-pink-300",
    "bg-gradient-to-l from-yellow-200 to-orange-300",
    "bg-gradient-to-r from-gray-200 to-gray-300",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const renderPrivacy = (privacy: PostPrivacy) => {
  switch (privacy) {
    case PostPrivacy.PUBLIC:
      return <FontAwesomeIcon icon={faEarthAsia} />;
    case PostPrivacy.FRIEND:
      return <FontAwesomeIcon icon={faUsers} />;
    case PostPrivacy.PRIVATE:
      return <FontAwesomeIcon icon={faUserSecret} />;
  }
};
