"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { ProductSearch } from "@/components/marketing/product-search";
import { ManagedImage } from "@/components/web/managed-image";
import { getStableMarketingFallback } from "@/lib/marketing-images";
import { formatInrFromPaise } from "@/lib/money";
import { cn } from "@/lib/utils";

type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  salts: string | null;
  manufacturer: string | null;
  description: string | null;
  imageUrl1: string | null;
  imageUrl2: string | null;
  imageUrl3: string | null;
  isActive: boolean;
  pricePaise: number;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type Props = {
  items: ProductListItem[];
  division?: { title: string; catalogCategory: string };
};

export function ProductsContent({ items, division }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.salts?.toLowerCase().includes(query) ?? false) ||
        (item.manufacturer?.toLowerCase().includes(query) ?? false) ||
        (item.category?.name.toLowerCase().includes(query) ?? false),
    );
  }, [items, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-12 md:px-6 lg:px-8 md:py-16">
      <div className="mb-8 space-y-4">
        <ProductSearch onFilter={setSearchQuery} />

        {items.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing <span className="font-semibold text-foreground">{filteredItems.length}</span> of{" "}
              <span className="font-semibold text-foreground">{items.length}</span> products
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <FadeIn>
              <p className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-muted-foreground">
                {searchQuery
                  ? `No medicines found matching "${searchQuery}". Try a different search term.`
                  : division
                    ? `No medicines tagged "${division.catalogCategory}" yet. Use that exact category in admin, or pick another division above.`
                    : "No medicines published yet. Add them in the admin console — each one gets a public URL for SEO."}
              </p>
            </FadeIn>
          </div>
        ) : (
          filteredItems.map((m, i) => (
            <FadeIn key={m.id} delay={Math.min(i * 0.03, 0.2)}>
              {(() => {
                const imageSrc = m.imageUrl1 || m.imageUrl2 || m.imageUrl3;
                const fallbackSrc = getStableMarketingFallback(`${m.id}:${m.name}`);

                return (
                <Link
                  href={`/products/${m.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/50 transition-all hover:border-border hover:bg-card hover:shadow-md"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-muted">
                    <ManagedImage
                      src={imageSrc}
                      alt={m.name}
                      fallbackSrc={fallbackSrc}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-lg font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {m.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{m.salts}</p>
                      {(m.category?.name || m.manufacturer) && (
                        <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground/70">
                          {[m.category?.name, m.manufacturer].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>

                    {m.description && (
                      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{m.description}</p>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatInrFromPaise(m.pricePaise)}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            m.isActive ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive",
                          )}
                        >
                          {m.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                );
              })()}
            </FadeIn>
          ))
        )}
      </div>
    </div>
  );
}
