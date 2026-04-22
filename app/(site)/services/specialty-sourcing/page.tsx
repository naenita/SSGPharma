import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { marketingImages } from "@/lib/marketing-images";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();
const path = "/services/specialty-sourcing";

export const metadata: Metadata = {
  title: "Specialty & named-patient medicine sourcing",
  description:
    "Hard-to-find specialty medicines, imports, and named-patient programs. SSG Pharma chases licences and paperwork so your clinicians can focus on care.",
  alternates: { canonical: `${base}${path}` },
  openGraph: {
    url: `${base}${path}`,
    title: "Specialty sourcing · SSG Pharma",
    images: [{ url: marketingImages.research, alt: "Research and specialty pharmaceutical sourcing" }],
  },
};

export default function SpecialtySourcingPage() {
  return (
    <div className="w-full">
      <section className="relative mx-auto grid max-w-[1400px] md:grid-cols-2">
        <div className="relative min-h-[260px] md:min-h-[400px]">
          <Image
            src={marketingImages.research}
            alt="Specialty medicine sourcing and regulatory coordination"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent md:bg-gradient-to-r" />
        </div>
        <div className="flex flex-col justify-center px-4 py-12 md:px-10 lg:px-14">
          <FadeIn>
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">Specialty sourcing</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Named-patient imports, short-batch allocations, and molecules that never sit on a standard price list — that is
              the work we like. Expect a candid yes, no, or “not without these documents” instead of silence.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-2xl space-y-8 rounded-2xl border-2 border-border bg-card/60 p-8 shadow-sm md:p-12">
          <FadeIn>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-foreground">Compliance-first, speed-aware</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We map what your hospital or patient program already has on file, what the manufacturer still needs, and where
              courier cutoffs actually bite. You get a timeline you can relay to families without bluffing.
            </p>
          </FadeIn>
          <Link href="/molecules" className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Start with a molecule enquiry →
          </Link>
        </div>
      </div>
    </div>
  );
}
