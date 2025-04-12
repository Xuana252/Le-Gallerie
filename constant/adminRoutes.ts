import { faChartPie, faClipboard, faComment, faFileImage, faGear, faIdCard, faImage, faImagePortrait, faImages, faUser, faUsers, faUserSlash } from "@node_modules/@fortawesome/free-solid-svg-icons";

export const adminRoutes = [
  {
    section: "General",
    items: [
      {
        path: "/admin",
        name: "Dashboard",
        icon: faChartPie,
        description: "Overall",
        subPath: ["Posts","Categories","Users","Reports","New Report"],
      },
    ],
  },
  {
    section: "Users",
    items: [
      {
        path: "/admin/users",
        name: "Users",
        icon: faUsers,
        description: "System users",
        subPath: [],
      },
      {
        path: "/admin/banned",
        name: "Banned Users",
        icon: faUserSlash,
        description: "Banned users",
        subPath: [],
      },
      {
        path: `/admin/reports/users/userId`,
        name: "User Detail",
        icon: faIdCard,
        description: "User Detail",
        subPath: [],
      },
    ],
    
  },
  {
    section: "Posts",
    items: [
      {
        path: "/admin/reports/posts/:id",
        name: "Post Detail",
        icon: faImages,
        description: "Post Detail",
        subPath: [],
      },
    ],
    
  },
  {
    section: "Reports",
    items: [
      {
        path: "/admin/reports/posts",
        name: "Posts",
        icon: faImage,
        description: "Manage Posts Reports",
        subPath: [],
      },
      {
        path: "/admin/reports/comments",
        name: "Comments",
        icon: faComment,
        description: "Manage Comments Reports",
        subPath: [],
      },
      {
        path: "/admin/reports/users",
        name: "Users",
        icon: faUser,
        description: "Manage Users Reports",
        subPath: [],
      },
    ],
  },
];
