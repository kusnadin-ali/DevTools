"use client";

import { useRef, useState, type ReactNode } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import LineNumberGutter from "@/components/LineNumberGutter";
import { tools } from "@/lib/tools";

const DEFAULT_PATTERN = "\\b\\w+@\\w+\\.\\w+\\b";
const DEFAULT_TEXT = "Hubungi kami di hello@zerf.tools atau support@zerf.tools untuk bantuan.";

function getMatches(
  pattern: string,
  flags: string,
  text: string
): { matches: RegExpMatchArray[]; error: string } {
  if (!pattern) return { matches: [], error: "" };
  try {
    const re = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
    return { matches: [...text.matchAll(re)], error: "" };
  } catch (e) {
    return { matches: [], error: (e as Error).message };
  }
}

/** Splits the test text into lines and highlights matches within each line —
 * needed so a per-line gutter can be kept in sync. A match that spans a "\n"
 * (only possible with the `s` flag) is clipped to the line it starts in.
 * ponytail: clipping is a rare-case simplification, not full multi-line-match
 * rendering, revisit if that ever becomes a real complaint. */
function highlightLines(text: string, matches: RegExpMatchArray[]): ReactNode[][] {
  const lines = text.split("\n");
  let offset = 0;
  return lines.map((line, li) => {
    const nodes: ReactNode[] = [];
    let last = 0;
    matches.forEach((m, i) => {
      const start = (m.index ?? 0) - offset;
      const end = start + m[0].length;
      if (end <= 0 || start >= line.length) return;
      const clippedStart = Math.max(0, start);
      const clippedEnd = Math.min(line.length, end);
      if (clippedStart > last) nodes.push(line.slice(last, clippedStart));
      nodes.push(
        <mark key={`${li}-${i}`} className="rounded bg-[rgba(255,87,34,0.4)] text-inherit">
          {line.slice(clippedStart, clippedEnd) || "​"}
        </mark>
      );
      last = Math.max(clippedEnd, last);
    });
    if (last < line.length) nodes.push(line.slice(last));
    offset += line.length + 1;
    return nodes.length ? nodes : [line];
  });
}

const FLAG_OPTIONS: { flag: string; label: string }[] = [
  { flag: "i", label: "Ignore Case" },
  { flag: "m", label: "Multiline" },
  { flag: "s", label: "Dot All" },
];

export default function RegexTesterPage() {
  const tool = tools.find((t) => t.slug === "regex-tester")!;

  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [flags, setFlags] = useState("i");
  const [text, setText] = useState(DEFAULT_TEXT);
  const textGutterRef = useRef<HTMLDivElement>(null);
  const matchGutterRef = useRef<HTMLDivElement>(null);

  function toggleFlag(flag: string) {
    setFlags((cur) => (cur.includes(flag) ? cur.replace(flag, "") : cur + flag));
  }

  const { matches, error } = getMatches(pattern, flags, text);

  return (
    <ToolPageShell tool={tool}>
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-lg text-text-secondary">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Pola regex..."
            className="min-w-0 flex-1 rounded-lg border-[1.5px] border-card-border bg-card-bg px-3 py-2 font-mono text-sm text-root-text"
          />
          <span className="font-mono text-lg text-text-secondary">/{flags}</span>
        </div>

        <div className="flex flex-wrap gap-4">
          {FLAG_OPTIONS.map(({ flag, label }) => (
            <label
              key={flag}
              className="flex cursor-pointer items-center gap-1.5 font-mono text-xs text-text-secondary"
            >
              <input
                type="checkbox"
                checked={flags.includes(flag)}
                onChange={() => toggleFlag(flag)}
              />
              {label} ({flag})
            </label>
          ))}
        </div>

        {error && <p className="m-0 font-mono text-[13px] text-accent">⚠ {error}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Test String
          </span>
          <div className="flex h-[300px] w-full overflow-hidden rounded-[10px] border-[1.5px] border-card-border bg-card-bg shadow-[0_3px_10px_rgba(48,56,65,0.06)]">
            <LineNumberGutter ref={textGutterRef} lineCount={text.split("\n").length} />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onScroll={(e) => {
                if (textGutterRef.current) textGutterRef.current.scrollTop = e.currentTarget.scrollTop;
              }}
              placeholder="Tulis teks untuk diuji..."
              spellCheck={false}
              className="flex-1 resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent py-4 pr-4 pl-2.5 font-mono text-[13.5px] leading-relaxed text-root-text outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            {matches.length} Match{matches.length === 1 ? "" : "es"}
          </span>
          <div className="flex h-[300px] w-full overflow-hidden rounded-[10px] border-[1.5px] border-card-border bg-card-bg shadow-[0_3px_10px_rgba(48,56,65,0.06)]">
            <LineNumberGutter ref={matchGutterRef} lineCount={text.split("\n").length} />
            <div
              onScroll={(e) => {
                if (matchGutterRef.current) matchGutterRef.current.scrollTop = e.currentTarget.scrollTop;
              }}
              className="flex-1 overflow-auto py-4 pr-4 pl-2.5 font-mono text-[13.5px] leading-relaxed text-root-text"
            >
              {error ? (
                <span className="text-text-secondary/50">Perbaiki pola regex untuk melihat hasil.</span>
              ) : text ? (
                highlightLines(text, matches).map((nodes, i) => (
                  <div key={i} className="whitespace-pre-wrap break-words">
                    {nodes}
                  </div>
                ))
              ) : (
                <span className="text-text-secondary/50">Hasil highlight akan tampil di sini...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {!error && matches.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Detail Match
          </span>
          <div className="flex flex-col gap-2">
            {matches.map((m, i) => (
              <div
                key={i}
                className="rounded-lg border-[1.5px] border-card-border bg-card-bg px-4 py-2.5 font-mono text-[12.5px]"
              >
                <div className="text-text-secondary">
                  #{i} at index {m.index} — <span className="text-accent">&quot;{m[0]}&quot;</span>
                </div>
                {m.length > 1 && (
                  <div className="mt-1 text-text-secondary">
                    Groups: {m.slice(1).map((g, gi) => `[${gi + 1}] ${g ?? "undefined"}`).join("  ")}
                  </div>
                )}
                {m.groups && Object.keys(m.groups).length > 0 && (
                  <div className="mt-1 text-text-secondary">
                    Named:{" "}
                    {Object.entries(m.groups)
                      .map(([k, v]) => `${k}=${v ?? "undefined"}`)
                      .join("  ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolPageShell>
  );
}
