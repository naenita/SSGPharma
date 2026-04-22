"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type QuoteFormProps = {
  embedded?: boolean;
  recipientEmail: string;
  priorityPhone: string;
  companyName: string;
};

/** Simple client-side form — hook the submit handler to email/API when you wire production. */
export function QuoteForm({ embedded, recipientEmail, priorityPhone, companyName }: QuoteFormProps) {
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const org = formData.get("org")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";
    const lines = formData.get("lines")?.toString().trim() ?? "";

    const subject = `${companyName} quote request`;
    const body = [
      `${companyName} quote request`,
      "",
      `Organisation: ${org}`,
      `Contact email: ${email}`,
      `Contact phone: ${phone}`,
      "",
      "Line items:",
      lines,
      "",
      `Priority contact: ${priorityPhone}`,
      `Please send the quote request to ${recipientEmail}.`,
    ].join("\n");

    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    setSent(true);
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className={cn(
        "space-y-5",
        embedded
          ? "pt-2"
          : "rounded-2xl border-2 border-border bg-card/80 p-6 shadow-sm md:p-8",
      )}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="space-y-2">
        <Label htmlFor="org">Organisation / hospital name</Label>
        <Input id="org" name="org" required autoComplete="organization" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="lines">Full line-item requirements</Label>
        <Textarea id="lines" name="lines" required rows={6} />
      </div>
      {sent ? (
        <p className="text-sm font-medium text-primary">
          Your email client should open with the quote request. Review the message and send it to complete the request.
        </p>
      ) : (
        <Button type="submit" size="lg">
          Send quote request
        </Button>
      )}
    </motion.form>
  );
}
