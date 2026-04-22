"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "We've been with SSG Pharma for 3 years now. When a patient is on the bed and we're out of stock, they actually answer. Not many suppliers can say that.",
    author: "Dr. Rajesh Kumar",
    role: "Head of Pharmacy, Metro Hospital Delhi",
    rating: 5,
  },
  {
    quote: "Their oncology desk understands formularies better than most distributors. Lead times are realistic and they flag delays early.",
    author: "Priya Sharma",
    role: "Procurement, Apollo Clinics",
    rating: 5,
  },
  {
    quote: "Went from 4 suppliers to SSG Pharma for 70% of our cold-chain needs. The documentation is audit-ready and their team is responsive.",
    author: "Arun Gupta",
    role: "Supply Chain, Regional Pharmacy Chain",
    rating: 5,
  },
  {
    quote: "Specialty medicines are hard to source. SSG Pharma got us a molecule we'd been chasing for 2 months in 48 hours. Worth every call.",
    author: "Dr. Neha Patel",
    role: "Clinical Director, Nephrology Center",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <FadeIn className="mb-12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground md:text-4xl">
            Why hospitals choose us
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Direct feedback from the people who rely on us every day.
          </p>
        </FadeIn>

        <StaggerList className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, i) => (
            <StaggerItem key={i}>
              <div className="group rounded-2xl border border-border/80 bg-card/50 p-6 transition-all hover:border-border hover:bg-card hover:shadow-md md:p-7">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="leading-relaxed text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-5 border-t border-border/40 pt-4">
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
