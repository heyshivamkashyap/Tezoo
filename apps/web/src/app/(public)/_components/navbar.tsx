"use client";

import { useAppSelector } from "@/lib/redux/hooks";

export default function Navbar() {
  const { user, loading } = useAppSelector((state) => state.user);

  return (
    <nav>
      {loading ? (
        <div>Loading...</div>
      ) : user ? (
        <div>Welcome {user.fullName}</div>
      ) : (
        <button>Login</button>
      )}
    </nav>
  );
}
