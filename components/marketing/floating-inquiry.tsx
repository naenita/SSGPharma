"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { formatMailtoHref, formatPhoneHref } from "@/lib/contact-config";

type FloatingInquiryProps = {
  primaryPhone?: string;
  primaryPhoneLabel?: string;
  primaryEmail?: string;
  hoursLabel: string;
};

export function FloatingInquiry({ primaryPhone, primaryPhoneLabel, primaryEmail, hoursLabel }: FloatingInquiryProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:shadow-xl active:scale-95 md:size-16"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </motion.button>

      {/* Popup Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-80 rounded-2xl border-2 border-border bg-card/95 backdrop-blur shadow-2xl md:bottom-28 md:right-8"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-b border-border/50 p-4">
              <p className="font-medium text-foreground">Need a quote?</p>
              <p className="text-xs text-muted-foreground">We are here to help with your medicine procurement.</p>
            </div>

            <div className="space-y-3 p-4">
              <Link href="/get-a-quote" className="flex w-full gap-3 rounded-lg border border-border/50 bg-background p-3 transition-all hover:bg-muted">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <MessageCircle className="size-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Upload your list</p>
                  <p className="text-xs text-muted-foreground">Send requirements</p>
                </div>
              </Link>

              {primaryPhone ? (
                <a href={formatPhoneHref(primaryPhone)} className="flex w-full gap-3 rounded-lg border border-border/50 bg-background p-3 transition-all hover:bg-muted">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="size-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Call us</p>
                    <p className="text-xs text-muted-foreground">{primaryPhoneLabel || primaryPhone}</p>
                  </div>
                </a>
              ) : null}

              {primaryEmail ? (
                <a href={formatMailtoHref(primaryEmail)} className="flex w-full gap-3 rounded-lg border border-border/50 bg-background p-3 transition-all hover:bg-muted">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="size-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Email us</p>
                    <p className="text-xs text-muted-foreground">{primaryEmail}</p>
                  </div>
                </a>
              ) : null}
            </div>

            <div className="border-t border-border/50 p-3 text-center text-xs text-muted-foreground">
              {hoursLabel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
