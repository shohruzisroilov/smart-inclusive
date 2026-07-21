import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Semantik teg: `section`, `header`, `footer` va h.k. */
  as?: ElementType;
  /** Tor variant — matnli kontent uchun (o'qish qulayligi). */
  size?: "default" | "narrow" | "wide";
}

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-[var(--container-max)]",
  wide: "max-w-[1536px]",
};

/**
 * Sahifa kengligini va yon bo'shliqni boshqaradigan yagona joy.
 *
 * Planshet-first: base padding planshet uchun (24px),
 * telefonda kichrayadi, laptopda kattalashadi.
 */
export function Container({
  children,
  className,
  as: Component = "div",
  size = "default",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-6 max-phone:px-4 laptop:px-8",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
