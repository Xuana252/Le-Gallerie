"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { AuthGate } from "./AuthGate";

type ProviderProps = {
  children: React.ReactNode;
  session?: Session;
};

export default function Provider({ children, session }: ProviderProps) {
  return (
    <SessionProvider session={session}>
      <AuthGate>{children}</AuthGate>
    </SessionProvider>
  );
}
