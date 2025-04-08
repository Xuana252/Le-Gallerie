import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeManager from "@theme/ThemeManager";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "sonner";
import PostProps from "@components/UI/Props/PostProps";
import SideBar from "@components/UI/Layout/SideBar";
import { adminRoutes } from "@constant/adminRoutes";

export const metadata: Metadata = {
  title: "Admin",
  description: "Discover and Share Stunning Artwork",
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function NoNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>
      <SideBar menu={adminRoutes}>{children}</SideBar>
    </div>
  );
}
