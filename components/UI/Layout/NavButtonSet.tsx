import ChatButton from "@components/Chat/ChatButton";
import DropDownButton from "@components/Input/DropDownButton";
import NotificationButton from "@components/Notification/NotificationButton";
import {
  faImage,
  faCircleHalfStroke,
  faRightFromBracket,
  faEllipsisVertical,
  faPalette,
  faHammer,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "@node_modules/next/link";
import { usePathname } from "@node_modules/next/navigation";
import ThemeList from "@theme/ThemesList";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { UserRole } from "@enum/userRolesEnum";

export const ButtonSet = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const [windowSize, setSize] = useState(0);
  const [unseenMessageCount, setUnseenMessageCount] = useState(0);
  const [unseenNotificationCount, setUnseenNotificationCount] = useState(0);

  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setSize(window.innerWidth);
  }, []);

  const ButtonSet = (
    <>
      {session?.user && (
        <>
          {!pathName.startsWith("/admin") && (
            <Link href={"/post/create"}>
              <button className="Icon" title="Create post">
                <FontAwesomeIcon icon={faImage} />
              </button>
            </Link>
          )}
          <ChatButton returnUnseenCount={setUnseenMessageCount} />
          <NotificationButton returnUnseenCount={setUnseenNotificationCount} />
          {!pathName.startsWith("/admin") &&
            session.user.role?.includes(UserRole.ADMIN) && (
              <Link href={"/admin"}>
                <button className="Icon" title="Admin">
                  <FontAwesomeIcon icon={faHammer} />
                </button>
              </Link>
            )}
        </>
      )}
      <DropDownButton dropDownList={<ThemeList />}>
        <div className="Icon" title="Theme">
          <FontAwesomeIcon icon={faPalette} />
        </div>
      </DropDownButton>
      {pathName === "/profile" ? (
        <button className="Icon relative" onClick={() => signOut()}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      ) : (
        <UserProfileIcon currentUser={true} />
      )}
    </>
  );
  return (
    <>
      {windowSize >= 640 ? (
        <div className="Buttons_container">{ButtonSet}</div>
      ) : (
        <DropDownButton dropDownList={ButtonSet} Zindex={10}>
          <div className="Icon relative">
            <div
              className={`${
                unseenMessageCount + unseenNotificationCount > 0 ? "" : "hidden"
              } absolute top-1 right-1 rounded-full size-4 bg-primary text-accent text-xs font-bold `}
            >
              {unseenMessageCount + unseenNotificationCount}
            </div>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </div>
        </DropDownButton>
      )}
    </>
  );
};
