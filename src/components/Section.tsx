"use client";

import type React from "react";
import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = MotionProps & {
  className?: string;
  children: React.ReactNode;
};

export function Section({ className, children, ...motionProps }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...motionProps}
    >
      {children}
    </motion.section>
  );
}

