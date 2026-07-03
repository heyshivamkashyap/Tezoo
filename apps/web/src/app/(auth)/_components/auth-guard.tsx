"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?._id) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return null;
  }

  if (user?._id) {
    return null;
  }

  return <>{children}</>;
}
