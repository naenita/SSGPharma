"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Slightly larger travel for hero blocks */
  y?: number;
};

/**
 * Scroll-triggered fade — respects prefers-reduced-motion so we don't make anyone dizzy.
 */
export function FadeIn({ children, className, delay = 0, y = 14 }: FadeInProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={reduce ? undefined : { duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
