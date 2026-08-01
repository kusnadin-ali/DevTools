"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
import { tools } from "@/lib/tools";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal memuat gambar."));
    img.src = src;
  });
}

function quantize(value: number, step = 24): number {
  return Math.round(value / step) * step;
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/** ponytail: bucket-by-rounded-RGB frequency count, not k-means — good enough
 * for "dominant colors from a photo", swap for a proper quantizer if the
 * output quality ever needs to improve. */
async function extractPalette(imgSrc: string, swatchCount = 8): Promise<string[]> {
  const img = await loadImage(imgSrc);
  const sampleSize = 150;
  const scale = Math.min(1, sampleSize / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak didukung di browser ini.");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const counts = new Map<string, { count: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 125) continue;
    const r = quantize(data[i]);
    const g = quantize(data[i + 1]);
    const b = quantize(data[i + 2]);
    const key = `${r},${g},${b}`;
    const entry = counts.get(key);
    if (entry) entry.count++;
    else counts.set(key, { count: 1, r, g, b });
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, swatchCount)
    .map((c) => rgbToHex(c.r, c.g, c.b));
}

function readableTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance > 140 ? "#303841" : "#F5F5F5";
}

export default function ColorPaletteExtractorPage() {
  const tool = tools.find((t) => t.slug === "color-palette-extractor")!;

  const [previewUrl, setPreviewUrl] = useState("");
  const [palette, setPalette] = useState<string[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    setError("");
    setPalette([]);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function handleExtract() {
    if (!previewUrl) return;
    setExtracting(true);
    setError("");
    try {
      setPalette(await extractPalette(previewUrl));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setExtracting(false);
    }
  }

  function handleCopy(hex: string) {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex((cur) => (cur === hex ? null : cur)), 1200);
  }

  function handleClear() {
    setPreviewUrl("");
    setPalette([]);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <ToolPageShell tool={tool}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Gambar
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            aria-label="Pilih gambar"
            onChange={handleFile}
            className="font-mono text-sm text-root-text file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#F5F5F5]"
          />
          <div className="flex h-[300px] w-full items-center justify-center overflow-hidden rounded-[10px] border-[1.5px] border-card-border bg-card-bg">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="font-mono text-xs text-text-secondary">Pilih gambar untuk mulai...</span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="primary" onClick={handleExtract} disabled={!previewUrl || extracting}>
              {extracting ? "Extracting..." : "Extract Colors"}
            </Button>
            {previewUrl && (
              <Button variant="muted" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Palet Warna
          </span>
          {error ? (
            <p className="m-0 font-mono text-[13px] text-accent">⚠ {error}</p>
          ) : palette.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {palette.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleCopy(hex)}
                  className="flex h-24 cursor-pointer flex-col items-center justify-end rounded-lg border-[1.5px] border-card-border p-2"
                  style={{ background: hex }}
                >
                  <span
                    className="font-mono text-[11px] font-bold"
                    style={{ color: readableTextColor(hex) }}
                  >
                    {copiedHex === hex ? "Copied!" : hex}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="m-0 font-mono text-xs text-text-secondary">
              Pilih gambar lalu klik &quot;Extract Colors&quot;.
            </p>
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}
