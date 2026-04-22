"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { Zap, Users, MapPin, Clock } from "lucide-react";

const stats = [
  { icon: Zap, label: "Medicines in catalog", value: "1,200+", color: "text-primary" },
  { icon: Users, label: "Hospitals served", value: "800+", color: "text-primary" },
  { icon: MapPin, label: "Coverage area", value: "India-wide", color: "text-primary" },
  { icon: Clock, label: "Avg. fulfillment", value: "24–48 hrs", color: "text-primary" },
];

export function StatsSection() {
  return (
    <section className="w-full border-y border-border/40 bg-muted/15 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <FadeIn className="mb-12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground md:text-4xl">
            By the numbers
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Real scale, real impact. We move molecules that matter to the healthcare system every single day.
          </p>
        </FadeIn>

        <StaggerList className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <div className="group rounded-2xl border border-border/80 bg-card/50 p-6 transition-all hover:border-border hover:bg-card hover:shadow-md">
                  <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 ${stat.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerList>
      </div>
    </section>
  );
}
