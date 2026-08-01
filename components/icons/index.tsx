import type { SVGProps } from "react";

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function JsonFormatterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 3c-2 0-2 2-2 4s0 3-2 3c2 0 2 1 2 3s0 4 2 4" />
      <path d="M16 3c2 0 2 2 2 4s0 3 2 3c-2 0-2 1-2 3s0 4-2 4" />
    </Icon>
  );
}

export function JsonDiffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 4v16M8 4l-3 3M8 4l3 3" />
      <path d="M16 20V4M16 20l-3-3M16 20l3 3" />
    </Icon>
  );
}

export function Base64EncoderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Icon>
  );
}

export function ImageConverterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="10" r="1.4" />
      <path d="M3 16l5-5 4 4 3-3 6 6" />
    </Icon>
  );
}

export function UrlEncoderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="7" r="3" />
      <path d="M9 15l6-6" />
    </Icon>
  );
}

export function TimestampConverterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12V7M12 12l4 2" />
    </Icon>
  );
}

export function RegexTesterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M7 19L17 5" />
      <circle cx="7" cy="19" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="5" r="1.3" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function MarkdownPreviewerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M8 8h8M8 12h5M8 16h3" />
    </Icon>
  );
}

export function ColorPaletteExtractorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="9" cy="10" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export const toolIcons: Record<
  string,
  (props: SVGProps<SVGSVGElement>) => React.JSX.Element
> = {
  "json-formatter": JsonFormatterIcon,
  "json-diff": JsonDiffIcon,
  "base64-encoder": Base64EncoderIcon,
  "image-converter": ImageConverterIcon,
  "url-encoder": UrlEncoderIcon,
  "timestamp-converter": TimestampConverterIcon,
  "regex-tester": RegexTesterIcon,
  "markdown-previewer": MarkdownPreviewerIcon,
  "color-palette-extractor": ColorPaletteExtractorIcon,
};
