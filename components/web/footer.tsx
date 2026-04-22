import Link from "next/link";
import { formatBusinessDays, formatBusinessHours, formatMailtoHref, formatPhoneHref, getContactConfig } from "@/lib/contact-config";
import { productDivisions, serviceLines } from "@/lib/divisions";

export async function SiteFooter() {
  const contactConfig = await getContactConfig();

  return (
    <footer className="mt-auto w-full border-t-2 border-border bg-muted/40">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-14 md:grid-cols-[1.2fr_1fr_1fr_1.2fr] md:px-8">
        <div className="space-y-4">
          <p className="font-[family-name:var(--font-display)] text-xl text-foreground">{contactConfig.companyName}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {contactConfig.businessType}. Wholesale and specialty medicines with careful handling and responsive support.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            {contactConfig.officeAddress ? <p>{contactConfig.officeAddress}</p> : null}
            <p>{[contactConfig.officeCity, contactConfig.officeState, contactConfig.officeZipCode].filter(Boolean).join(", ")}</p>
            <p>
              {formatBusinessDays(contactConfig)} · {formatBusinessHours(contactConfig)}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-medium text-foreground">Divisions</p>
          <ul className="space-y-2 text-muted-foreground">
            {productDivisions.map((d) => (
              <li key={d.slug}>
                <Link className="transition-colors hover:text-foreground" href={`/divisions/${d.slug}`}>
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-medium text-foreground">Services</p>
          <ul className="space-y-2 text-muted-foreground">
            {serviceLines.map((s) => (
              <li key={s.slug}>
                <Link className="transition-colors hover:text-foreground" href={s.href}>
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link className="transition-colors hover:text-foreground" href="/contact-us">
                Contact
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-foreground" href="/get-a-quote">
                Request a quote
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-medium text-foreground">Contact</p>
          <ul className="space-y-2 text-muted-foreground">
            {contactConfig.phones.map((phone) => (
              <li key={phone.id}>
                <a className="transition-colors hover:text-foreground" href={formatPhoneHref(phone.value)}>
                  {phone.description ? `${phone.description}: ` : ""}
                  {phone.value}
                </a>
              </li>
            ))}
            {contactConfig.emails.map((email) => (
              <li key={email.id}>
                <a className="transition-colors hover:text-foreground" href={formatMailtoHref(email.value)}>
                  {email.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 text-center text-xs text-muted-foreground md:flex-row md:px-8 md:text-left">
          <p>© {new Date().getFullYear()} {contactConfig.companyName}. All rights reserved.</p>
          <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground/80 shadow-sm">
            <span className="text-primary">Made with love</span>
            <span className="text-muted-foreground">by</span>
            <span className="font-semibold text-foreground">ByteTwo Studios</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
