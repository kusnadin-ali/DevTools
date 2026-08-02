export default function NumberedText({ text, accent = false }: { text: string; accent?: boolean }) {
  return (
    <div className="font-mono text-[13.5px] leading-relaxed">
      {text.split("\n").map((line, i) => (
        <div key={i} className="flex items-start">
          <span className="w-10 flex-none select-none border-r border-card-border pr-2 text-right text-text-secondary/50">
            {i + 1}
          </span>
          <span
            className={`whitespace-pre-wrap break-words pl-2.5 ${accent ? "text-accent" : "text-root-text"}`}
          >
            {line}
          </span>
        </div>
      ))}
    </div>
  );
}
