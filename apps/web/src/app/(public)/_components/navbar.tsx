"use client";

import { LogOutConfirm } from "@/app/(auth)/_components/log-out-confirm";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/redux/hooks";
import { useState } from "react";

export default function Navbar() {
  const { user, loading } = useAppSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between">
      {loading ? (
        <div>Loading...</div>
      ) : user ? (
        <div>Welcome {user.fullName}</div>
      ) : (
        <button>Login</button>
      )}

      <Button onClick={() => setIsOpen(!isOpen)}>Logout</Button>
      <LogOutConfirm open={isOpen} onOpenChange={setIsOpen} />
    </nav>
  );
}
