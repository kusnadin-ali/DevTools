"use client";

import { useMemo, useState } from "react";

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const KEY_COLOR = "#1565C0";
const VALUE_COLOR = "var(--color-accent)";

type Segment = { text: string; color?: string; italic?: boolean };
type Line = {
  key: string;
  depth: number;
  segments: Segment[];
  toggle?: { path: string; collapsed: boolean };
};

// ponytail: re-flattens the whole tree on every collapse toggle — fine up to
// a few thousand lines, switch to per-subtree memoization or virtualization
// if huge payloads make this noticeably slow.
function flatten(value: Json, collapsed: Set<string>): Line[] {
  const lines: Line[] = [];
  let n = 0;
  const push = (depth: number, segments: Segment[], toggle?: Line["toggle"]) =>
    lines.push({ key: `l${n++}`, depth, segments, toggle });

  function walk(v: Json, depth: number, keyLabel: string | null, path: string, comma: boolean) {
    const prefix: Segment[] = keyLabel !== null ? [{ text: `"${keyLabel}": `, color: KEY_COLOR }] : [];
    const suffix: Segment[] = comma ? [{ text: "," }] : [];

    if (v === null || typeof v !== "object") {
      push(depth, [...prefix, { text: JSON.stringify(v), color: VALUE_COLOR }, ...suffix]);
      return;
    }

    const isArray = Array.isArray(v);
    const entries: [string, Json][] = isArray
      ? v.map((item, i): [string, Json] => [String(i), item])
      : Object.entries(v);
    const open = isArray ? "[" : "{";
    const close = isArray ? "]" : "}";

    if (entries.length === 0) {
      push(depth, [...prefix, { text: `${open}${close}` }, ...suffix]);
      return;
    }

    if (collapsed.has(path)) {
      const label = isArray
        ? `${entries.length} item${entries.length === 1 ? "" : "s"}`
        : `${entries.length} key${entries.length === 1 ? "" : "s"}`;
      push(
        depth,
        [...prefix, { text: `${open} ` }, { text: label, italic: true }, { text: ` ${close}` }, ...suffix],
        { path, collapsed: true }
      );
      return;
    }

    push(depth, [...prefix, { text: open }], { path, collapsed: false });
    entries.forEach(([k, item], i) => {
      walk(item, depth + 1, isArray ? null : k, `${path}.${k}`, i < entries.length - 1);
    });
    push(depth, [{ text: close }, ...suffix]);
  }

  walk(value, 0, null, "$", false);
  return lines;
}

export default function JsonTreeView({ value }: { value: Json }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const lines = useMemo(() => flatten(value, collapsed), [value, collapsed]);

  function toggle(path: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  return (
    <div className="font-mono text-[13.5px] leading-relaxed">
      {lines.map((line, i) => (
        <div key={line.key} className="flex items-start">
          <span className="w-10 flex-none select-none border-r border-card-border pr-2 text-right text-text-secondary/50">
            {i + 1}
          </span>
          <span className="flex min-w-0 items-start gap-1" style={{ paddingLeft: line.depth * 16 + 10 }}>
            {line.toggle ? (
              <button
                type="button"
                onClick={() => toggle(line.toggle!.path)}
                aria-label={line.toggle.collapsed ? "Perluas" : "Ciutkan"}
                className="mt-px flex h-3.5 w-3.5 flex-none cursor-pointer items-center justify-center text-[10px] text-text-secondary/70 hover:text-accent"
              >
                {line.toggle.collapsed ? "▸" : "▾"}
              </button>
            ) : (
              <span className="w-3.5 flex-none" />
            )}
            <span className="whitespace-pre-wrap break-words">
              {line.segments.map((seg, si) => (
                <span
                  key={si}
                  style={{ color: seg.color }}
                  className={seg.italic ? "italic text-text-secondary/70" : undefined}
                >
                  {seg.text}
                </span>
              ))}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
