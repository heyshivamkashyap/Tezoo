"use client";

import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  return (
    <NextTopLoader
      color="var(--primary)"
      height={2}
      showSpinner={false}
      crawl
      easing="ease"
      speed={200}
      shadow="0 0 10px #16a34a,0 0 5px #16a34a"
    />
  );
}
