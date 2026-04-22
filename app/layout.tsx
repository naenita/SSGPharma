import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SSG Pharma",
    template: "%s | SSG Pharma",
  },
  description:
    "Specialty medicine supply for hospitals, pharmacies, and distributors across India.",
  keywords: [
    "pharmaceutical wholesaler India",
    "medicine supplier Delhi",
    "specialty medicines",
    "hospital medicine supply",
    "oncology drugs wholesale",
    "pharmacy distributor",
  ],
  authors: [{ name: "SSG Pharma" }],
  creator: "SSG Pharma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SSG Pharma",
    title: "SSG Pharma",
    description: "Specialty medicine supply for hospitals, pharmacies, and distributors across India.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SSG Pharma specialty medicine supply",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSG Pharma",
    description: "Specialty medicine supply for hospitals, pharmacies, and distributors across India.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased")}
    >
      <head>
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col overflow-x-hidden bg-background font-sans text-foreground">
        <SiteJsonLd />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
