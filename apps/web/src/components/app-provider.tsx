"use client";

import ReduxProvider from "@/lib/redux/provider";
import { useEffect } from "react";
import { fetchUser } from "@/features/user/user.slice";
import { useAppDispatch } from "@/lib/redux/hooks";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <AppInitializer />
      {children}
    </ReduxProvider>
  );
}

function AppInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return null;
}
