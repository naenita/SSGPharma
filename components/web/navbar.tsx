"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { productDivisions, serviceLines } from "@/lib/divisions";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<null | "products" | "services">(null);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center">
          <Image
            src="/tlogo.png"
            alt="SSG Pharma Logo"
            width={120}
            height={40}
            loading="eager"
            fetchPriority="high"
            style={{ height: "auto", width: "auto" }}
            className="transition-opacity group-hover:opacity-80"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-0.5 lg:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/about-us"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            About
          </Link>

          {/* Products mega — hover reveals therapy divisions (same pattern as reference sites) */}
          <div className="group/products relative">
            <div className="flex cursor-default items-center gap-0.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
              <Link href="/products" className="px-1">
                Products
              </Link>
              <ChevronDown className="size-3.5 opacity-60" aria-hidden />
            </div>
            <div
              className={cn(
                "invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200",
                "group-hover/products:visible group-hover/products:opacity-100",
              )}
            >
              <div className="w-[min(90vw,640px)] rounded-xl border-2 border-border bg-popover p-4 shadow-lg">
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                  {productDivisions.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/divisions/${d.slug}`}
                      className="rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                    >
                      <span className="font-medium text-foreground">{d.title}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground line-clamp-2">
                        {d.blurb}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/products"
                  className="mt-3 block border-t border-border pt-3 text-center text-sm font-medium text-primary hover:underline"
                >
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
            <div
              className={cn(
                "invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200",
                "group-hover/services:visible group-hover/services:opacity-100",
              )}
            >
              <div className="w-[min(90vw,400px)] rounded-xl border-2 border-border bg-popover p-3 shadow-lg">
                {serviceLines.map((s) => (
                  <Link
                    key={s.slug}
                    href={s.href}
                    className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="font-medium text-foreground">{s.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{s.blurb}</span>
                  </Link>
                ))}
                <Link
                  href="/services"
                  className="mt-2 block border-t border-border pt-2 text-center text-xs font-medium text-primary hover:underline"
                >
                  Services overview
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/molecules"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            Molecules
          </Link>
          <Link
            href="/patient-assistance-programs"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            Assistance
          </Link>

          <Link className={cn(buttonVariants(), "ml-2")} href="/contact-us">
            Contact
          </Link>
          <Link className={cn(buttonVariants({ variant: "outline" }), "ml-1")} href="/get-a-quote">
            Quote
          </Link>
          <div className="ml-2 border-l border-border pl-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setOpen((v) => !v);
              setMobilePanel(null);
            }}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="border-b border-border bg-background lg:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={reduce ? undefined : { height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-1 px-4 pb-5 pt-1">
              <Link href="/" className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="/about-us" className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                About
              </Link>

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-muted"
                onClick={() => setMobilePanel((p) => (p === "products" ? null : "products"))}
              >
                Products
                <ChevronDown className={cn("size-4 transition-transform", mobilePanel === "products" && "rotate-180")} />
              </button>
              {mobilePanel === "products" && (
                <div className="ml-2 flex flex-col border-l border-border pl-3">
                  {productDivisions.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/divisions/${d.slug}`}
                      className="py-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      {d.title}
                    </Link>
                  ))}
                  <Link href="/products" className="py-2 text-sm font-medium text-primary" onClick={() => setOpen(false)}>
                    All products →
                  </Link>
                </div>
              )}

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-muted"
                onClick={() => setMobilePanel((p) => (p === "services" ? null : "services"))}
              >
                Services
                <ChevronDown className={cn("size-4 transition-transform", mobilePanel === "services" && "rotate-180")} />
              </button>
              {mobilePanel === "services" && (
                <div className="ml-2 flex flex-col border-l border-border pl-3">
                  {serviceLines.map((s) => (
                    <Link
                      key={s.slug}
                      href={s.href}
                      className="py-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      {s.title}
                    </Link>
                  ))}
                  <Link href="/services" className="py-2 text-sm font-medium text-primary" onClick={() => setOpen(false)}>
                    Overview →
                  </Link>
                </div>
              )}

              <Link href="/molecules" className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                Molecules
              </Link>
              <Link
                href="/patient-assistance-programs"
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                Assistance
              </Link>

              <Link className={cn(buttonVariants(), "mt-2 justify-center")} href="/contact-us" onClick={() => setOpen(false)}>
                Contact
              </Link>
              <Link
                className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
                href="/get-a-quote"
                onClick={() => setOpen(false)}
              >
                Request quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
