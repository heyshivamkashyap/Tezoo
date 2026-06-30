import { LocationManualDrawer } from "@/components/location/LocationManualDrawer";
import Navbar from "./_components/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <LocationManualDrawer />
    </>
  );
}
