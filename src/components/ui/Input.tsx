import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================================================
// LABEL
// ============================================================================
interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-semibold text-fg-muted mb-2 select-none", className)}
      {...props}
    >
      {children}
      {required && <span className="text-status-danger ml-1" aria-hidden="true">*</span>}
    </label>
  );
}

// ============================================================================
// TEXT INPUT
// ============================================================================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  variant?: "default" | "kids";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, variant = "default", id: customId, className, type = "text", ...props }, ref) => {
    const defaultId = useId();
    const id = customId || defaultId;
    const errorId = `${id}-error`;

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full rounded-lg border border-border bg-surface text-fg",
            "px-4 text-base font-medium transition-all duration-[var(--duration-fast)]",
            "focus:border-border-strong disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2",
            // Height: General UI uses 44px min, Kids uses 52px
            variant === "kids" ? "h-13 rounded-xl border-accent/30 focus:border-accent" : "h-11",
            error && "border-status-danger focus:border-status-danger",
            className
          )}
          {...props}
        />
        {error && <FormError id={errorId}>{error}</FormError>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ============================================================================
// TEXTAREA
// ============================================================================
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  variant?: "default" | "kids";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, variant = "default", id: customId, className, rows = 4, ...props }, ref) => {
    const defaultId = useId();
    const id = customId || defaultId;
    const errorId = `${id}-error`;

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full rounded-lg border border-border bg-surface text-fg",
            "p-4 text-base font-medium transition-all duration-[var(--duration-fast)] resize-y",
            "focus:border-border-strong disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2",
            variant === "kids" ? "rounded-xl border-accent/30 focus:border-accent" : "",
            error && "border-status-danger focus:border-status-danger",
            className
          )}
          {...props}
        />
        {error && <FormError id={errorId}>{error}</FormError>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ============================================================================
// SELECT
// ============================================================================
interface SelectProps {
  label?: string;
  error?: string;
  required?: boolean;
  variant?: "default" | "kids";
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  /** shadcn uslubidagi handler. */
  onValueChange?: (value: string) => void;
  /** Orqaga moslik — native `onChange` kabi `e.target.value` beradi. */
  onChange?: (event: { target: { value: string } }) => void;
}

/**
 * shadcn/ui Select ustidagi qulay o'ram: `options` + `label`/`error` API'sini
 * saqlaydi, ammo ichida Radix asosidagi shadcn Select ishlaydi.
 */
export function Select({
  label,
  error,
  required,
  variant = "default",
  options,
  value,
  defaultValue,
  placeholder,
  disabled,
  name,
  id: customId,
  className,
  onValueChange,
  onChange,
}: SelectProps) {
  const defaultId = useId();
  const id = customId || defaultId;
  const errorId = `${id}-error`;

  const handleValueChange = (next: string) => {
    onValueChange?.(next);
    // Eski `onChange={(e) => e.target.value}` chaqiruvlari ishlashda davom etsin.
    onChange?.({ target: { value: next } });
  };

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <SelectRoot
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            variant === "kids" && "rounded-xl border-accent/30",
            error && "border-status-danger",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      {error && <FormError id={errorId}>{error}</FormError>}
    </div>
  );
}

// ============================================================================
// CHECKBOX
// ============================================================================
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, error, id: customId, className, ...props }, ref) => {
    const defaultId = useId();
    const id = customId || defaultId;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className={cn(
            "inline-flex items-start gap-3 cursor-pointer select-none text-fg-muted",
            "min-h-[var(--tap-target-min)] py-1 text-base leading-snug",
            className
          )}
        >
          <div className="relative flex items-center mt-0.5">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? errorId : undefined}
              className="peer sr-only"
              {...props}
            />
            {/* Visual Box */}
            <div
              className={cn(
                "h-5 w-5 rounded-md border border-border bg-surface transition-all duration-[var(--duration-fast)]",
                "peer-checked:bg-brand peer-checked:border-brand flex items-center justify-center text-fg-inverse",
                "peer-focus-visible:outline-3 peer-focus-visible:outline-[var(--focus-ring)] peer-focus-visible:outline-offset-2",
                "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                error && "border-status-danger"
              )}
            >
              <svg
                viewBox="0 0 12 12"
                className="h-3 w-3 stroke-current fill-none stroke-[2] opacity-0 peer-checked:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                <path d="M2.5 6.5l2.5 2.5 4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <span>{children}</span>
        </label>
        {error && <FormError id={errorId} className="ml-8">{error}</FormError>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// ============================================================================
// RADIO
// ============================================================================
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children: ReactNode;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, error, id: customId, className, ...props }, ref) => {
    const defaultId = useId();
    const id = customId || defaultId;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className={cn(
            "inline-flex items-start gap-3 cursor-pointer select-none text-fg-muted",
            "min-h-[var(--tap-target-min)] py-1 text-base leading-snug",
            className
          )}
        >
          <div className="relative flex items-center mt-0.5">
            <input
              ref={ref}
              id={id}
              type="radio"
              aria-describedby={error ? errorId : undefined}
              className="peer sr-only"
              {...props}
            />
            {/* Visual Dot */}
            <div
              className={cn(
                "h-5 w-5 rounded-full border border-border bg-surface transition-all duration-[var(--duration-fast)]",
                "peer-checked:border-brand flex items-center justify-center",
                "peer-focus-visible:outline-3 peer-focus-visible:outline-[var(--focus-ring)] peer-focus-visible:outline-offset-2",
                "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                error && "border-status-danger"
              )}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-brand opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          <span>{children}</span>
        </label>
        {error && <FormError id={errorId} className="ml-8">{error}</FormError>}
      </div>
    );
  }
);
Radio.displayName = "Radio";

// ============================================================================
// FORM ERROR HELPER
// ============================================================================
interface FormErrorProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export function FormError({ children, id, className }: FormErrorProps) {
  return (
    <p
      id={id}
      role="status"
      aria-live="polite"
      className={cn("mt-1.5 text-sm font-semibold text-status-danger", className)}
    >
      {children}
    </p>
  );
}
