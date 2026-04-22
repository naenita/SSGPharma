import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { ManagedImage } from "@/components/web/managed-image";
import { ContentPage } from "@/components/web/content-page";
import { ContentSection } from "@/components/web/content-section";
import { buttonVariants } from "@/components/ui/button";
import { formatBusinessDays, formatBusinessHours, formatMailtoHref, formatPhoneHref, getContactConfig } from "@/lib/contact-config";
import { marketingImages } from "@/lib/marketing-images";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact SSG Pharma for hospital indents, wholesale quotes, and specialty medicine enquiries — phone, email, hours, and office.",
  alternates: {
    canonical: `${siteUrl}/contact-us`,
  },
};

async function getContactPageData() {
  try {
    const contactConfig = await getContactConfig();
    const phoneLines = contactConfig.phones;
    const generalEmails = contactConfig.emails;
    const whatsappPhone = contactConfig.phones.find((phone) => phone.purpose === "procurement" || phone.purpose === "sales") ?? contactConfig.phones[0];
    const address = [contactConfig.officeAddress, contactConfig.officeCity, contactConfig.officeState, contactConfig.officeZipCode].filter(Boolean).join(", ");

    const channels = [
      {
        title: "Phone numbers",
        body: "All active contact lines configured in admin, including procurement, sales, and escalation.",
        lines: phoneLines.map((phone) => ({
          label: phone.description ? `${phone.description}: ${phone.value}` : phone.value,
          href: formatPhoneHref(phone.value),
        })),
      },
      {
        title: "Email",
        body: "Best for line-item enquiries, GST details, and formal quote requests.",
        lines: generalEmails.map((email) => ({
          label: email.value,
          href: formatMailtoHref(email.value),
        })),
      },
      {
        title: "WhatsApp business",
        body: "Use WhatsApp for quick stock checks, availability updates, and quote follow-up.",
        lines: whatsappPhone ? [{ label: whatsappPhone.value, href: formatPhoneHref(whatsappPhone.value) }] : [],
      },
    ];

    return { contactConfig, channels, address };
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const data = await getContactPageData();
  if (!data) {
    return (
      <ContentPage width="full" variant="frame">
        <ContentSection>
          <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground md:text-5xl">Contact</h1>
          <p className="mt-4 text-muted-foreground">Contact details are temporarily unavailable. Please try again shortly.</p>
        </ContentSection>
      </ContentPage>
    );
  }

  const { contactConfig, channels, address } = data;

  return (
    <ContentPage width="full" variant="frame">
      <ContentSection padding="none" className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[220px] lg:min-h-[300px]">
          <ManagedImage
            src={marketingImages.reception}
            alt="Professional office reception — visit or call SSG Pharma"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent lg:bg-gradient-to-r" />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Get in touch</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground md:text-5xl">
              Contact
            </h1>
            <p className="mt-5 text-muted-foreground leading-relaxed md:text-lg">
              Reach {contactConfig.companyName} for formal quotes, stock checks, and hospital indents. Use the primary procurement line for the fastest response.
            </p>
          </FadeIn>
        </div>
      </ContentSection>

      <div className="grid gap-6 lg:grid-cols-3">
        {channels.map((channel, i) => (
          <FadeIn key={channel.title} delay={i * 0.05}>
            <ContentSection className="h-full">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">{channel.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{channel.body}</p>
              <ul className="mt-4 space-y-2 text-foreground">
                {channel.lines.map((line) => (
                  <li key={line.label} className="text-sm md:text-base">
                    <a className="transition-colors hover:text-primary" href={line.href}>
                      {line.label}
                    </a>
                  </li>
                ))}
              </ul>
            </ContentSection>
          </FadeIn>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
        <ContentSection>
          <FadeIn>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-foreground md:text-2xl">Hours</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex flex-col gap-1 border-b border-border/60 pb-4 sm:flex-row sm:justify-between">
                <span className="font-medium text-foreground">{formatBusinessDays(contactConfig)}</span>
                <span className="text-muted-foreground">{formatBusinessHours(contactConfig)} IST</span>
              </li>
              <li className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="font-medium text-foreground">After hours</span>
                <span className="text-muted-foreground">Use the emergency or procurement line for urgent stock-outs</span>
              </li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              We keep contact details synced from the admin console so updates go live on the frontend without manual edits.
            </p>
          </FadeIn>
        </ContentSection>
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl border-2 border-border shadow-sm">
          <ManagedImage
            src={marketingImages.consultation}
            alt="Clinical consultation — we support hospital and pharmacy teams"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      <ContentSection>
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <FadeIn>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Registered office</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This address is managed from the admin contact settings and appears across the live frontend.
            </p>
            <p className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-foreground">
              {address || "Address not set"}
            </p>
          </FadeIn>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-border">
            <ManagedImage
              src={marketingImages.delivery}
              alt="Medicine delivery and logistics — nationwide dispatch"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </ContentSection>

      <ContentSection className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-muted-foreground leading-relaxed">
          Prefer to start with a structured list? Send molecules, strengths, and quantities — we will reply with availability and next steps.
        </p>
        <Link href="/get-a-quote" className={cn(buttonVariants({ size: "lg" }), "shrink-0")}>
          Open quote form
        </Link>
      </ContentSection>
    </ContentPage>
  );
}
