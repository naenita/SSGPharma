"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(
          j?.error ??
            (res.status === 500
              ? "Server error — check ADMIN_SESSION_SECRET (32+ chars) and restart dev server"
              : "Could not sign in"),
        );
        setLoading(false);
        return;
      }
      setPassword("");
      router.refresh();
    } catch {
      setError("Network error — try again");
    }
    setLoading(false);
  }

  return (
    <motion.div
      className="mx-auto max-w-md pt-10 md:pt-16"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-2xl border-2 border-zinc-700/80 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-8 shadow-2xl shadow-black/40 md:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-teal-400/90">Inventory</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          This URL is not linked on the public site. Use a strong password and keep{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-200">ADMIN_SESSION_SECRET</code> private.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="admin-pass" className="text-zinc-200">
              Password
            </Label>
            <Input
              id="admin-pass"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 border-2 border-zinc-600 bg-zinc-950 text-white placeholder:text-zinc-600 focus-visible:border-teal-500/70"
              required
            />
          </div>
          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-200">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-teal-600 text-white hover:bg-teal-500 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Enter dashboard"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
