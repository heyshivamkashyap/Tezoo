import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken");

  if (accessToken) {
    redirect("/");
  }

  return children;
}
