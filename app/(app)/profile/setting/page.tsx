import { faKey, faUser, faUserGear, faUserLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Setting() {
  const menuItems = [
    {
      path: "/profile/setting/info",
      name: "Account Info",
      description: "view your account information",
      icon: faUser,
    },
    {
      path: "/profile/setting/edit-profile",
      name: "Edit Profile",
      description: "Edit your personal information",
      icon: faUserGear,
    },
    {
      path: "/profile/setting/block-list",
      name: "Block List",
      description: "view, unblock blocked users",
      icon: faUserLock,
    },
    {
      path: "/profile/setting/change-password",
      name: " Change Password",
      description: "Change your account password",
      icon: faKey,
    },
  ];
  return (
    <section>
      <div className="w-full text-center text-3xl font-bold text-accent">
        Setting
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
        {menuItems.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className="w-full bg-secondary-2/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-start gap-3 hover:scale-105 transition-transform duration-200"
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="text-4xl text-accent/70"
            />
            <span className="font-bold text-accent text-xl">{item.name}</span>
            <p className="text-accent/80 text-base">{item.description}</p>
          </Link>
        ))}
      </ul>
    </section>
  );
}
