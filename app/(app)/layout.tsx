import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import Nav from "@components/Nav";
import Provider from "@context/Provider";
import ThemeManager from "@theme/ThemeManager";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Le Gallerie",
  description: "Generated by create next app",
  icons: {
    icon: '/images/Logo2.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
       <Provider>
        <ThemeManager>
          <div className="min-h-[100vh] h-fit flex flex-col">
            {/* Nav will appear on top  */}
            <Nav>
            <>{children}</>
            </Nav>
          </div>
          </ThemeManager>
       </Provider>
      </body>
    </html>
  );
}
