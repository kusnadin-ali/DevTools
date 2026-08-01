import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="relative flex flex-col items-center px-12 pb-24 pt-[88px] text-center">
        <div
          className="absolute right-[8%] top-10 h-[130px] w-[130px] opacity-35"
          style={{
            backgroundImage: "radial-gradient(var(--color-teal) 1.5px, transparent 1.5px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div
          className="absolute bottom-5 left-[6%] h-[110px] w-[110px] opacity-30"
          style={{
            backgroundImage: "radial-gradient(var(--color-accent) 1.5px, transparent 1.5px)",
            backgroundSize: "12px 12px",
          }}
        />

        <div className="mb-7 inline-flex h-[74px] w-[74px] rotate-[-6deg] animate-[stampIn_0.5s_ease-out] items-center justify-center rounded-full border-2 border-dashed border-accent">
          <span className="font-mono text-xs font-bold tracking-[0.02em] text-accent">v1.0</span>
        </div>

        <h1 className="m-0 mb-5 max-w-[780px] font-fraunces text-[56px] font-black leading-[1.08] tracking-[-0.015em] text-balance">
          Klasik di tampilan,
          <br />
          modern di dalam.
        </h1>
        <p className="m-0 mb-9 max-w-[520px] text-lg leading-relaxed text-text-secondary text-balance">
          Kumpulan utilitas developer yang berjalan sepenuhnya di browser kamu — cepat, privat,
          dan gratis. Tanpa server, tanpa data yang bocor.
        </p>

        <Link
          href="#tools"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-base font-bold text-[#F5F5F5] no-underline shadow-[0_4px_0_var(--color-accent-dark)] transition-all hover:translate-y-[2px] hover:shadow-[0_2px_0_var(--color-accent-dark)]"
        >
          Jelajahi Tools <span>→</span>
        </Link>
      </section>

      <section id="tools" className="relative z-1 flex-1 px-12 pb-[88px] pt-16">
        <div className="mb-11 flex items-baseline justify-center gap-3.5">
          <div className="h-0.5 w-9 bg-divider" />
          <h2 className="m-0 font-fraunces text-[32px] font-bold">Available Tools</h2>
          <div className="h-0.5 w-9 bg-divider" />
        </div>

        <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} index={index} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
