import { LocationManualDrawer } from "@/components/location/LocationManualDrawer";
import Navbar from "./_components/navbar/navbar";
import { Suspense } from "react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      {children}
      <LocationManualDrawer />
    </>
  );
}
