"use client";

import { useEffect, useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
import { tools } from "@/lib/tools";

type Unit = "s" | "ms";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDatetimeLocalValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function parseTimestamp(raw: string, unit: Unit): { date: Date | null; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { date: null, error: "" };
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return { date: null, error: "Timestamp harus berupa angka." };
  const date = new Date(unit === "s" ? num * 1000 : num);
  if (Number.isNaN(date.getTime())) {
    return { date: null, error: "Timestamp di luar jangkauan tanggal yang valid." };
  }
  return { date, error: "" };
}

function ResultRow({
  label,
  value,
  fieldKey,
  copiedField,
  onCopy,
}: {
  label: string;
  value: string;
  fieldKey: string;
  copiedField: string | null;
  onCopy: (key: string, value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border-[1.5px] border-card-border bg-card-bg px-4 py-2.5">
      <div className="min-w-0">
        <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-text-secondary">
          {label}
        </div>
        <div className="truncate font-mono text-[13.5px] text-root-text">{value}</div>
      </div>
      <button
        type="button"
        onClick={() => onCopy(fieldKey, value)}
        className="flex-none cursor-pointer rounded-md border-[1.5px] border-card-border bg-card-bg px-2.5 py-1 font-mono text-[11px] font-bold text-root-text hover:border-accent hover:text-accent"
      >
        {copiedField === fieldKey ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default function TimestampConverterPage() {
  const tool = tools.find((t) => t.slug === "timestamp-converter")!;

  // Start empty and fill in "now" client-side only — seeding from Date.now()
  // during the initial render would diverge between the server-rendered HTML
  // and the client's actual clock, causing a hydration mismatch.
  const [tsInput, setTsInput] = useState("");
  const [unit, setUnit] = useState<Unit>("s");
  const [dtInput, setDtInput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTsInput(String(Math.floor(Date.now() / 1000)));
    setDtInput(toDatetimeLocalValue(new Date()));
  }, []);

  function handleCopy(key: string, value: string) {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedField(key);
    setTimeout(() => setCopiedField((cur) => (cur === key ? null : cur)), 1200);
  }

  const tsResult = parseTimestamp(tsInput, unit);
  const dtDate = dtInput ? new Date(dtInput) : null;
  const dtValid = dtDate !== null && !Number.isNaN(dtDate.getTime());

  return (
    <ToolPageShell tool={tool}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h3 className="m-0 font-fraunces text-lg font-semibold">Timestamp → Tanggal</h3>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              placeholder="1735689600"
              className="min-w-0 flex-1 rounded-lg border-[1.5px] border-card-border bg-card-bg px-3 py-2 font-mono text-sm text-root-text"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="cursor-pointer rounded-lg border-[1.5px] border-card-border bg-card-bg px-2.5 py-2 font-mono text-xs text-root-text"
            >
              <option value="s">Detik</option>
              <option value="ms">Milidetik</option>
            </select>
            <Button
              variant="secondary"
              onClick={() =>
                setTsInput(String(unit === "s" ? Math.floor(Date.now() / 1000) : Date.now()))
              }
            >
              Now
            </Button>
          </div>

          {tsResult.error ? (
            <p className="m-0 font-mono text-[13px] text-accent">⚠ {tsResult.error}</p>
          ) : tsResult.date ? (
            <div className="flex flex-col gap-2">
              <ResultRow
                label="Local"
                value={tsResult.date.toLocaleString()}
                fieldKey="local"
                copiedField={copiedField}
                onCopy={handleCopy}
              />
              <ResultRow
                label="UTC"
                value={tsResult.date.toUTCString()}
                fieldKey="utc"
                copiedField={copiedField}
                onCopy={handleCopy}
              />
              <ResultRow
                label="ISO 8601"
                value={tsResult.date.toISOString()}
                fieldKey="iso"
                copiedField={copiedField}
                onCopy={handleCopy}
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="m-0 font-fraunces text-lg font-semibold">Tanggal → Timestamp</h3>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="datetime-local"
              step="1"
              value={dtInput}
              onChange={(e) => setDtInput(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border-[1.5px] border-card-border bg-card-bg px-3 py-2 font-mono text-sm text-root-text"
            />
            <Button variant="secondary" onClick={() => setDtInput(toDatetimeLocalValue(new Date()))}>
              Now
            </Button>
          </div>

          {dtValid && dtDate ? (
            <div className="flex flex-col gap-2">
              <ResultRow
                label="Unix (detik)"
                value={String(Math.floor(dtDate.getTime() / 1000))}
                fieldKey="unix-s"
                copiedField={copiedField}
                onCopy={handleCopy}
              />
              <ResultRow
                label="Unix (milidetik)"
                value={String(dtDate.getTime())}
                fieldKey="unix-ms"
                copiedField={copiedField}
                onCopy={handleCopy}
              />
              <ResultRow
                label="ISO 8601"
                value={dtDate.toISOString()}
                fieldKey="dt-iso"
                copiedField={copiedField}
                onCopy={handleCopy}
              />
            </div>
          ) : dtInput ? (
            <p className="m-0 font-mono text-[13px] text-accent">⚠ Tanggal tidak valid.</p>
          ) : null}
        </div>
      </div>
    </ToolPageShell>
  );
}
