import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Container className={cn("py-16 text-center flex flex-col items-center justify-center", className)}>
      {/* Friendly Smart Star Mascot SVG */}
      <svg
        viewBox="0 0 160 160"
        className="w-36 h-36 mb-6 text-brand drop-shadow-md animate-bounce duration-[3s]"
        aria-hidden="true"
      >
        {/* Shadow */}
        <ellipse cx="80" cy="140" rx="30" ry="6" fill="var(--fg-subtle)" opacity="0.15" />
        
        {/* Star Body */}
        <path
          d="M80 15 L98 55 L141 57 L107 88 L118 130 L80 108 L42 130 L53 88 L19 57 L62 55 Z"
          fill="var(--accent)"
          stroke="var(--accent-hover)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Graduation/Smart Cap */}
        <path d="M60 30 L80 20 L100 30 L80 40 Z" fill="var(--fg-inverse)" stroke="var(--surface-inverse)" strokeWidth="2" />
        <path d="M80 30 L80 44" stroke="var(--surface-inverse)" strokeWidth="2" />
        <path d="M100 30 L104 38 L104 42" stroke="var(--surface-inverse)" strokeWidth="1.5" fill="none" />
        <rect x="74" y="32" width="12" height="6" fill="var(--brand)" rx="1" />

        {/* Cute Big Smart Glasses */}
        {/* Left lens */}
        <circle cx="68" cy="74" r="10" fill="none" stroke="var(--surface-inverse)" strokeWidth="2.5" />
        {/* Right lens */}
        <circle cx="92" cy="74" r="10" fill="none" stroke="var(--surface-inverse)" strokeWidth="2.5" />
        {/* Bridge */}
        <path d="M78 74 L82 74" stroke="var(--surface-inverse)" strokeWidth="2.5" />
        {/* Frame extensions */}
        <path d="M58 74 L54 74" stroke="var(--surface-inverse)" strokeWidth="2" />
        <path d="M102 74 L106 74" stroke="var(--surface-inverse)" strokeWidth="2" />

        {/* Eyes (inside glasses) */}
        <circle cx="68" cy="74" r="3.5" fill="var(--surface-inverse)" />
        <circle cx="92" cy="74" r="3.5" fill="var(--surface-inverse)" />
        {/* Catchlight */}
        <circle cx="66.5" cy="72.5" r="1" fill="var(--surface)" />
        <circle cx="90.5" cy="72.5" r="1" fill="var(--surface)" />

        {/* Friendly Rosy Cheeks */}
        <circle cx="56" cy="84" r="5" fill="var(--status-danger)" opacity="0.4" />
        <circle cx="104" cy="84" r="5" fill="var(--status-danger)" opacity="0.4" />

        {/* Smiling Mouth */}
        <path
          d="M74 85 Q80 92 86 85"
          fill="none"
          stroke="var(--surface-inverse)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <h3 className="text-2xl font-bold text-fg mb-3 font-display max-w-md">
        {title}
      </h3>
      
      <p className="text-base text-fg-muted max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {action && <div className="flex items-center justify-center">{action}</div>}
    </Container>
  );
}
