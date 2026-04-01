import React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "violet" | "cyan" | "zinc" | "emerald";
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = "zinc" }) => {
  const variants = {
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    zinc: "bg-zinc-800 text-zinc-400 border-zinc-700",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider", variants[variant], className)}>
      {children}
    </span>
  );
};
