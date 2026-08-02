"use client";

import { useRef, useState, type ChangeEvent, type RefObject } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
import GlyphBadge from "@/components/GlyphBadge";
import LineNumberGutter from "@/components/LineNumberGutter";
import JsonTreeView, { type Json } from "@/components/JsonTreeView";
import {
  FormatIcon,
  MinifyIcon,
  UploadIcon,
  DownloadIcon,
  CopyIcon,
  ClearIcon,
  UseAsInputIcon,
} from "@/components/icons/actions";
import { tools } from "@/lib/tools";
import {
  escapeJson,
  formatJson,
  minifyJson,
  parseEscapedJson,
  stringifyJson,
  unescapeJson,
} from "@/lib/jsonOps";

const DEFAULT_INPUT = `{
  "name": "Zerf Tools",
  "version": "1.0.0",
  "tools": ["json-formatter", "base64", "regex"],
  "active": true
}`;

const ICON_SIZE = 14;

function NumberedText({ text, accent = false }: { text: string; accent?: boolean }) {
  return (
    <div className="font-mono text-[13.5px] leading-relaxed">
      {text.split("\n").map((line, i) => (
        <div key={i} className="flex items-start">
          <span className="w-10 flex-none select-none border-r border-card-border pr-2 text-right text-text-secondary/50">
            {i + 1}
          </span>
          <span
            className={`whitespace-pre-wrap break-words pl-2.5 ${accent ? "text-accent" : "text-root-text"}`}
          >
            {line}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function JsonFormatterPage() {
  const tool = tools.find((t) => t.slug === "json-formatter")!;

  const [input, setInput] = useState(DEFAULT_INPUT);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState("2");
  const [copyLabel, setCopyLabel] = useState("Copy");
  // Whether the current output should render as an interactive collapsible
  // tree (Format/Parse — genuinely structured, worth exploring) or as plain
  // text (Minify/Escape/Unescape/Stringify — the compact/string form IS the
  // point; expanding it into a tree would visually hide that it worked).
  const [outputMode, setOutputMode] = useState<"tree" | "plain">("tree");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputGutterRef = useRef<HTMLDivElement>(null);

  function runOp(op: (value: string) => string, mode: "tree" | "plain") {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      setOutput(op(input));
      setOutputMode(mode);
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

  /** Promotes the current Output into Input, so paired operations (Escape
   * then Unescape, Stringify then Parse) can chain. Deliberately not
   * automatic — auto-syncing after every click would collapse the two
   * panels' whole point of showing a before/after comparison. */
  function handleUseOutputAsInput() {
    if (!output || error) return;
    setInput(output);
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

  async function handleFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setInput(await file.text());
      setOutput("");
      setError("");
    } catch {
      setError("Gagal membaca file.");
    }
  }

  function handleDownload() {
    if (!output || error) return;
    const blob = new Blob([output], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function syncGutterScroll(gutter: RefObject<HTMLDivElement | null>, scrollTop: number) {
    if (gutter.current) gutter.current.scrollTop = scrollTop;
  }

  const outputDisplay = error ? `⚠ ${error}` : output;
  const statusLabel = error ? "Error" : "Output";
  const outputBorder = error ? "var(--color-accent)" : "var(--color-card-border)";

  let parsedOutput: Json | null = null;
  let parsedOutputOk = false;
  if (!error && output) {
    try {
      parsedOutput = JSON.parse(output);
      parsedOutputOk = true;
    } catch {
      parsedOutputOk = false;
    }
  }

  return (
    <ToolPageShell tool={tool} maxWidth="1400px">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        onChange={handleFileSelected}
        className="hidden"
      />

      <div className="mb-5 flex flex-col gap-4 rounded-xl border-[1.5px] border-card-border bg-card-bg p-4 shadow-[0_3px_10px_rgba(48,56,65,0.05)]">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary/70">
            Transform
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" onClick={() => runOp((v) => formatJson(v, indent), "tree")}>
              <FormatIcon width={ICON_SIZE} height={ICON_SIZE} />
              Format
            </Button>
            <Button variant="secondary" onClick={() => runOp(minifyJson, "plain")}>
              <MinifyIcon width={ICON_SIZE} height={ICON_SIZE} />
              Minify
            </Button>
            <Button variant="secondary" onClick={() => runOp(escapeJson, "plain")}>
              <GlyphBadge>{'\\"'}</GlyphBadge>
              Escape
            </Button>
            <Button variant="secondary" onClick={() => runOp(unescapeJson, "plain")}>
              <GlyphBadge>{'"\\'}</GlyphBadge>
              Unescape
            </Button>
            <Button variant="secondary" onClick={() => runOp(stringifyJson, "plain")}>
              <GlyphBadge>&quot;&quot;</GlyphBadge>
              Stringify
            </Button>
            <Button
              variant="secondary"
              onClick={() => runOp((v) => parseEscapedJson(v, indent), "tree")}
            >
              <GlyphBadge>{'{"'}</GlyphBadge>
              Parse
            </Button>
          </div>
        </div>

        <div className="h-px bg-card-border" />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary/70">
              File
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleUseOutputAsInput}
                disabled={!output || !!error}
                title="Lanjutkan mengolah Output — mis. Escape lalu Unescape"
              >
                <UseAsInputIcon width={ICON_SIZE} height={ICON_SIZE} />
                Output → Input
              </Button>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <UploadIcon width={ICON_SIZE} height={ICON_SIZE} />
                Upload
              </Button>
              <Button variant="secondary" onClick={handleDownload} disabled={!output || !!error}>
                <DownloadIcon width={ICON_SIZE} height={ICON_SIZE} />
                Download
              </Button>
              <Button variant="secondary" onClick={handleCopy}>
                <CopyIcon width={ICON_SIZE} height={ICON_SIZE} />
                {copyLabel}
              </Button>
              <Button variant="muted" onClick={handleClear}>
                <ClearIcon width={ICON_SIZE} height={ICON_SIZE} />
                Clear
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
              Input
            </span>
            <span className="font-mono text-[10.5px] text-text-secondary/70">
              {input.split("\n").length} baris · {input.length} char
            </span>
          </div>
          <div className="flex h-[560px] min-h-[220px] w-full resize-y overflow-hidden rounded-[10px] border-[1.5px] border-card-border bg-card-bg shadow-[0_3px_10px_rgba(48,56,65,0.06)]">
            <LineNumberGutter ref={inputGutterRef} lineCount={input.split("\n").length} />
            {/* ponytail: word-wrap is on, but the line-number gutter is a
                separate synced-scroll element sized for one row per logical
                line — a wrapped long line will visually drift from its
                number. Acceptable for typical formatted JSON; fix properly
                by moving to a real editor (CodeMirror/Monaco) if that
                becomes a real complaint. */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onScroll={(e) => syncGutterScroll(inputGutterRef, e.currentTarget.scrollTop)}
              placeholder="Tempel JSON kamu di sini..."
              spellCheck={false}
              className="flex-1 resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent py-4 pr-4 pl-2.5 font-mono text-[13.5px] leading-relaxed text-root-text outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span
              className={`font-mono text-[11px] font-bold uppercase tracking-[0.08em] ${
                error ? "text-accent" : "text-text-secondary"
              }`}
            >
              {statusLabel}
            </span>
            <span className="font-mono text-[10.5px] text-text-secondary/70">
              {outputDisplay
                ? `${outputDisplay.split("\n").length} baris · ${outputDisplay.length} char`
                : ""}
            </span>
          </div>
          <div
            style={{ borderColor: outputBorder }}
            className="h-[560px] min-h-[220px] w-full resize-y overflow-auto rounded-[10px] border-[1.5px] bg-card-bg shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          >
            {error ? (
              <NumberedText text={outputDisplay} accent />
            ) : output ? (
              outputMode === "tree" && parsedOutputOk ? (
                <JsonTreeView value={parsedOutput as Json} />
              ) : (
                <NumberedText text={output} />
              )
            ) : (
              <div className="flex h-full mt-4  px-4">
                <span className="font-mono text-[13.5px] text-text-secondary/50">
                  Hasil akan tampil di sini...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
