import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  crumbs: Crumb[];
  className?: string;
};

export function Breadcrumbs({ crumbs, className }: Props) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)} aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <div key={i} className="flex items-center gap-2">
          {crumb.href ? (
            <Link href={crumb.href} className="transition-colors hover:text-foreground">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground">{crumb.label}</span>
          )}
          {i < crumbs.length - 1 && <ChevronRight className="size-3.5 text-border" />}
        </div>
      ))}
    </nav>
  );
}
