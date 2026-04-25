import { Clock, MapPin, Users, Zap } from "lucide-react";

type StatsSectionProps = {
  productCount: number;
};

export function StatsSection({ productCount }: StatsSectionProps) {
  const stats = [
    { icon: Zap, label: "Products", value: `${productCount}+`, color: "text-primary" },
    { icon: Users, label: "Hospitals Served", value: "15+", color: "text-primary" },
    { icon: MapPin, label: "Coverage", value: "Worldwide", color: "text-primary" },
    { icon: Clock, label: "Avg. fulfillment", value: "24–48 hrs", color: "text-primary" },
  ];

  return (
    <section className="w-full border-y border-border/40 bg-muted/15 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground md:text-4xl">
            By the numbers
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Real scale, real impact. We move molecules that matter to the healthcare system every single day.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <li key={stat.label}>
                <div className="group rounded-2xl border border-border/80 bg-card/50 p-6 transition-all hover:border-border hover:bg-card hover:shadow-md">
                  <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 ${stat.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
