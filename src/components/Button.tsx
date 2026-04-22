"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800/35",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-maroon-800 text-white shadow-luxeSoft hover:bg-maroon-900 active:translate-y-[1px]",
        variant === "secondary" &&
          "bg-blush-100 text-zinc-900 shadow-luxeSoft hover:bg-blush-200 active:translate-y-[1px]",
        variant === "ghost" && "bg-transparent text-zinc-900 hover:bg-zinc-900/5",
        className
      )}
      {...props}
    />
  );
}

