"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { registerSchema, RegisterSchemaType } from "@repo/utils";
import { registerUser } from "@/services/auth/auth.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { LoadingButton } from "@/components/ui/loading-btn";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  function onSubmitHandler(data: RegisterSchemaType) {
    setError("");

    startTransition(async () => {
      try {
        const res = await registerUser(data);

        if (!res.data.success) {
          setError(res.data.message ?? "Registration failed");
          return;
        }

        router.replace(redirect ?? "/");
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <Card className="w-full max-w-md border">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
          <Image src="/logo.png" alt="Logo" width={30} height={30} />
          Create your account
        </CardTitle>

        <CardDescription>
          Join Tezoo and start shopping in minutes.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-5">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Full Name</FieldLabel>

                <Input placeholder="John Doe" {...register("fullName")} />

                {errors.fullName && (
                  <FieldError>{errors.fullName.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>

                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                />

                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>

                <PasswordInput
                  placeholder="Enter a password"
                  {...register("password")}
                />

                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          {error && (
            <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-start gap-2 rounded-md border p-3 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <LoadingButton loading={isPending} type="submit" className="w-full">
            Create Account
          </LoadingButton>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-muted-foreground w-full text-sm">
          Already have an account?
          <Button asChild variant="link" className="ml-1 px-1">
            <Link href={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Log In
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
