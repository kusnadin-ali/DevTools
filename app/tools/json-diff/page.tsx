"use client";

import { useRef, useState } from "react";
import { diffLines, type Change } from "diff";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
import LineNumberGutter from "@/components/LineNumberGutter";
import { tools } from "@/lib/tools";

const DEFAULT_LEFT = `{
  "name": "Zerf Tools",
  "version": "1.0.0",
  "active": true
}`;

const DEFAULT_RIGHT = `{
  "name": "Zerf Tools",
  "version": "1.1.0",
  "active": true,
  "beta": true
}`;

function diffRows(diff: Change[]): { type: "added" | "removed" | "same"; text: string }[] {
  return diff.flatMap((part) => {
    const type = part.added ? "added" : part.removed ? "removed" : "same";
    return part.value
      .replace(/\n$/, "")
      .split("\n")
      .map((text) => ({ type, text }) as const);
  });
}

function safeStringify(value: string): { text?: string; error?: string } {
  if (!value.trim()) return { text: "" };
  try {
    return { text: JSON.stringify(JSON.parse(value), null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export default function JsonDiffPage() {
  const tool = tools.find((t) => t.slug === "json-diff")!;

  const [left, setLeft] = useState(DEFAULT_LEFT);
  const [right, setRight] = useState(DEFAULT_RIGHT);
  const [error, setError] = useState("");
  const [diff, setDiff] = useState<Change[] | null>(null);
  const leftGutterRef = useRef<HTMLDivElement>(null);
  const rightGutterRef = useRef<HTMLDivElement>(null);
  const diffGutterRef = useRef<HTMLDivElement>(null);

  function compare() {
    const a = safeStringify(left);
    const b = safeStringify(right);
    if (a.error) return setError(`JSON A tidak valid: ${a.error}`);
    if (b.error) return setError(`JSON B tidak valid: ${b.error}`);
    setError("");
    setDiff(diffLines(a.text ?? "", b.text ?? ""));
  }

  function handleClear() {
    setLeft("");
    setRight("");
    setError("");
    setDiff(null);
  }

  return (
    <ToolPageShell tool={tool}>
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <Button variant="primary" onClick={compare}>
          Compare
        </Button>
        <Button variant="muted" onClick={handleClear}>
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            JSON A
          </span>
          <div className="flex h-[280px] w-full overflow-hidden rounded-[10px] border-[1.5px] border-card-border bg-card-bg shadow-[0_3px_10px_rgba(48,56,65,0.06)]">
            <LineNumberGutter ref={leftGutterRef} lineCount={left.split("\n").length} />
            <textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              onScroll={(e) => {
                if (leftGutterRef.current) leftGutterRef.current.scrollTop = e.currentTarget.scrollTop;
              }}
              placeholder="Tempel JSON pertama..."
              spellCheck={false}
              className="flex-1 resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent py-4 pr-4 pl-2.5 font-mono text-[13.5px] leading-relaxed text-root-text outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            JSON B
          </span>
          <div className="flex h-[280px] w-full overflow-hidden rounded-[10px] border-[1.5px] border-card-border bg-card-bg shadow-[0_3px_10px_rgba(48,56,65,0.06)]">
            <LineNumberGutter ref={rightGutterRef} lineCount={right.split("\n").length} />
            <textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              onScroll={(e) => {
                if (rightGutterRef.current) rightGutterRef.current.scrollTop = e.currentTarget.scrollTop;
              }}
              placeholder="Tempel JSON kedua..."
              spellCheck={false}
              className="flex-1 resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent py-4 pr-4 pl-2.5 font-mono text-[13.5px] leading-relaxed text-root-text outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <span
          className={`font-mono text-[11px] font-bold uppercase tracking-[0.08em] ${
            error ? "text-accent" : "text-text-secondary"
          }`}
        >
          {error ? "Error" : "Perbedaan"}
        </span>
        <div className="flex min-h-[200px] w-full overflow-hidden rounded-[10px] border-[1.5px] border-card-border bg-card-bg shadow-[0_3px_10px_rgba(48,56,65,0.06)]">
          <LineNumberGutter ref={diffGutterRef} lineCount={diff ? diffRows(diff).length : 1} />
          <div
            onScroll={(e) => {
              if (diffGutterRef.current) diffGutterRef.current.scrollTop = e.currentTarget.scrollTop;
            }}
            className="flex-1 overflow-auto whitespace-pre-wrap break-words py-4 pr-4 pl-2.5 font-mono text-[13.5px] leading-relaxed text-root-text"
          >
            {error ? (
              <span className="text-accent">⚠ {error}</span>
            ) : diff ? (
              diffRows(diff).map((row, i) => (
                <div
                  key={i}
                  className={
                    row.type === "added"
                      ? "bg-[rgba(76,175,80,0.18)] text-inherit"
                      : row.type === "removed"
                        ? "bg-[rgba(244,67,54,0.18)] text-inherit"
                        : "text-text-secondary"
                  }
                >
                  {row.type === "added" ? "+ " : row.type === "removed" ? "- " : "  "}
                  {row.text}
                </div>
              ))
            ) : (
              <span className="text-text-secondary/50">Klik Compare untuk melihat perbedaan...</span>
            )}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
