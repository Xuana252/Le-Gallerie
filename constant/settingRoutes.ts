import {
  faGear,
  faUser,
  faUserGear,
  faKey,
  faUserLock,
  faChartSimple,
} from "@node_modules/@fortawesome/free-solid-svg-icons";

export const menuItems = [
  {
    section: "General",
    items: [{ path: "/profile/setting", name: "Setting", icon: faGear }],
  },
  {
    section: "Personal Info",
    items: [
      {
        path: "/profile/setting/info",
        name: "Account Info",
        icon: faUser,
        description: "view your account information",
      },
      {
        path: "/profile/setting/edit-profile",
        name: "Edit Profile",
        icon: faUserGear,
        description: "Edit your personal information",
      },
    ],
  },
  {
    section: "Security",
    items: [
      {
        path: "/profile/setting/change-password",
        name: " Change Password",
        icon: faKey,
        description: "Change your account password",
      },
    ],
  },
  {
    section: "User Interaction",
    items: [
      {
        path: "/profile/setting/block-list",
        name: "Block List",
        icon: faUserLock,
        description: "view, unblock blocked users",
      },
    ],
  },
  {
    section: "Analytics",
    items: [
      {
        path: "/profile/setting/user-activities",
        name: "User Activities",
        icon: faChartSimple,
      },
    ],
  },
];
