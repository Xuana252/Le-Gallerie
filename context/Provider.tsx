"use client";


import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

type ProviderProps = {
  children: React.ReactNode;
  session?: Session;
};

export default function Provider({ children,session}: ProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
