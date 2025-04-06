import { PostPrivacy } from "@enum/postPrivacyEnum";
import {
  faEarthAsia,
  faUsers,
  faUserSecret,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

export const getRandomColor = () => {
  const colors = [
    "bg-gradient-to-t from-red-500 to-yellow-300",
    "bg-gradient-to-br from-blue-500 to-indigo-300",
    "bg-gradient-to-tl from-green-500 to-teal-300",
    "bg-gradient-to-t from-purple-500 to-pink-300",
    "bg-gradient-to-t from-yellow-500 to-orange-300",
    "bg-gradient-to-r from-gray-500 to-gray-300",
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
