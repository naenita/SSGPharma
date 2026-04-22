import { cn } from "@/lib/utils";

/** Bordered panel for use inside `ContentPage variant="frame"`. */
export function ContentSection({
  children,
  className,
  padding = "md",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}) {
  const pad =
    padding === "none"
      ? ""
      : padding === "sm"
        ? "p-5 md:p-6"
        : padding === "lg"
          ? "p-8 md:p-12 lg:p-14"
          : "p-8 md:p-10 lg:p-12";

  return (
    <section className={cn("overflow-hidden rounded-2xl border-2 border-border bg-card/70 shadow-sm backdrop-blur-sm", pad, className)}>
      {children}
    </section>
  );
}
