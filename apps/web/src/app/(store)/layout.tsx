import RoleGuard from "@/components/role-guard";

export default function PublicStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={["store_manager"]}
      loginRedirect="/login?redirect=/create-store"
      unauthorizedRedirect="/"
    >
      {children}
    </RoleGuard>
  );
}
