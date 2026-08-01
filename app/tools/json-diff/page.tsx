"use client";

import { useState } from "react";
import { diffLines, type Change } from "diff";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
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
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Tempel JSON pertama..."
            className="box-border h-[280px] w-full resize-none rounded-[10px] border-[1.5px] border-card-border bg-white p-4 font-mono text-[13.5px] leading-relaxed text-[#303841] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            JSON B
          </span>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Tempel JSON kedua..."
            className="box-border h-[280px] w-full resize-none rounded-[10px] border-[1.5px] border-card-border bg-white p-4 font-mono text-[13.5px] leading-relaxed text-[#303841] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          />
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
        <div className="box-border min-h-[200px] w-full overflow-auto whitespace-pre-wrap break-words rounded-[10px] border-[1.5px] border-card-border bg-[#303841] p-4 font-mono text-[13.5px] leading-relaxed text-[#F5F5F5] shadow-[0_3px_10px_rgba(48,56,65,0.06)]">
          {error ? (
            `⚠ ${error}`
          ) : diff ? (
            diff.map((part, i) => (
              <div
                key={i}
                className={
                  part.added
                    ? "bg-[rgba(107,122,58,0.35)] text-[#B7D66B]"
                    : part.removed
                      ? "bg-[rgba(156,59,44,0.35)] text-[#FF8A75]"
                      : "text-white/70"
                }
              >
                {part.value
                  .replace(/\n$/, "")
                  .split("\n")
                  .map((line, j) => (
                    <div key={j}>
                      {part.added ? "+ " : part.removed ? "- " : "  "}
                      {line}
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <span className="text-white/40">Klik Compare untuk melihat perbedaan...</span>
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}
