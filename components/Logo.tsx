export default function Logo({
  size = 22,
  textSize = "text-xs",
}: {
  size?: number;
  textSize?: string;
}) {
  return (
    <span
      className="relative flex-none rotate-12 rounded bg-accent"
      style={{ width: size, height: size }}
    >
      <span
        className={`absolute inset-0 flex -rotate-12 items-center justify-center font-fraunces font-black text-[#F5F5F5] ${textSize}`}
      >
        Z
      </span>
    </span>
  );
}
