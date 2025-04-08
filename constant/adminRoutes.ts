import { faChartPie, faClipboard, faComment, faGear, faIdCard, faImage, faImagePortrait, faUser, faUsers } from "@node_modules/@fortawesome/free-solid-svg-icons";

export const adminRoutes = [
  {
    section: "General",
    items: [
      {
        path: "/admin",
        name: "Dashboard",
        icon: faChartPie,
        description: "Overall",
        subPath: [],
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
    ],
    
  },
  {
    section: "Reports",
    items: [
      {
        path: "/admin/reports/posts",
        name: "Posts",
        icon: faImage,
        description: "Overall",
        subPath: [],
      },
      {
        path: "/admin/reports/comments",
        name: "Comments",
        icon: faComment,
        description: "Overall",
        subPath: [],
      },
      {
        path: "/admin/reports/users",
        name: "Users",
        icon: faUser,
        description: "Overall",
        subPath: [],
      },
    ],
  },
];
