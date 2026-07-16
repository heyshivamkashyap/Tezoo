"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { UserRole } from "@/features/user/user.types";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  loginRedirect?: string;
  unauthorizedRedirect?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  loginRedirect = "/login",
  unauthorizedRedirect = "/",
}: RoleGuardProps) {
  const { user, loading } = useAppSelector((state) => state.user);
  const router = useRouter();

  const hasAccess =
    !!user && allowedRoles.some((role) => user.roles?.includes(role));

  useEffect(() => {
    if (loading) return;

    if (!user?._id) {
      router.replace(loginRedirect);
      return;
    }

    if (!hasAccess) {
      router.replace(unauthorizedRedirect);
    }
  }, [loading, user, hasAccess, loginRedirect, unauthorizedRedirect, router]);

  if (loading) return null;

  if (!user?._id || !hasAccess) {
    router.replace(loginRedirect);
  }

  return <>{children}</>;
}
