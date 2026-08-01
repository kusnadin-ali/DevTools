"use client";

import { useRef, useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
import { tools } from "@/lib/tools";
import { highlightJson } from "@/lib/highlightJson";

const DEFAULT_INPUT = `{
  "name": "Zerf Tools",
  "version": "1.0.0",
  "tools": ["json-formatter", "base64", "regex"],
  "active": true
}`;

export default function JsonFormatterPage() {
  const tool = tools.find((t) => t.slug === "json-formatter")!;

  const [input, setInput] = useState(DEFAULT_INPUT);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState("2");
  const [copyLabel, setCopyLabel] = useState("Copy");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function format(minify: boolean) {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const space = minify ? undefined : indent === "tab" ? "\t" : Number(indent);
      setOutput(JSON.stringify(parsed, null, space));
      setError("");
    } catch (e) {
      setOutput("");
      setError((e as Error).message);
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  function handleCopy() {
    const text = error || output;
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopyLabel("Copied!");
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyLabel("Copy"), 1200);
  }

  const outputDisplay = error ? `⚠ ${error}` : output;
  const statusLabel = error ? "Error" : "Output";
  const outputBorder = error ? "var(--color-accent)" : "rgba(48,56,65,0.18)";

  return (
    <ToolPageShell tool={tool}>
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <Button variant="primary" onClick={() => format(false)}>
          Format
        </Button>
        <Button variant="secondary" onClick={() => format(true)}>
          Minify
        </Button>
        <Button variant="secondary" onClick={handleCopy}>
          {copyLabel}
        </Button>
        <Button variant="muted" onClick={handleClear}>
          Clear
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[11.5px] text-text-secondary">Indent</span>
          <select
            value={indent}
            onChange={(e) => setIndent(e.target.value)}
            className="cursor-pointer rounded-md border-[1.5px] border-card-border bg-card-bg px-2.5 py-1.5 font-mono text-[12.5px] text-root-text"
          >
            <option value="2">2 spasi</option>
            <option value="4">4 spasi</option>
            <option value="tab">Tab</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Input
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tempel JSON kamu di sini..."
            className="box-border h-[440px] w-full resize-none rounded-[10px] border-[1.5px] border-card-border bg-white p-4 font-mono text-[13.5px] leading-relaxed text-[#303841] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span
            className={`font-mono text-[11px] font-bold uppercase tracking-[0.08em] ${
              error ? "text-accent" : "text-text-secondary"
            }`}
          >
            {statusLabel}
          </span>
          <div
            style={{ borderColor: outputBorder }}
            className="box-border h-[440px] w-full overflow-auto whitespace-pre-wrap break-words rounded-[10px] border-[1.5px] bg-[#303841] p-4 font-mono text-[13.5px] leading-relaxed text-[#F5F5F5] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          >
            {!error && output ? (
              <code dangerouslySetInnerHTML={{ __html: highlightJson(output) }} />
            ) : outputDisplay ? (
              outputDisplay
            ) : (
              <span className="text-white/40">Hasil akan tampil di sini...</span>
            )}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
