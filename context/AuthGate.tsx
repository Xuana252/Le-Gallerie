"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toastMessage } from "@components/Notification/Toaster";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.banned) {
      toastMessage("Sorry, your account has been banned");
      signOut({ redirect: false }).then(() => {
        router.push("/sign-in");
      });
    }
  }, [session, status]);

  return <>{children}</>;
}
