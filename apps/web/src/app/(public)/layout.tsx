import { LocationManualDrawer } from "@/components/location/LocationManualDrawer";
import Navbar from "./_components/navbar/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <LocationManualDrawer />
    </div>
  );
}
