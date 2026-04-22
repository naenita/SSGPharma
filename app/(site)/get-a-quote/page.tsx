import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { QuoteForm } from "@/components/marketing/quote-form";
import { ContentPage } from "@/components/web/content-page";
import { ContentSection } from "@/components/web/content-section";
import { buttonVariants } from "@/components/ui/button";
import { getContactConfig } from "@/lib/contact-config";
import { marketingImages } from "@/lib/marketing-images";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "Request a formal pharmaceutical quote from SSG Pharma — what to include, response expectations, and a prefilled enquiry form for hospitals, clinics, and distributors.",
  alternates: {
    canonical: `${siteUrl}/get-a-quote`,
  },
};

const checklist = [
  "Generic or brand name, plus strength (mg / IU / ml) and pack size",
  "Approximate quantity and whether it is a one-off or repeat indent",
  "Delivery city and any cold-chain constraints",
  "Hospital / pharmacy GST details if you need a formal quote on letterhead",
  "Preferred delivery window and whether OP emergency or routine replenishment",
];

const steps = [
  { title: "Same day", desc: "We acknowledge most enquiries within business hours and flag anything that needs manufacturer confirmation." },
  { title: "1–2 working days", desc: "Typical window for priced quotes on stocked lines; specialty imports can run longer and we say so upfront." },
  { title: "After you approve", desc: "We align on PO, payment terms where agreed, and dispatch — with tracking shared on request." },
];

async function getQuotePageData() {
  try {
    const contactConfig = await getContactConfig();
    const recipientEmail =
      contactConfig.emails.find((email) => email.type === "inquiry_recipient")?.value ??
      contactConfig.emails[0]?.value ??
      "SSGPHARMAONLINE@GMAIL.COM";
    const priorityPhone =
      contactConfig.phones.find((phone) => phone.purpose === "procurement")?.value ??
      contactConfig.phones[0]?.value ??
      "+91 93554 74600";

    return { contactConfig, recipientEmail, priorityPhone };
  } catch {
    return null;
  }
}

export default async function QuotePage() {
  const data = await getQuotePageData();
  if (!data) {
    return (
      <ContentPage width="full" variant="frame">
        <ContentSection>
          <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground md:text-5xl">
            Request a quote
          </h1>
          <p className="mt-4 text-muted-foreground">Quote details are temporarily unavailable. Please try again shortly.</p>
        </ContentSection>
      </ContentPage>
    );
  }

  const { contactConfig, recipientEmail, priorityPhone } = data;

  return (
    <ContentPage width="full" variant="frame">
      <ContentSection padding="none" className="grid gap-0 md:grid-cols-2">
        <div className="relative min-h-[240px] md:min-h-[280px]">
          <Image
            src={marketingImages.packaging}
            alt="Pharmaceutical packaging — accurate quoting starts with clear product details"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent md:bg-gradient-to-r" />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Procurement</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground md:text-5xl">
              Request a quote
            </h1>
            <p className="mt-5 text-muted-foreground leading-relaxed md:text-lg">
              The more precise your line items, the faster SSG Pharma responds with an accurate quote. This page explains what helps; the form below opens your email client with a ready-made request.
            </p>
            <Link href="/contact-us" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8 w-fit")}>
              Prefer to call first?
            </Link>
          </FadeIn>
        </div>
      </ContentSection>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <ContentSection>
          <FadeIn>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-foreground md:text-3xl">What to include</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Copy-paste this checklist into your email if you are not using the form yet — it is the same structure our desk
              sorts fastest.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {checklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </ContentSection>
        <div className="relative min-h-[300px] overflow-hidden rounded-2xl border-2 border-border shadow-sm">
          <Image
            src={marketingImages.warehouse}
            alt="Wholesale stock and dispatch — we quote against real availability where possible"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      <ContentSection>
        <FadeIn>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-foreground md:text-3xl">What happens next</h2>
        </FadeIn>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.06}>
              <div className="rounded-xl border-2 border-border/80 bg-muted/20 p-5">
                <p className="text-sm font-semibold text-primary">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </ContentSection>

      <ContentSection>
        <FadeIn>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-foreground md:text-3xl">Your requirement</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Use the form to send a structured quote request directly to SSG Pharma. The message is prefilled and ready to send from your email app.
          </p>
        </FadeIn>
        <div className="mt-10 border-t border-border pt-10">
          <QuoteForm embedded recipientEmail={recipientEmail} priorityPhone={priorityPhone} companyName={contactConfig.companyName} />
        </div>
      </ContentSection>
    </ContentPage>
  );
}
