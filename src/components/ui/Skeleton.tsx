import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

export function Skeleton({ className, circle = false }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-surface-muted",
        circle ? "rounded-full" : "rounded-lg",
        className
      )}
    />
  );
}
