export default function GlyphBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex h-[18px] min-w-[24px] items-center justify-center rounded border border-current/25 px-1 font-mono text-[10px] font-bold leading-none opacity-80">
      {children}
    </span>
  );
}
