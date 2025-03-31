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
    items: [
      {
        path: "/profile/setting",
        name: "Setting",
        icon: faGear,
        description: "General Setting",
        subPath:[]
      },
    ],
  },
  {
    section: "Personal Info",
    items: [
      {
        path: "/profile/setting/info",
        name: "Account Info",
        icon: faUser,
        description: "view your account information",
        subPath:[]
      },
      {
        path: "/profile/setting/edit-profile",
        name: "Edit Profile",
        icon: faUserGear,
        description: "Edit your personal information",
        subPath:[]
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
        subPath:[]
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
        subPath:[]
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
        description: "Take a quick look at your activities",
        subPath: [
          "Total Post",
          "Total Reaction",
          "Total Comment",
          "Received Interactions",
          "Follows & Friends",
          "Biggest Fans",
          "Best Posts",
          "Activities Highlights",
          "Favorite Topics",
          "Best Buddy",
        ],
      },
    ],
  },
];
