import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import { DivisionProductsList } from "@/components/marketing/division-products-list";
import { ManagedImage } from "@/components/web/managed-image";
import { getProductDivision, productDivisions, type ProductDivision } from "@/lib/divisions";
import { marketingImages } from "@/lib/marketing-images";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    const slugs = new Set([...productDivisions.map((division) => division.slug), ...categories.map((category) => category.slug)]);
    return Array.from(slugs).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

async function getDivisionConfig(slug: string): Promise<ProductDivision | null> {
  const configuredDivision = getProductDivision(slug);
  if (configuredDivision) return configuredDivision;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      description: true,
      isActive: true,
    },
  });

  if (!category?.isActive) return null;

  return {
    slug: category.slug,
    title: category.name,
    catalogCategory: category.name,
    blurb: category.description || `Browse ${category.name.toLowerCase()} medicines supplied by SSG Pharma.`,
    imageSrc: marketingImages.catalog,
    imageAlt: `${category.name} medicines catalog`,
  };
}

async function getDivisionPageData(paramsPromise: Props["params"]) {
  try {
    const { slug } = await paramsPromise;
    const division = await getDivisionConfig(slug);
    if (!division) {
      return null;
    }

    const items = await prisma.product.findMany({
      where: {
        category: {
          is: {
            slug: division.slug,
          },
        },
      },
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        salts: true,
        description: true,
        imageUrl1: true,
        imageUrl2: true,
        imageUrl3: true,
        pricePaise: true,
        isActive: true,
      },
    });

    return { slug, division, items };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const d = await getDivisionConfig(slug);
    if (!d) return {};
    const base = getSiteUrl();
    const url = `${base}/divisions/${slug}`;
    return {
      title: `${d.title} medicines — wholesale & hospital supply`,
      description: `${d.blurb} Browse ${d.title.toLowerCase()} lines from SSG Pharma — authentic medicines for hospitals and pharmacies in India.`,
      alternates: { canonical: url },
      openGraph: {
        title: `${d.title} division · SSG Pharma`,
        description: d.blurb,
        url,
        images: [{ url: d.imageSrc, alt: d.imageAlt }],
      },
    };
  } catch {
    return {};
  }
}

export default async function DivisionPage({ params }: Props) {
  const data = await getDivisionPageData(params);
  if (!data) {
    notFound();
  }

  const { slug, division, items } = data;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${division.title} medicines`,
    description: division.blurb,
    url: `${getSiteUrl()}/divisions/${slug}`,
    isPartOf: { "@type": "WebSite", name: "SSG Pharma", url: getSiteUrl() },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative w-full">
        <div className="relative mx-auto grid max-w-[1400px] gap-0 md:grid-cols-2">
          <div className="relative min-h-[280px] md:min-h-[380px]">
            <ManagedImage
              src={division.imageSrc}
              alt={division.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent md:bg-gradient-to-r" />
          </div>
          <div className="flex flex-col justify-center px-4 py-12 md:px-12 lg:px-16">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Division</p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
                {division.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground leading-relaxed">{division.blurb}</p>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                Tag medicines in admin with category <strong className="text-foreground">{division.catalogCategory}</strong>{" "}
                so they appear in this list. That keeps your public SEO pages aligned with your catalog.
              </p>
              <Link href="/products" className="mt-8 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">
                View full catalog →
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-6">
        <FadeIn>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">Listed in this division</h2>
          <p className="mt-2 text-muted-foreground">
            {items.length} medicine{items.length === 1 ? "" : "s"} currently tagged &ldquo;{division.catalogCategory}&rdquo;.
          </p>
        </FadeIn>
        <DivisionProductsList items={items} division={division} />
      </div>
    </>
  );
}
