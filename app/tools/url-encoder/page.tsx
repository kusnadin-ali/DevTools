"use client";

import { useRef, useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
import LineNumberGutter from "@/components/LineNumberGutter";
import NumberedText from "@/components/NumberedText";
import { tools } from "@/lib/tools";

export default function UrlEncoderPage() {
  const tool = tools.find((t) => t.slug === "url-encoder")!;

  const [input, setInput] = useState("https://zerf.tools/search?q=zerf tools & devtools");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputGutterRef = useRef<HTMLDivElement>(null);

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
  const outputBorder = error ? "var(--color-accent)" : "var(--color-card-border)";

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
          <div className="flex h-[300px] w-full overflow-hidden rounded-[10px] border-[1.5px] border-card-border bg-card-bg shadow-[0_3px_10px_rgba(48,56,65,0.06)]">
            <LineNumberGutter ref={inputGutterRef} lineCount={input.split("\n").length} />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onScroll={(e) => {
                if (inputGutterRef.current) inputGutterRef.current.scrollTop = e.currentTarget.scrollTop;
              }}
              placeholder="Tulis URL atau teks ter-encode di sini..."
              spellCheck={false}
              className="flex-1 resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent py-4 pr-4 pl-2.5 font-mono text-[13.5px] leading-relaxed text-root-text outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span
            className={`font-mono text-[11px] font-bold uppercase tracking-[0.08em] ${
              error ? "text-accent" : "text-text-secondary"
            }`}
          >
            {error ? "Error" : "Output"}
          </span>
          <div
            style={{ borderColor: outputBorder }}
            className="box-border h-[300px] w-full overflow-auto rounded-[10px] border-[1.5px] bg-card-bg shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          >
            {outputDisplay ? (
              <NumberedText text={outputDisplay} accent={!!error} />
            ) : (
              <span className="mt-4 block px-4 font-mono text-[13.5px] text-text-secondary/50">
                Hasil akan tampil di sini...
              </span>
            )}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
