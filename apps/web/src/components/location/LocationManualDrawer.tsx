"use client";
import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingButton } from "../ui/loading-btn";
import { getNearbyStore } from "@/services/store/store.service";

type Place = {
  display_name: string;
  lat: string;
  lon: string;
};

export function LocationManualDrawer() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const location = localStorage.getItem("location");

    if (!location) {
      setIsOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const searchLocation = async () => {
      try {
        setSearching(true);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
            debouncedQuery,
          )}`,
          {
            signal: controller.signal,
          },
        );

        const data: Place[] = await response.json();
        setResults(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error(error);
          toast.error("Location search failed");
        }
      } finally {
        setSearching(false);
      }
    };

    searchLocation();

    return () => controller.abort();
  }, [debouncedQuery]);

  const selectLocation = async (place: Place) => {
    try {
      setSelecting(true);

      const latitude = parseFloat(place.lat);
      const longitude = parseFloat(place.lon);

      const { data: res } = await getNearbyStore(latitude, longitude);

      if (!res.success) {
        toast.error("Unable to find a store at this location.");
        return;
      }

      localStorage.setItem("storeId", res.data.storeId);

      localStorage.setItem(
        "location",
        JSON.stringify({
          display_name: place.display_name,
          lat: place.lat,
          lon: place.lon,
        }),
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      setSelecting(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="mx-auto max-h-3/4 min-h-3/5 max-w-md border">
        <DrawerHeader>
          <DrawerTitle className="text-lg">Enter your location</DrawerTitle>
          <DrawerDescription>
            Type an address or city name and select a result.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex gap-2 px-4 py-2">
          <Input
            placeholder="City or area"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-base"
            autoFocus={true}
          />
          <LoadingButton loading={searching}>
            <Search className="size-4" />
          </LoadingButton>
        </div>

        <div className="flex-1 space-y-2 overflow-y-scroll px-3">
          {results.map((place) => (
            <button
              key={place.lat + place.lon}
              disabled={selecting}
              onClick={() => selectLocation(place)}
              className="border-muted hover:bg-muted intce flex w-full items-center gap-3 rounded-md border-b p-2 px-3"
            >
              <Search className="text-muted-foreground size-4 shrink-0" />
              <span className="text-left text-[15px] tracking-wide">
                {place.display_name}
              </span>
            </button>
          ))}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
