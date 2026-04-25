"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { formatMailtoHref, formatPhoneHref } from "@/lib/contact-config";

type FloatingInquiryProps = {
  primaryPhone?: string;
  primaryEmail?: string;
};

export function FloatingInquiry({ primaryPhone, primaryEmail }: FloatingInquiryProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-4 right-4 z-40 flex size-13 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl active:scale-95 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 md:size-16"
        aria-expanded={open}
        aria-label={open ? "Close quick contact menu" : "Open quick contact menu"}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open ? (
        <div className="fixed bottom-20 left-3 right-3 z-40 rounded-2xl border-2 border-border bg-card/95 backdrop-blur shadow-2xl sm:bottom-24 sm:left-auto sm:right-4 sm:w-[min(22rem,calc(100vw-2rem))] md:bottom-28 md:right-8">
          <div className="border-b border-border/50 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Quick contact</p>
            <p className="text-xs text-muted-foreground">Choose the fastest way to reach the team.</p>
          </div>

          <div className="space-y-3 p-4">
            <Link
              href="/get-a-quote"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-background p-3 transition-all hover:bg-muted focus-visible:bg-muted"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageCircle className="size-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Get a Quote</p>
                <p className="text-xs text-muted-foreground">Share your requirement list</p>
              </div>
            </Link>

            {primaryPhone ? (
              <a
                href={formatPhoneHref(primaryPhone)}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-background p-3 transition-all hover:bg-muted focus-visible:bg-muted"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="size-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Call</p>
                  <p className="text-xs text-muted-foreground">Speak with the procurement desk</p>
                </div>
              </a>
            ) : null}

            {primaryEmail ? (
              <a
                href={formatMailtoHref(primaryEmail)}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-background p-3 transition-all hover:bg-muted focus-visible:bg-muted"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground">Send details for a written reply</p>
                </div>
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
