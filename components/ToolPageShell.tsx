import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconBox from "@/components/IconBox";
import { toolIcons } from "@/components/icons";
import type { Tool } from "@/lib/tools";

export default function ToolPageShell({ tool, children }: { tool: Tool; children: ReactNode }) {
  const ToolIcon = toolIcons[tool.slug];

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeSlug={tool.slug} />

      <section className="mx-auto w-full max-w-275 px-12 pb-6 pt-10">
        <div className="mb-2 flex items-center gap-3.5">
          <IconBox>
            <ToolIcon width={20} height={20} stroke="var(--color-accent)" />
          </IconBox>
          <div>
            <h1 className="m-0 font-fraunces text-[28px] font-bold">{tool.name}</h1>
            <p className="mt-0.5 mb-0 text-sm text-text-secondary">{tool.desc}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-275 flex-1 px-12 pb-16">{children}</section>

      <Footer />
    </div>
  );
}
