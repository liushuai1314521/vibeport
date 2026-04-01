import React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.01 } : {}}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-xl transition-all duration-300",
        hover && "hover:border-violet-500/30 hover:shadow-[0_20px_50px_rgba(124,58,237,0.1)]",
        className
      )}
    >
      {/* Subtle Gradient Glow */}
      <div className="absolute -inset-px bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
