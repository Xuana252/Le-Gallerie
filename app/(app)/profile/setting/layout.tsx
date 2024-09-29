import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import SideBar from "@components/UI/SideBar";


export const metadata: Metadata = {
  title: "Le Gallerie",
  description: "Generated by create next app",
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className={inter.className}>
        <SideBar>{children}</SideBar>
      </div>
  );
}
