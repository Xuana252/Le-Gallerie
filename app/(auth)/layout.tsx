
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeManager from "@theme/ThemeManager";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "sonner";
import PostProps from "@components/UI/Props/PostProps";

export const metadata: Metadata = {
  title: "Authentication",
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
  const pos = [
    { left: "-5%", top: "20%" },
    { left: "-5%", top: "90%" },
    { left: "80%", top: "85%" },
    { left: "40%", top: "50%" },
    { left: "10%", top: "-20%" },
    { left: "45%", top: "90%" },
    { left: "95%", top: "-10%" },
    { left: "30%", top: "20%" },
    { left: "70%", top: "40%" },
    { left: "50%", top: "-20%" },
    { left: "20%", top: "80%" },
    { left: "90%", top: "30%" },
  ];
  return (
    <div
      className={`h-[100vh] overflow-hidden flex relative bg-gradient-to-bl from-secondary-2 to-secondary-1`}
    >
      <div className="size-full absolute light_bottom_right"></div>
      <div className="size-full absolute bloom_up"></div>
      <div className="absolute size-full blur-sm">
        {pos.map((pos, i) => (
          <div
            key={i}
            className="w-[20%] min-w-[150px]  max-w-[200px] aspect-[2/3] absolute"
            style={{ left: pos.left, top: pos.top }}
          >
            <PostProps />
          </div>
        ))}
      </div>
      <div className="size-full z-50 flex">{children}</div>
    </div>
  );
}
