import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { marketingImages } from "@/lib/marketing-images";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();
const path = "/services/wholesale-distribution";

export const metadata: Metadata = {
  title: "Wholesale pharmaceutical distribution",
  description:
    "Bulk medicine supply for distributors and retail chains across India. Transparent lead times, competitive wholesale pricing, and reliable repeat fulfilment.",
  alternates: { canonical: `${base}${path}` },
  openGraph: {
    url: `${base}${path}`,
    title: "Wholesale distribution · SSG Pharma",
    images: [{ url: marketingImages.warehouse, alt: "Wholesale pharmaceutical warehouse" }],
  },
};

export default function WholesalePage() {
  return (
    <div className="w-full">
      <section className="relative mx-auto grid max-w-[1400px] md:grid-cols-2">
        <div className="relative min-h-[260px] md:min-h-[400px] md:order-2">
          <Image
            src={marketingImages.warehouse}
            alt="Wholesale warehouse and palletized medicine distribution"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent md:bg-gradient-to-l" />
        </div>
        <div className="flex flex-col justify-center px-4 py-12 md:order-1 md:px-10 lg:px-14">
          <FadeIn>
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">Wholesale distribution</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Volume buyers need predictability more than hype. We quote with realistic lead times, confirm stock against
              live inventory, and push back early when a manufacturer run is slipping — so you can warn your customers in
              time.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-2xl space-y-8 rounded-2xl border-2 border-border bg-card/60 p-8 shadow-sm md:p-12">
          <FadeIn>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-foreground">Credit, documentation, repeat cycles</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We support structured repeat indents, GST-compliant invoicing, and clear returns policy alignment where
              manufacturers allow it. If you are building a regional hub, ask about scheduled dispatch windows for your lane.
            </p>
          </FadeIn>
          <Link href="/contact-us" className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Open a wholesale account conversation →
          </Link>
        </div>
      </div>
    </div>
  );
}
