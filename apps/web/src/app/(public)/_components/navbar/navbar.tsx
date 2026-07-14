"use client";

import Image from "next/image";
import Link from "next/link";

import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/redux/hooks";
import { NavLocation } from "./navbar-location";
import { NavSearch } from "./navbar-search";
import { Suspense } from "react";

export default function Navbar() {
  const { user, loading } = useAppSelector((state) => state.user);

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto px-4 lg:px-8">
        {/* Desktop */}
        <nav className="hidden h-20 items-center gap-5 md:flex">
          {/* Logo */}
          <Link href="/" className="hidden shrink-0 md:block">
            <Image
              src="/logo.png"
              alt="Tezoo"
              width={40}
              height={40}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Location */}
          <NavLocation />

          {/* Search */}
          <div className="flex-1">
            <Suspense>
              <NavSearch />
            </Suspense>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <Button variant="outline" size="lg" asChild>
                <Link
                  href={user ? "/profile" : "/login"}
                  aria-label={user ? "Profile" : "Login"}
                >
                  <User />
                  {user ? "Profile" : "Login"}
                </Link>
              </Button>
            )}

            <Button variant="outline" size="lg" asChild>
              <Link href="/cart" aria-label="Cart">
                <ShoppingCart />
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile */}
        <div className="space-y-3 py-3 md:hidden">
          {/* Top */}
          <div className="flex items-center justify-between">
            <NavLocation />

            {loading ? (
              <Skeleton className="size-9 rounded-full" />
            ) : (
              <Link
                href={user ? "/profile" : "/login"}
                aria-label={user ? "Profile" : "Login"}
              >
                <Button
                  size="icon-lg"
                  variant="outline"
                  className="rounded-full"
                >
                  <User className="size-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Search */}
          <Suspense>
            <NavSearch />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
