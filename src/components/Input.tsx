import React from "react";
import { cn } from "../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
}

export const Input = ({ label, error, multiline, className, placeholder, value, onChange, ...props }: InputProps) => {
  const Component = multiline ? "textarea" : "input";
  
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</label>}
      <Component
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all",
          multiline && "min-h-[120px] resize-none",
          error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10",
          className
        )}
        {...(props as any)}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
