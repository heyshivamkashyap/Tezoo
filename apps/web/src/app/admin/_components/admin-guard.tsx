"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAppSelector((state) => state.user);
  const router = useRouter();

  const isAdmin = user?.roles?.includes("admin");

  useEffect(() => {
    if (loading) return;

    // Not logged in
    if (!user?._id) {
      router.replace("/login");
      return;
    }

    // Logged in but not an admin
    if (!isAdmin) {
      router.replace("/");
    }
  }, [loading, user, isAdmin, router]);

  if (loading) {
    return null;
  }

  if (!user?._id || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
