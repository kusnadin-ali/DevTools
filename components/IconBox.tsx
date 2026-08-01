import type { ReactNode } from "react";

export default function IconBox({
  children,
  borderColor = "var(--color-accent)",
}: {
  children: ReactNode;
  borderColor?: string;
}) {
  return (
    <div
      className="flex h-11 w-11 flex-none items-center justify-center rounded-lg border-[1.5px]"
      style={{ borderColor }}
    >
      {children}
    </div>
  );
}
