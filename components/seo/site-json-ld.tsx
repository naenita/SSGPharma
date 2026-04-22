import { getSiteUrl } from "@/lib/site-url";

/** Organization + WebSite structured data for Google rich results basics. */
export function SiteJsonLd() {
  const base = getSiteUrl();
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "SSG Pharma",
        url: base,
        description:
          "Specialty pharmaceutical wholesaler serving hospitals, clinics, and pharmacies across India with authentic medicines and responsive support.",
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "SSG Pharma",
        publisher: { "@id": `${base}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}
