import type { HTMLAttributes, ReactNode, ComponentPropsWithoutRef } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export type CardVariant = "default" | "interactive" | "subtle";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function Card({
  children,
  variant = "default",
  href,
  onClick,
  className,
  ...props
}: CardProps) {
  const isInteractive = !!href || !!onClick;
  const currentVariant = isInteractive && variant === "default" ? "interactive" : variant;

  const baseClasses = cn(
    "rounded-xl transition-all duration-[var(--duration-base)] ease-out text-fg",
    // Layout and sizing
    "flex flex-col overflow-hidden",
    // Focus indicator
    "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2",
    // Variant classes
    currentVariant === "default" && "border border-border bg-surface shadow-sm",
    currentVariant === "interactive" && [
      "border border-border bg-surface shadow-sm cursor-pointer",
      "hover:border-border-strong hover:shadow-md hover:-translate-y-0.5",
      "active:translate-y-0 active:shadow-sm",
    ],
    currentVariant === "subtle" && "bg-surface-subtle border border-transparent",
    className
  );

  if (href) {
    const linkProps = props as Omit<ComponentPropsWithoutRef<typeof Link>, "href">;
    return (
      <Link
        href={href}
        className={baseClasses}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  if (onClick) {
    const buttonProps = props as Omit<ComponentPropsWithoutRef<"button">, "onClick">;
    return (
      <button
        type="button"
        onClick={onClick}
        className={baseClasses}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "px-6 py-5 max-phone:px-4 max-phone:py-4 border-b border-border/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div
      className={cn(
        "flex-1 px-6 py-5 max-phone:px-4 max-phone:py-4 text-base text-fg-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "px-6 py-4 max-phone:px-4 max-phone:py-3 border-t border-border/50 bg-surface-subtle/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
