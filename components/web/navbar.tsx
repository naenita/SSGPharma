"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/web/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { productDivisions, serviceLines } from "@/lib/divisions";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"products" | "services" | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  const logoSrc = mounted && resolvedTheme === "dark" ? "/tlogo-white.png" : "/tlogo.png";

  function closeMobileMenu() {
    setMobileOpen(false);
    setMobileSection(null);
  }

  function toggleMobileSection(section: "products" | "services") {
    setMobileSection((current) => (current === section ? null : section));
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/75">
      <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center">
          <Image
            src={logoSrc}
            alt="SSG Pharma Logo"
            width={132}
            height={44}
            priority
            style={{ width: "auto" }}
            className="h-11 w-auto transition-[opacity,transform] duration-300 group-hover:scale-[1.01] group-hover:opacity-85 md:h-12"
          />
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          <Link href="/" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:bg-muted/80 focus-visible:text-foreground">
            Home
          </Link>
          <Link href="/about-us" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:bg-muted/80 focus-visible:text-foreground">
            About
          </Link>

          <div className="group/products relative">
            <div className="flex cursor-default items-center gap-0.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
              <Link href="/products" className="px-1">
                Products
              </Link>
              <ChevronDown className="size-3.5 opacity-60" aria-hidden />
            </div>
            <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover/products:visible group-hover/products:opacity-100">
              <div className="w-[min(90vw,640px)] rounded-xl border-2 border-border bg-popover p-4 shadow-lg">
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                  {productDivisions.map((division) => (
                    <Link
                      key={division.slug}
                      href={`/divisions/${division.slug}`}
                      className="rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted/80 focus-visible:bg-muted/80"
                    >
                      <span className="font-medium text-foreground">{division.title}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground line-clamp-2">
                        {division.blurb}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link href="/products" className="mt-3 block border-t border-border pt-3 text-center text-sm font-medium text-primary hover:underline">
                  View full catalog →
                </Link>
              </div>
            </div>
          </div>

          <div className="group/services relative">
            <div className="flex cursor-default items-center gap-0.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
              <Link href="/services" className="px-1">
                Services
              </Link>
              <ChevronDown className="size-3.5 opacity-60" aria-hidden />
            </div>
            <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover/services:visible group-hover/services:opacity-100">
              <div className="w-[min(90vw,400px)] rounded-xl border-2 border-border bg-popover p-3 shadow-lg">
                {serviceLines.map((service) => (
                  <Link
                    key={service.slug}
                    href={service.href}
                    className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted/80 focus-visible:bg-muted/80"
                  >
                    <span className="font-medium text-foreground">{service.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{service.blurb}</span>
                  </Link>
                ))}
                <Link href="/services" className="mt-2 block border-t border-border pt-2 text-center text-xs font-medium text-primary hover:underline">
                  Services overview
                </Link>
              </div>
            </div>
          </div>

          <Link href="/molecules" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:bg-muted/80 focus-visible:text-foreground">
            Molecules
          </Link>
          <Link href="/patient-assistance-programs" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:bg-muted/80 focus-visible:text-foreground">
            Assistance
          </Link>

          <div className="ml-2">
            <ThemeToggle />
          </div>
          <Link className={cn(buttonVariants(), "ml-1")} href="/contact-us">
            Contact
          </Link>
          <Link className={cn(buttonVariants({ variant: "outline" }), "ml-1")} href="/get-a-quote">
            Quote
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")} href="/contact-us">
            Contact
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:border-primary/40 hover:text-primary"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {mobileOpen ? (
            <div className="absolute right-4 top-[calc(100%+0.75rem)] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border/70 bg-background/98 shadow-2xl md:right-6">
              <div className="space-y-3 px-4 pb-5 pt-4">
                <div className="grid gap-2">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/about-us", label: "About" },
                    { href: "/molecules", label: "Molecules" },
                    { href: "/patient-assistance-programs", label: "Assistance" },
                    { href: "/contact-us", label: "Contact" },
                    { href: "/get-a-quote", label: "Get a Quote" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-muted/80 focus-visible:bg-muted/80"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("products")}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-muted/80 focus-visible:bg-muted/80"
                  >
                    <span>Products</span>
                    <ChevronDown className={cn("size-4 transition-transform", mobileSection === "products" ? "rotate-180" : "")} />
                  </button>
                  {mobileSection === "products" ? (
                    <div className="border-t border-border/60 px-2 py-2">
                      <Link
                        href="/products"
                        onClick={closeMobileMenu}
                        className="block rounded-xl px-3 py-2.5 text-sm font-medium text-primary transition hover:bg-muted/80 focus-visible:bg-muted/80"
                      >
                        View full catalog
                      </Link>
                      <div className="mt-1 grid gap-1">
                        {productDivisions.map((division) => (
                          <Link
                            key={division.slug}
                            href={`/divisions/${division.slug}`}
                            onClick={closeMobileMenu}
                            className="rounded-xl px-3 py-2.5 text-sm text-foreground transition hover:bg-muted/80 focus-visible:bg-muted/80"
                          >
                            <span className="block font-medium">{division.title}</span>
                            <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{division.blurb}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("services")}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-muted/80 focus-visible:bg-muted/80"
                  >
                    <span>Services</span>
                    <ChevronDown className={cn("size-4 transition-transform", mobileSection === "services" ? "rotate-180" : "")} />
                  </button>
                  {mobileSection === "services" ? (
                    <div className="border-t border-border/60 px-2 py-2">
                      <Link
                        href="/services"
                        onClick={closeMobileMenu}
                        className="block rounded-xl px-3 py-2.5 text-sm font-medium text-primary transition hover:bg-muted/80 focus-visible:bg-muted/80"
                      >
                        Services overview
                      </Link>
                      <div className="mt-1 grid gap-1">
                        {serviceLines.map((service) => (
                          <Link
                            key={service.slug}
                            href={service.href}
                            onClick={closeMobileMenu}
                            className="rounded-xl px-3 py-2.5 text-sm text-foreground transition hover:bg-muted/80 focus-visible:bg-muted/80"
                          >
                            <span className="block font-medium">{service.title}</span>
                            <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{service.blurb}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
