import { cn } from "@/lib/utils/cn";

export type LoadingSize = "sm" | "md" | "lg";

interface LoadingStateProps {
  size?: LoadingSize;
  overlay?: boolean;
  text?: string;
  className?: string;
}

const sizeClasses: Record<LoadingSize, string> = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-3",
  lg: "h-14 w-14 border-4",
};

export function LoadingState({
  size = "md",
  overlay = false,
  text = "Yuklanmoqda...",
  className,
}: LoadingStateProps) {
  const spinnerElement = (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Accessible Polite Status Screen Reader text */}
      <div role="status" aria-live="polite" className="sr-only">
        {text}
      </div>
      
      {/* CSS Spinner */}
      <div
        className={cn(
          "animate-spin rounded-full border-t-brand border-r-transparent border-b-transparent border-l-transparent",
          "border-solid border-border-strong",
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      
      {text && (
        <span className="mt-3 text-sm font-semibold text-fg-muted select-none">
          {text}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-overlay/60 backdrop-blur-xs",
          className
        )}
      >
        <div className="rounded-2xl bg-surface border border-border p-8 shadow-lg">
          {spinnerElement}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-6", className)}>
      {spinnerElement}
    </div>
  );
}
