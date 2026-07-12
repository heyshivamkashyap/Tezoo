"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NavLocationProps {
  className?: string;
}

interface StoredLocation {
  shortAddress?: string;
  address?: string;
  display_name?: string;
}

const DEFAULT_LOCATION = "Select Location";

export function NavLocation({ className }: NavLocationProps) {
  const [deliveryAddress, setDeliveryAddress] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        // TODO: Replace with API call when available.
        // const response = await getUserLocation();

        const storedLocation = localStorage.getItem("location");

        if (!storedLocation) {
          setDeliveryAddress(DEFAULT_LOCATION);
          return;
        }

        const location: StoredLocation = JSON.parse(storedLocation);

        setDeliveryAddress(
          location.shortAddress ??
            location.address ??
            location.display_name ??
            DEFAULT_LOCATION,
        );
      } catch {
        setDeliveryAddress(DEFAULT_LOCATION);
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, []);

  return (
    <div className={cn("flex w-fit max-w-3xs items-center gap-3", className)}>
      <div className="min-w-0 flex-1">
        <div className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
          <Zap className="text-foreground size-3.5 fill-current" />
          <span>Deliver to</span>
        </div>

        <div className="mt-1">
          {loading ? (
            <Skeleton className="h-5 w-56 rounded-sm" />
          ) : (
            <p
              className="truncate text-sm font-semibold"
              title={deliveryAddress}
            >
              {deliveryAddress}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
