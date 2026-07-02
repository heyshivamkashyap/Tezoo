import { Metadata } from "next";
import RegisterForm from "../_components/register-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function SingInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <RegisterForm />
    </main>
  );
}
