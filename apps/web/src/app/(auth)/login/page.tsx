import { Metadata } from "next";
import LoginForm from "../_components/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function SingInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </main>
  );
}
