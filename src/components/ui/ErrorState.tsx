import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";

interface ErrorStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  errorCode?: string;
  className?: string;
}

export function ErrorState({
  title,
  description,
  action,
  errorCode,
  className,
}: ErrorStateProps) {
  return (
    <Container className={cn("py-16 text-center flex flex-col items-center justify-center", className)}>
      {/* Friendly concerned Star Mascot SVG (Not scary for children, has a cute band-aid) */}
      <svg
        viewBox="0 0 160 160"
        className="w-36 h-36 mb-6 text-brand drop-shadow-md animate-pulse duration-[2s]"
        aria-hidden="true"
      >
        {/* Shadow */}
        <ellipse cx="80" cy="140" rx="25" ry="5" fill="var(--fg-subtle)" opacity="0.1" />

        {/* Star Body */}
        <path
          d="M80 15 L98 55 L141 57 L107 88 L118 130 L80 108 L42 130 L53 88 L19 57 L62 55 Z"
          fill="var(--accent)"
          stroke="var(--accent-hover)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Cute Band-aid on the left star point */}
        <g transform="translate(34, 60) rotate(-35)">
          <rect x="0" y="0" width="16" height="8" fill="#fbd5c0" rx="1.5" stroke="#e0b49f" strokeWidth="1" />
          <circle cx="5" cy="4" r="0.5" fill="#d09f87" />
          <circle cx="8" cy="4" r="0.5" fill="#d09f87" />
          <circle cx="11" cy="4" r="0.5" fill="#d09f87" />
        </g>

        {/* Glasses slightly askew */}
        <g transform="translate(0, 2) rotate(-5 80 74)">
          {/* Left lens */}
          <circle cx="68" cy="74" r="10" fill="none" stroke="var(--surface-inverse)" strokeWidth="2.5" />
          {/* Right lens */}
          <circle cx="92" cy="74" r="10" fill="none" stroke="var(--surface-inverse)" strokeWidth="2.5" />
          {/* Bridge */}
          <path d="M78 74 L82 74" stroke="var(--surface-inverse)" strokeWidth="2.5" />
          {/* Extensions */}
          <path d="M58 74 L54 74" stroke="var(--surface-inverse)" strokeWidth="2" />
          <path d="M102 74 L106 74" stroke="var(--surface-inverse)" strokeWidth="2" />

          {/* Eyes showing concern (curved up-inward) */}
          <path d="M65 72 Q68 75 71 72" fill="none" stroke="var(--surface-inverse)" strokeWidth="2" strokeLinecap="round" />
          <path d="M89 72 Q92 75 95 72" fill="none" stroke="var(--surface-inverse)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Small Rosy Cheeks */}
        <circle cx="56" cy="85" r="4.5" fill="var(--status-danger)" opacity="0.3" />
        <circle cx="104" cy="85" r="4.5" fill="var(--status-danger)" opacity="0.3" />

        {/* Puzzled/Concerned mouth */}
        <path
          d="M76 88 Q80 84 84 88"
          fill="none"
          stroke="var(--surface-inverse)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <h3 className="text-2xl font-bold text-fg mb-2 font-display max-w-md">
        {title}
      </h3>

      {errorCode && (
        <span className="inline-block text-xs font-mono bg-danger-subtle text-status-danger px-2.5 py-0.5 rounded-md mb-4 font-semibold">
          {errorCode}
        </span>
      )}
      
      <p className="text-base text-fg-muted max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {action && <div className="flex items-center justify-center">{action}</div>}
    </Container>
  );
}
