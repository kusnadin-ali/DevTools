"use client";

import { useState, type ReactNode } from "react";
import ToolPageShell from "@/components/ToolPageShell";
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

function highlight(text: string, matches: RegExpMatchArray[]): ReactNode[] {
  if (matches.length === 0) return [text];
  const nodes: ReactNode[] = [];
  let last = 0;
  matches.forEach((m, i) => {
    const start = m.index ?? 0;
    const end = start + m[0].length;
    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(
      <mark key={i} className="rounded bg-[rgba(255,87,34,0.4)] text-inherit">
        {m[0] || "​"}
      </mark>
    );
    last = Math.max(end, last);
  });
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
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
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis teks untuk diuji..."
            className="box-border h-[300px] w-full resize-none rounded-[10px] border-[1.5px] border-card-border bg-white p-4 font-mono text-[13.5px] leading-relaxed text-[#303841] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            {matches.length} Match{matches.length === 1 ? "" : "es"}
          </span>
          <div className="box-border h-[300px] w-full overflow-auto whitespace-pre-wrap break-words rounded-[10px] border-[1.5px] border-card-border bg-[#303841] p-4 font-mono text-[13.5px] leading-relaxed text-[#F5F5F5] shadow-[0_3px_10px_rgba(48,56,65,0.06)]">
            {error ? (
              <span className="text-white/40">Perbaiki pola regex untuk melihat hasil.</span>
            ) : text ? (
              highlight(text, matches)
            ) : (
              <span className="text-white/40">Hasil highlight akan tampil di sini...</span>
            )}
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
