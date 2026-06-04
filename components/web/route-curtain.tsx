"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function RouteCurtain() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setActive(true);
    const timeout = window.setTimeout(() => setActive(false), 760);

    return () => window.clearTimeout(timeout);
  }, [pathname, searchParams]);

  return (
    <div className={cn("route-curtain", active && "route-curtain-active")} aria-hidden="true">
      <span>SSG PHARMA</span>
    </div>
  );
}
