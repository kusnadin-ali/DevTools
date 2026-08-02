import { forwardRef } from "react";

const LineNumberGutter = forwardRef<HTMLDivElement, { lineCount: number }>(
  function LineNumberGutter({ lineCount }, ref) {
    const lines = Math.max(lineCount, 1);
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="w-10 flex-none select-none overflow-hidden border-r border-card-border py-4 text-right font-mono text-[13.5px] leading-relaxed text-text-secondary/50"
      >
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="pr-2">
            {i + 1}
          </div>
        ))}
      </div>
    );
  }
);

export default LineNumberGutter;
