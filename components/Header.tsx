"use client";

import Link from "next/link";
import { tools } from "@/lib/tools";
import { toolIcons } from "@/components/icons";
import { useTheme } from "@/components/ThemeProvider";
import Logo from "@/components/Logo";

export default function Header({ activeSlug }: { activeSlug?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative z-2 flex items-center gap-7 px-8 py-3.5 bg-header">
      <Link href="/" className="flex flex-none items-center gap-2.5 no-underline">
        <Logo size={22} textSize="text-[15px]" />
        <span className="whitespace-nowrap font-fraunces text-[17px] font-bold tracking-[-0.01em] text-[#F5F5F5]">
          Zerf<span className="text-accent">.tools</span>
        </span>
      </Link>

      <div className="h-5 w-px flex-none bg-white/15" />

      <nav className="zerf-toolnav flex min-w-0 flex-1 items-center gap-[22px] overflow-x-auto">
        {tools.map((tool) => {
          const ToolIcon = toolIcons[tool.slug];
          const isActive = tool.slug === activeSlug;
          return (
            <Link
              key={tool.slug}
              href={tool.href}
              className={`flex flex-none items-center gap-[7px] whitespace-nowrap text-[13.5px] font-medium no-underline transition-colors hover:text-accent ${
                isActive ? "text-accent" : "text-white/75"
              }`}
            >
              <ToolIcon width={15} height={15} />
              {tool.name}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-none items-center gap-3.5">
        <span className="font-mono text-xs font-bold text-white/80">ID</span>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-[30px] w-[30px] flex-none cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/35"
        >
          {theme === "dark" ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F5F5F5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          ) : (
            <span className="relative h-3 w-3 overflow-hidden rounded-full border-[1.5px] border-[#F5F5F5]">
              <span className="absolute -right-px -top-px h-3.5 w-2 rounded-full bg-header" />
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
