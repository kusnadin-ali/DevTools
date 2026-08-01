"use client";

import { useRef, useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
import { tools } from "@/lib/tools";

export default function UrlEncoderPage() {
  const tool = tools.find((t) => t.slug === "url-encoder")!;

  const [input, setInput] = useState("https://zerf.tools/search?q=zerf tools & devtools");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function encode() {
    if (!input) {
      setOutput("");
      setError("");
      return;
    }
    setOutput(encodeURIComponent(input));
    setError("");
  }

  function decode() {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      setOutput(decodeURIComponent(input));
      setError("");
    } catch {
      setOutput("");
      setError("Encoded URL tidak valid (persen-encoding rusak).");
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
  const outputBorder = error ? "var(--color-accent)" : "rgba(48,56,65,0.18)";

  return (
    <ToolPageShell tool={tool}>
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <Button variant="primary" onClick={encode}>
          Encode
        </Button>
        <Button variant="secondary" onClick={decode}>
          Decode
        </Button>
        <Button variant="secondary" onClick={handleCopy}>
          {copyLabel}
        </Button>
        <Button variant="muted" onClick={handleClear}>
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Input
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis URL atau teks ter-encode di sini..."
            className="box-border h-[300px] w-full resize-none rounded-[10px] border-[1.5px] border-card-border bg-white p-4 font-mono text-[13.5px] leading-relaxed text-[#303841] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span
            className={`font-mono text-[11px] font-bold uppercase tracking-[0.08em] ${
              error ? "text-accent" : "text-text-secondary"
            }`}
          >
            {error ? "Error" : "Output"}
          </span>
          <textarea
            readOnly
            value={outputDisplay}
            placeholder="Hasil akan tampil di sini..."
            style={{ borderColor: outputBorder }}
            className="box-border h-[300px] w-full resize-none rounded-[10px] border-[1.5px] bg-[#303841] p-4 font-mono text-[13.5px] leading-relaxed text-[#F5F5F5] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
