import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { serviceLines } from "@/lib/divisions";
import { marketingImages } from "@/lib/marketing-images";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: "Pharmaceutical services — hospital, wholesale, specialty",
  description:
    "Hospital supply, wholesale distribution, and specialty sourcing for healthcare institutions and distributors across India.",
  alternates: { canonical: `${base}/services` },
};

export default function ServicesPage() {
  return (
    <div className="w-full">
      <section className="relative w-full min-h-[320px] border-b-2 border-border md:min-h-[380px]">
        <Image
          src={marketingImages.packaging}
          alt="Pharmaceutical services — packaging, logistics, and supply"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto flex max-w-[1400px] flex-col justify-end px-4 pb-12 pt-24 md:px-8 md:pb-16 md:pt-32">
          <FadeIn>
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground md:text-6xl">
              Services
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Three lanes, one team. Each service line has its own page so search engines (and your procurement head) land
              on the right story.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
        <StaggerList className="grid gap-6 md:grid-cols-3">
          {serviceLines.map((s) => (
            <StaggerItem key={s.slug}>
              <Link
                href={s.href}
                className="flex h-full flex-col rounded-2xl border-2 border-border bg-card/90 p-6 shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl">{s.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
                <span className="mt-4 text-sm font-medium text-primary">Read more →</span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </div>
  );
}
