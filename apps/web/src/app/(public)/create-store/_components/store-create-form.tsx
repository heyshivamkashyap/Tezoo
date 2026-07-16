"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStoreSchema, CreateStoreSchemaType } from "@repo/utils";
import { AlertCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LoadingButton } from "@/components/ui/loading-btn";
import { createStore } from "@/services/store/store.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateStoreForm() {
  const [isGettingLocation, setIsGettingLocation] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateStoreSchemaType>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      geoLocation: {
        type: "Point",
        coordinates: [0, 0], // [lng, lat]
      },
      isOpen: true,
    },
  });

  const isOpen = watch("isOpen");

  function onSubmitHandler(data: CreateStoreSchemaType) {
    setError("");

    startTransition(async () => {
      try {
        const res = await createStore(data);

        if (!res.data.success) {
          setError(res.data.message ?? "Failed to create store");
          return;
        }

        toast.success(res.data.message);
        router.refresh();
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setValue(
          "geoLocation",
          {
            type: "Point",
            coordinates: [longitude, latitude], // MongoDB GeoJSON -> [lng, lat]
          },
          { shouldValidate: true },
        );

        setIsGettingLocation(false);
      },
      (err) => {
        setError(err.message || "Unable to fetch your location.");
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, [setValue]);

  return (
    <Card className="w-full max-w-2xl border">
      <CardHeader>
        <CardTitle>Create Store</CardTitle>
        <CardDescription>
          Fill in the details below to create a new store.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-5">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Store Name</FieldLabel>

                <Input placeholder="Enter store name" {...register("name")} />

                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Store Phone Number</FieldLabel>

                <Input placeholder="9876543210" {...register("phone")} />

                {errors.phone && (
                  <FieldError>{errors.phone.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Store Email</FieldLabel>

                <Input
                  type="email"
                  placeholder="store@example.com"
                  {...register("email")}
                />

                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div>
                  <FieldLabel>Store Open</FieldLabel>
                  <p className="text-muted-foreground text-sm">
                    Enable or disable the store.
                  </p>
                </div>

                <Switch
                  checked={isOpen}
                  onCheckedChange={(checked) =>
                    setValue("isOpen", checked, {
                      shouldValidate: true,
                    })
                  }
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          {error && (
            <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-start gap-2 rounded-md border p-3 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <LoadingButton
            loading={isPending || isGettingLocation}
            disabled={isGettingLocation}
            type="submit"
            className="w-full"
          >
            {isGettingLocation ? "Getting Location..." : "Create Store"}
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
