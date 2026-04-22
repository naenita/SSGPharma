"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function StaggerList({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.ul
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-40px" }}
      variants={
        reduce
          ? undefined
          : {
              hidden: {},
              show: {
                transition: { staggerChildren: 0.06, delayChildren: 0.04 },
              },
            }
      }
    >
      {children}
    </motion.ul>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      className={className}
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }
      }
    >
      {children}
    </motion.li>
  );
}
