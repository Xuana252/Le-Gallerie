"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toastMessage } from "@components/Notification/Toaster";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.banned) {
        signOut();
        toastMessage("Sorry, your account has been banned");
    }
  }, [session, status]);

  return <>{children}</>;
}
