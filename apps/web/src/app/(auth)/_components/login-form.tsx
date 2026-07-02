"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@repo/utils";
import { loginUser } from "@/services/auth/auth.service";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchUser } from "@/features/user/user.slice";
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
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();

  const params = useSearchParams();
  const redirect = params.get("redirect");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  function onSubmitHandler(data: LoginSchemaType) {
    setError("");

    startTransition(async () => {
      try {
        const res = await loginUser(data);

        if (!res.data.success) {
          setError(res.data.message ?? "Login failed");
          return;
        }

        await dispatch(fetchUser()).unwrap();
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
          Welcome to Tezoo !
        </CardTitle>

        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-5">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>

                <Input
                  type="text"
                  placeholder="your@email.com"
                  {...register("identifier")}
                />

                {errors.identifier && (
                  <FieldError>{errors.identifier.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>

                <PasswordInput
                  placeholder="Enter password"
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
            Login
          </LoadingButton>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-muted-foreground w-full text-sm">
          Don&#39;t have an account?{" "}
          <Button asChild variant="link" className="ml-1">
            <Link
              href={redirect ? `/sign-up?redirect=${redirect}` : "/sign-up"}
            >
              Create Account
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
