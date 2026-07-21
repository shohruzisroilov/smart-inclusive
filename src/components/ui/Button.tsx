import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg" | "kids";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-fg-on-brand hover:bg-brand-hover active:bg-brand-active",
  secondary:
    "bg-surface text-fg border border-border hover:bg-surface-subtle active:bg-surface-muted",
  ghost: "bg-transparent text-fg hover:bg-surface-muted active:bg-surface-muted",
  // Bolalar bo'limi uchun iliq aksent.
  accent: "bg-accent text-fg-on-brand hover:bg-accent-hover",
};

/**
 * O'lchamlar tegish maydoni talabiga bo'ysunadi:
 * umumiy interfeysda ≥44px, bolalar bo'limida ≥60px.
 */
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm gap-2", // 44px
  md: "h-12 px-5 text-base gap-2", // 48px
  lg: "h-14 px-6 text-lg gap-3", // 56px
  kids: "min-h-[var(--tap-target-kids)] px-7 text-lg gap-3 rounded-xl font-semibold",
};

/**
 * Tugma stillari — `<Link>` ham shu funksiyadan foydalanadi.
 *
 * Nima uchun alohida funksiya: navigatsiya uchun `<button>` emas, `<a>`
 * kerak (o'ng tugma, yangi tabda ochish, ekran o'quvchi uchun to'g'ri rol).
 * Stil esa bir xil bo'lishi shart.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium",
    "transition-colors duration-[var(--duration-fast)]",
    "disabled:pointer-events-none disabled:opacity-50",
    // Fokus halqasi globals.css'da :focus-visible orqali beriladi —
    // bu yerda takrorlamaymiz, shunda u hech qachon tasodifan yo'qolmaydi.
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  );
}
