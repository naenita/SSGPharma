"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { marketingImages } from "@/lib/marketing-images";
import { cn } from "@/lib/utils";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden border-b border-border/50 bg-muted/15">
      <div className="mx-auto grid max-w-[1400px] items-center gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 px-4 py-12 md:px-8 lg:px-12 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.14_195/0.35),transparent_65%)] blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-40 size-[380px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.78_0.08_145/0.28),transparent_65%)] blur-2xl"
          />

          <motion.p
            className="relative mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Specialty wholesale · India
          </motion.p>

          <motion.h1
            className="relative font-[family-name:var(--font-display)] text-4xl leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl lg:leading-[1.05]"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.03, ease: "easeOut" }}
          >
            Medicines your patients need,{" "}
            <span className="text-primary">without the runaround.</span>
          </motion.h1>

          <motion.p
            className="relative mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.07, ease: "easeOut" }}
          >
            Oncology, diabetes, nephrology, and more — sourced carefully, stocked thoughtfully, and shipped with the urgency
            healthcare deserves.
          </motion.p>

          <motion.div
            className="relative mt-10 flex flex-wrap items-center gap-3"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
          >
            <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "group gap-2 pr-3")}>
              Browse catalog
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/get-a-quote" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Request quote
            </Link>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4 text-xs text-muted-foreground"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary" />
              <span>Authentic sourcing</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary" />
              <span>24/7 Support</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary" />
              <span>Nationwide delivery</span>
            </div>
          </motion.div>
        </div>

        <div className="relative min-h-[300px] w-full lg:min-h-[560px]">
          <Image
            src={marketingImages.heroLab}
            alt="Licensed pharmaceutical wholesale — quality medicines and supply chain"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 48vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:bg-gradient-to-l" />
        </div>
      </div>
    </section>
  );
}
