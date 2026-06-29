import { LocationManualDrawer } from "@/components/location/LocationManualDrawer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <LocationManualDrawer />
    </>
  );
}
