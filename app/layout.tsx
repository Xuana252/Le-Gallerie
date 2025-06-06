import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Nav from "@components/UI/Layout/Nav";
import Provider from "@context/Provider";
import ThemeManager from "@theme/ThemeManager";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "sonner";
import ChatBox from "@components/Chat/ChatBox";

export const metadata: Metadata = {
  title: "Le Gallerie",
  description: "Discover and Share Stunning Artwork",
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
    <html lang="en">
      <ThemeManager>
        <Provider>
          <div className="min-h-[100vh] flex flex-col">
            {/* Nav will appear on top  */}
            {children}
          </div>
          <Toaster richColors position="top-left" />
        </Provider>
      </ThemeManager>
    </html>
  );
}
