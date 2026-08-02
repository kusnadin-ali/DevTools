import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "muted";

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "border-0 bg-accent text-[#F5F5F5] shadow-[0_3px_0_var(--color-accent-dark)] hover:translate-y-[1px] hover:shadow-[0_2px_0_var(--color-accent-dark)]",
  secondary:
    "border-[1.5px] border-card-border bg-card-bg text-root-text hover:border-accent hover:text-accent",
  muted:
    "border-[1.5px] border-card-border bg-card-bg text-text-secondary hover:border-root-text hover:text-root-text",
};

export default function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-lg px-[18px] py-2.5 text-[13.5px] font-bold cursor-pointer transition-all duration-[120ms] ease-out disabled:pointer-events-none disabled:opacity-50 ${VARIANT_CLASS[variant]} ${className}`}
    />
  );
}
