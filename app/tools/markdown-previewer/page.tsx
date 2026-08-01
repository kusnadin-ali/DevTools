"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import ToolPageShell from "@/components/ToolPageShell";
import { tools } from "@/lib/tools";

const DEFAULT_MARKDOWN = `# Zerf Tools

Kumpulan utilitas developer yang berjalan **sepenuhnya di browser**.

## Fitur

- Cepat
- Privat
- *Gratis*

\`\`\`js
console.log("Hello, Zerf Tools!");
\`\`\`

> Tanpa server, tanpa data yang bocor.

[Kunjungi Zerf Tools](https://zerf.tools)
`;

const PREVIEW_CLASS = [
  "[&_h1]:font-fraunces [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:first:mt-0",
  "[&_h2]:font-fraunces [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2",
  "[&_h3]:font-fraunces [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1.5",
  "[&_p]:mb-3 [&_p]:leading-relaxed",
  "[&_ul]:mb-3 [&_ul]:pl-5 [&_ul]:list-disc",
  "[&_ol]:mb-3 [&_ol]:pl-5 [&_ol]:list-decimal",
  "[&_li]:mb-1",
  "[&_a]:text-accent [&_a]:underline",
  "[&_strong]:font-bold [&_em]:italic",
  "[&_code]:font-mono [&_code]:text-[13px] [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded",
  "[&_pre]:bg-black/30 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-auto [&_pre]:mb-3",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-white/70",
  "[&_hr]:border-white/20 [&_hr]:my-4",
  "[&_table]:w-full [&_table]:border-collapse [&_table]:mb-3",
  "[&_th]:border [&_th]:border-white/20 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left",
  "[&_td]:border [&_td]:border-white/20 [&_td]:px-2 [&_td]:py-1",
  "[&_img]:max-w-full [&_img]:rounded",
].join(" ");

export default function MarkdownPreviewerPage() {
  const tool = tools.find((t) => t.slug === "markdown-previewer")!;

  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [html, setHtml] = useState("");

  useEffect(() => {
    // DOMPurify needs a real DOM, so this must stay client-only — never call
    // it during the server render.
    const raw = marked.parse(markdown, { async: false }) as string;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHtml(DOMPurify.sanitize(raw));
  }, [markdown]);

  return (
    <ToolPageShell tool={tool}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Markdown
          </span>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Tulis markdown di sini..."
            className="box-border h-[440px] w-full resize-none rounded-[10px] border-[1.5px] border-card-border bg-white p-4 font-mono text-[13.5px] leading-relaxed text-[#303841] shadow-[0_3px_10px_rgba(48,56,65,0.06)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Preview
          </span>
          <div
            className={`box-border h-[440px] w-full overflow-auto rounded-[10px] border-[1.5px] border-card-border bg-[#303841] p-4 text-sm text-[#F5F5F5] shadow-[0_3px_10px_rgba(48,56,65,0.06)] ${PREVIEW_CLASS}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
