import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { ProductsContent } from "@/components/marketing/products-content";
import { getProductDivision, productDivisions } from "@/lib/divisions";
import { marketingImages } from "@/lib/marketing-images";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

type Props = {
  searchParams: Promise<{ division?: string }>;
};

async function getProductsPageData(searchParamsPromise: Props["searchParams"]) {
  try {
    const { division: divisionSlug } = await searchParamsPromise;
    const division = divisionSlug ? getProductDivision(divisionSlug) : undefined;

    const items = await prisma.product.findMany({
      where: division ? { category: { is: { slug: division.slug } } } : undefined,
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        salts: true,
        manufacturer: true,
        description: true,
        imageUrl1: true,
        imageUrl2: true,
        imageUrl3: true,
        isActive: true,
        pricePaise: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return { division, items };
  } catch {
    return null;
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  try {
    const { division } = await searchParams;
    const d = division ? getProductDivision(division) : undefined;
    const base = getSiteUrl();
    if (d) {
      const url = `${base}/products?division=${d.slug}`;
      return {
        title: `${d.title} products — catalog`,
        description: `Browse ${d.title.toLowerCase()} medicines from SSG Pharma. ${d.blurb}`,
        alternates: { canonical: url },
      };
    }
    return {
      title: "Medicine catalog — wholesale pharmaceutical supply",
      description:
        "Browse specialty medicines, salts, prices, and stock status. Wholesale supply for hospitals, clinics, and pharmacies across India.",
      alternates: { canonical: `${base}/products` },
    };
  } catch {
    return {
      title: "Medicine catalog",
      description: "Browse specialty medicines from SSG Pharma.",
    };
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const data = await getProductsPageData(searchParams);
  if (!data) {
    return (
      <section className="mx-auto max-w-[1400px] px-4 py-16 md:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight">Product catalog</h1>
        <p className="mt-4 text-muted-foreground">The catalog is temporarily unavailable. Please try again shortly.</p>
      </section>
    );
  }

  const { division, items } = data;

  return (
    <>
      <section className="relative w-full border-b border-border/60 bg-muted/20">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center px-4 py-12 md:px-8 lg:px-12 lg:py-16">
            <FadeIn>
              <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl lg:text-6xl">
                {division ? `${division.title} catalog` : "Product catalog"}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
                {division
                  ? division.blurb
                  : "Every row below is indexed for search with its own URL — add clear names and salt strings in admin so Google (and doctors) can find you."}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <Link
                  href="/products"
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                    !division ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  All
                </Link>
                {productDivisions.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/products?division=${d.slug}`}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                      division?.slug === d.slug
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {d.title}
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>
          <div className="relative hidden min-h-[280px] md:block">
            <Image
              src={division?.imageSrc ?? marketingImages.warehouse}
              alt={division?.imageAlt ?? "Pharmaceutical warehouse and wholesale medicine storage"}
              fill
              className="object-cover"
              sizes="45vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          </div>
        </div>
      </section>

        <ProductsContent items={items} division={division} />
      </>
  );
}
