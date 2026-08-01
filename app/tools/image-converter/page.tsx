"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import Button from "@/components/Button";
import { tools } from "@/lib/tools";

type Format = "image/png" | "image/jpeg" | "image/webp";

const EXT: Record<Format, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal memuat gambar."));
    img.src = src;
  });
}

export default function ImageConverterPage() {
  const tool = tools.find((t) => t.slug === "image-converter")!;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [format, setFormat] = useState<Format>("image/png");
  const [quality, setQuality] = useState(0.92);
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    setError("");
    setFile(f);
    setResultUrl("");
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function convert() {
    if (!file || !previewUrl) return;
    setConverting(true);
    setError("");
    try {
      const img = await loadImage(previewUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas tidak didukung di browser ini.");
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, format, format === "image/png" ? undefined : quality)
      );
      if (!blob) throw new Error("Konversi gagal — format tidak didukung browser ini.");
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setConverting(false);
    }
  }

  function handleClear() {
    setFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setResultSize(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <ToolPageShell tool={tool}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Gambar Asli
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
          {file && (
            <p className="m-0 font-mono text-xs text-text-secondary">
              {file.name} — {formatBytes(file.size)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Hasil Konversi
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className="cursor-pointer rounded-lg border-[1.5px] border-card-border bg-card-bg px-2.5 py-2 font-mono text-xs text-root-text"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
            </select>
            {format !== "image/png" && (
              <label className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                Quality
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.01}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />
                {Math.round(quality * 100)}%
              </label>
            )}
            <Button variant="primary" onClick={convert} disabled={!file || converting}>
              {converting ? "Converting..." : "Convert"}
            </Button>
          </div>

          <div className="flex h-[300px] w-full items-center justify-center overflow-hidden rounded-[10px] border-[1.5px] border-card-border bg-card-bg">
            {resultUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resultUrl} alt="Hasil konversi" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="font-mono text-xs text-text-secondary">
                {error ? `⚠ ${error}` : "Hasil akan tampil di sini..."}
              </span>
            )}
          </div>

          {resultUrl && (
            <div className="flex items-center justify-between gap-3">
              <p className="m-0 font-mono text-xs text-text-secondary">{formatBytes(resultSize)}</p>
              <a
                href={resultUrl}
                download={`converted.${EXT[format]}`}
                className="rounded-lg bg-accent px-[18px] py-2.5 text-[13.5px] font-bold text-[#F5F5F5] no-underline shadow-[0_3px_0_var(--color-accent-dark)] hover:translate-y-[1px] hover:shadow-[0_2px_0_var(--color-accent-dark)]"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>

      {file && (
        <div className="mt-5">
          <Button variant="muted" onClick={handleClear}>
            Clear
          </Button>
        </div>
      )}
    </ToolPageShell>
  );
}
