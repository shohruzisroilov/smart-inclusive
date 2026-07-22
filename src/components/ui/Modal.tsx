"use client";

import { createPortal } from "react-dom";
import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { XIcon } from "lucide-react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  closeOnBackdropClick = true,
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const tc = useTranslations("common");

  // Focus trap: locks focus within containerRef when open, trigger onClose on ESC key
  useFocusTrap(isOpen, containerRef, onClose);
  
  // Scroll lock: locks parent page scrolling when open
  useBodyScrollLock(isOpen);

  if (!isOpen || !hydrated) return null;

  const modalRoot = typeof document !== "undefined" ? document.body : null;

  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-overlay transition-opacity duration-[var(--duration-base)]"
        aria-hidden="true"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      {/* Modal Dialog Content */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative z-[var(--z-drawer)] w-full max-w-lg rounded-2xl bg-surface border border-border p-6 shadow-lg",
          "animate-in fade-in zoom-in-95 duration-[var(--duration-base)] ease-out",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
          {title ? (
            <h2 id="modal-title" className="text-xl font-bold text-fg">
              {title}
            </h2>
          ) : (
            <div aria-hidden="true" />
          )}

          <button
            type="button"
            onClick={onClose}
            className={cn(
              "tap-target flex items-center justify-center rounded-lg text-fg-muted",
              "transition-colors duration-[var(--duration-fast)]",
              "hover:bg-surface-muted hover:text-fg",
              "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
            )}
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">{tc("close")}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="text-base text-fg-muted leading-relaxed max-h-[70dvh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
}
