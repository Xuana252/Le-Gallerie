import { PostPrivacy } from "@enum/postPrivacyEnum";
import {
  faEarthAfrica,
  faEarthAsia,
  faUsers,
  faUserSecret,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

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
