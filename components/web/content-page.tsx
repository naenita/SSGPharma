import { cn } from "@/lib/utils";

type ContentPageProps = {
  children: React.ReactNode;
  /** Wider layouts for forms / two-column contact blocks */
  width?: "reading" | "comfortable" | "wide" | "full";
  /** `card` = one outer panel; `frame` = only max-width + padding (use inner sections for borders). */
  variant?: "card" | "frame";
  className?: string;
};

/**
 * Keeps About, Contact, etc. aligned with the same horizontal rhythm as the rest of the site
 * and wraps copy in a clear bordered surface so it does not float awkwardly on large screens.
 */
export function ContentPage({ children, width = "reading", variant = "card", className }: ContentPageProps) {
  const max =
    width === "full"
      ? "max-w-[1400px]"
      : width === "wide"
        ? "max-w-4xl"
        : width === "comfortable"
          ? "max-w-3xl"
          : "max-w-2xl";

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 pb-20 pt-12 sm:px-6 md:px-8 md:pb-28 md:pt-16",
        max,
        className,
      )}
    >
      {variant === "frame" ? (
        <div className="flex flex-col gap-10 md:gap-14">{children}</div>
      ) : (
        <div className="rounded-2xl border-2 border-border bg-card/70 p-8 shadow-sm backdrop-blur-sm md:p-10 lg:p-12">
          {children}
        </div>
      )}
    </div>
  );
}
