import AuthGuard from "./_components/auth-guard";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
