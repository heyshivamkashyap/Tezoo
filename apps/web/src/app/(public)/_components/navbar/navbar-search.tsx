"use client";

import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";

type Product = {
  id: string;
  name: string;
  image: string;
  category: string;
};

export const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Fresh Bananas",
    image: "/products/banana.png",
    category: "Fruits",
  },
  {
    id: "2",
    name: "Amul Gold Milk",
    image: "/products/milk.png",
    category: "Dairy",
  },
  {
    id: "3",
    name: "Brown Bread",
    image: "/products/bread.png",
    category: "Bakery",
  },
  {
    id: "4",
    name: "Farm Fresh Eggs",
    image: "/products/eggs.png",
    category: "Dairy",
  },
  {
    id: "5",
    name: "Tomatoes",
    image: "/products/tomato.png",
    category: "Vegetables",
  },
  {
    id: "6",
    name: "Potatoes",
    image: "/products/potato.png",
    category: "Vegetables",
  },
  {
    id: "7",
    name: "Tata Salt",
    image: "/products/salt.png",
    category: "Groceries",
  },
  {
    id: "8",
    name: "Aashirvaad Atta",
    image: "/products/atta.png",
    category: "Groceries",
  },
  {
    id: "9",
    name: "Coca-Cola",
    image: "/products/coke.png",
    category: "Beverages",
  },
  {
    id: "10",
    name: "Lay's Magic Masala",
    image: "/products/lays.png",
    category: "Snacks",
  },
  {
    id: "11",
    name: "Good Day Biscuits",
    image: "/products/goodday.png",
    category: "Snacks",
  },
  {
    id: "12",
    name: "Fortune Sunflower Oil",
    image: "/products/oil.png",
    category: "Groceries",
  },
  {
    id: "13",
    name: "Fresh Apples",
    image: "/products/apple.png",
    category: "Fruits",
  },
  {
    id: "14",
    name: "Orange Juice",
    image: "/products/juice.png",
    category: "Beverages",
  },
  {
    id: "15",
    name: "Onions",
    image: "/products/onion.png",
    category: "Vegetables",
  },
  {
    id: "16",
    name: "Maggi Noodles",
    image: "/products/maggi.png",
    category: "Instant Food",
  },
  {
    id: "17",
    name: "Dettol Hand Wash",
    image: "/products/handwash.png",
    category: "Personal Care",
  },
  {
    id: "18",
    name: "Colgate Toothpaste",
    image: "/products/colgate.png",
    category: "Personal Care",
  },
  {
    id: "19",
    name: "Surf Excel Detergent",
    image: "/products/surf.png",
    category: "Cleaning",
  },
  {
    id: "20",
    name: "Fresh Coriander",
    image: "/products/coriander.png",
    category: "Vegetables",
  },
];

export function NavSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const isSearchPage = pathname.split("/")[1] === "search";
  const debounce = useDebounce(query, 400);

  const fetchProducts = async (search: string): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!search.trim()) return [];

    return SAMPLE_PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()),
    );
  };

  useEffect(() => {
    const loadProducts = async () => {
      // Don't open when query came from URL
      if (!isTyping) {
        setIsOpen(false);
        return;
      }

      // Close when input is empty
      if (debounce.trim().length === 0) {
        setProducts([]);
        setLoading(false);
        setIsOpen(false);
        return;
      }

      // Don't search until 3 characters
      if (debounce.trim().length < 3) {
        setProducts([]);
        setLoading(false);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setIsOpen(true);

      try {
        const data = await fetchProducts(debounce);
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debounce, isTyping]);

  useEffect(() => {
    setQuery(urlQuery);
    setIsTyping(false);
    setIsOpen(false);
  }, [urlQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getSearchUrl = (query: string) => {
    const params = new URLSearchParams({
      q: query,
    });

    return `/search?${params.toString()}`;
  };

  if (!isSearchPage) {
    return (
      <div className="relative w-full">
        <Link href="/search" className="relative w-full">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

          <Input placeholder="Search products..." className="h-10 pl-9" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      {isSearchPage ? (
        <button
          onClick={() => router.back()}
          className="active: absolute top-1/2 h-full -translate-y-1/2 rounded-lg px-2"
        >
          <ChevronLeft className="text-muted-foreground size-5.5" />
        </button>
      ) : (
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      )}

      <Input
        value={query}
        onChange={(e) => {
          setIsTyping(true);
          setQuery(e.target.value);
        }}
        placeholder="Search products..."
        className="h-10 pl-9"
        autoFocus
      />

      {isOpen && (
        <div className="bg-background absolute top-12 left-0 z-50 max-h-[60vh] w-full overflow-hidden rounded-xl border shadow-xl">
          <div className="border-b px-4 py-3">
            {loading ? (
              <Skeleton className="h-4 w-32 rounded-sm" />
            ) : (
              <p className="text-muted-foreground text-sm">
                {products.length === 0
                  ? `No results for "${debounce}"`
                  : `${products.length} ${products.length === 1 ? "result" : "results"} for "${debounce}"`}
              </p>
            )}
          </div>

          <ul className="max-h-[60vh] overflow-y-auto p-2">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <li key={index}>
                  <div className="flex items-center gap-3 rounded-md px-3 py-2">
                    <Skeleton className="h-8 w-8 rounded-md" />

                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </li>
              ))
            ) : products.length > 0 ? (
              products.map((item) => (
                <li key={item.id}>
                  <Link
                    href={getSearchUrl(item.name)}
                    className="hover:bg-accent flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left"
                  >
                    <Image
                      src="/logo.png"
                      alt={item.name}
                      width={30}
                      height={30}
                      className="aspect-square h-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium">
                        {item.name}
                      </h4>

                      <p className="text-muted-foreground text-xs">
                        {item.category}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li>
                <Link
                  href={getSearchUrl(debounce)}
                  className="hover:bg-accent flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left"
                >
                  <div className="aspect-square h-full rounded-sm object-cover p-2.5">
                    <Search className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-medium">{debounce}</h4>

                    <p className="text-muted-foreground text-xs">
                      Show all results for: {debounce}
                    </p>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
