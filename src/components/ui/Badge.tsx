import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant =
  | "brand"
  | "accent"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral";

export type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  brand: "bg-brand/10 text-brand border border-brand/20",
  accent: "bg-accent/10 text-accent border border-accent/20",
  success: "bg-success-subtle text-status-success border border-success/20",
  danger: "bg-danger-subtle text-status-danger border border-danger/20",
  warning: "bg-warning-subtle text-status-warning border border-warning/20",
  info: "bg-info-subtle text-status-info border border-info/20",
  neutral: "bg-surface-muted text-fg-muted border border-border",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs font-semibold rounded-md",
  md: "px-3 py-1 text-sm font-semibold rounded-full",
};

export function Badge({
  children,
  variant = "brand",
  size = "md",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center text-center select-none font-sans",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
