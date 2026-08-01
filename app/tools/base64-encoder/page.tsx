"use client";

import { useRef, useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
import { tools } from "@/lib/tools";

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(b64: string): string {
  const binary = atob(b64.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export default function Base64EncoderPage() {
  const tool = tools.find((t) => t.slug === "base64-encoder")!;

  const [input, setInput] = useState("Zerf Tools");
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
    setOutput(toBase64(input));
    setError("");
  }

  function decode() {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      setOutput(fromBase64(input));
      setError("");
    } catch {
      setOutput("");
      setError("Base64 tidak valid atau bukan teks UTF-8.");
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
            placeholder="Tulis teks atau tempel Base64 di sini..."
            className="box-border h-[440px] w-full resize-none rounded-[10px] border-[1.5px] border-card-border bg-white p-4 font-mono text-[13.5px] leading-relaxed text-[#303841] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
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
            className="box-border h-[440px] w-full resize-none rounded-[10px] border-[1.5px] bg-[#303841] p-4 font-mono text-[13.5px] leading-relaxed text-[#F5F5F5] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
