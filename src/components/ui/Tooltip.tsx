"use client";

import {
  cloneElement,
  useState,
  useId,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { cn } from "@/lib/utils/cn";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: TooltipPosition;
  className?: string;
}

const positionClasses: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2 origin-top",
  left: "right-full top-1/2 -translate-y-1/2 mr-2 origin-right",
  right: "left-full top-1/2 -translate-y-1/2 ml-2 origin-left",
};

const arrowClasses: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-[var(--surface-inverse)] border-x-transparent border-b-transparent border-[5px]",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[var(--surface-inverse)] border-x-transparent border-t-transparent border-[5px]",
  left: "left-full top-1/2 -translate-y-1/2 border-l-[var(--surface-inverse)] border-y-transparent border-r-transparent border-[5px]",
  right: "right-full top-1/2 -translate-y-1/2 border-r-[var(--surface-inverse)] border-y-transparent border-l-transparent border-[5px]",
};

export function Tooltip({
  children,
  content,
  position = "top",
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  interface ChildProps {
    onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
    onFocus?: (e: FocusEvent<HTMLElement>) => void;
    onBlur?: (e: FocusEvent<HTMLElement>) => void;
    "aria-describedby"?: string;
  }

  const childrenElement = children as ReactElement<ChildProps>;

  // Extend the child element to attach event listeners and aria tags
  const triggerElement = cloneElement(childrenElement, {
    "aria-describedby": tooltipId,
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      showTooltip();
      childrenElement.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      hideTooltip();
      childrenElement.props.onMouseLeave?.(e);
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      showTooltip();
      childrenElement.props.onFocus?.(e);
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      hideTooltip();
      childrenElement.props.onBlur?.(e);
    },
  });

  return (
    <div className="relative inline-block">
      {triggerElement}
      
      {/* Tooltip Content Bubble */}
      <div
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isVisible}
        className={cn(
          "absolute z-[var(--z-skip-link)] px-3 py-1.5 rounded-lg text-xs font-semibold",
          "bg-surface-inverse text-fg-inverse pointer-events-none select-none max-w-xs w-max shadow-md",
          "transition-all duration-[var(--duration-fast)] ease-out",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
          positionClasses[position],
          className
        )}
      >
        {content}
        {/* Arrow pointer */}
        <div className={cn("absolute w-0 h-0 border-solid", arrowClasses[position])} />
      </div>
    </div>
  );
}
