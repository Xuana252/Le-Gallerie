"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="font-AppLogo text-[3em] select-none text-secondary-1">
        AppLogo
      </div>
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg italic">
        The page you are looking for does not exist.
      </p>
      <button className="Button_variant_1 mt-4" onClick={() => router.back()}>
        Go back
      </button>
    </div>
  );
}
