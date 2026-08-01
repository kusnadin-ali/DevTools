import Link from "next/link";
import IconBox from "@/components/IconBox";
import type { Tool } from "@/lib/tools";

export default function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <div
      id={`tool-${index}`}
      className="group relative flex flex-col gap-3.5 rounded-xl border-[1.5px] border-card-border bg-card-bg px-6 py-[26px] shadow-[0_3px_10px_rgba(48,56,65,0.1)] transition-all duration-[180ms] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(48,56,65,0.16)]"
    >
      <div className="pointer-events-none absolute inset-[5px] rounded-lg border border-card-inner-border" />

      {tool.badge && (
        <div
          className="absolute -top-3 right-4 -rotate-4 rounded-[20px] border-[1.5px] border-dashed bg-root-bg px-[9px] py-1 font-mono text-[10px] font-bold tracking-[0.08em]"
          style={{ borderColor: tool.badgeColor, color: tool.badgeColor }}
        >
          {tool.badge}
        </div>
      )}

      <div className="flex items-center gap-3.5">
        <IconBox borderColor={tool.iconColor}>
          <div
            className="h-4 w-4"
            style={{ background: tool.iconColor, borderRadius: tool.iconShape }}
          />
        </IconBox>
        <span className="rounded bg-tag-bg px-2 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.09em] text-tag-text">
          {tool.tag}
        </span>
      </div>

      <h3 className="m-0 font-fraunces text-xl font-semibold">{tool.name}</h3>
      <p className="m-0 flex-1 text-[14.5px] leading-[1.55] text-text-secondary">
        {tool.desc}
      </p>

      <Link
        href={tool.href}
        className="flex w-fit items-center gap-1.5 border-b-2 border-transparent text-sm font-bold text-accent no-underline transition-colors hover:border-accent"
      >
        Buka Tool <span>→</span>
      </Link>
    </div>
  );
}
