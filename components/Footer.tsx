import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-5 border-t-2 border-footer-border px-12 py-6">
      <div className="flex items-center gap-2">
        <Logo size={22} textSize="text-xs" />
        <span className="font-fraunces text-[15px] font-bold text-root-text">Zerf Tools</span>
      </div>

      <div className="flex gap-7">
        <Link href="/#tools" className="text-[13.5px] font-semibold text-footer-text no-underline">
          Tools
        </Link>
        <Link href="#" className="text-[13.5px] font-semibold text-footer-text no-underline">
          GitHub
        </Link>
      </div>

      <span className="font-mono text-xs text-footer-text">© 2026 Zerf Tools</span>
    </footer>
  );
}
