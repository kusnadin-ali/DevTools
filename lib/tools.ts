export type Tool = {
  slug: string;
  name: string;
  desc: string;
  tag: string;
  iconColor: string;
  /** border-radius used for the homepage swatch AND the tool-page icon box */
  iconShape: "50%" | "2px" | "3px";
  badge?: string;
  badgeColor?: string;
  /** real route once built, '#' while inert */
  href: string;
};

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    desc: "Validasi, format, dan minify JSON secara instan.",
    tag: "JSON",
    iconColor: "#FF5722",
    iconShape: "3px",
    badge: "POPULAR",
    badgeColor: "#FF5722",
    href: "/tools/json-formatter",
  },
  {
    slug: "json-diff",
    name: "JSON Diff",
    desc: "Bandingkan dua JSON berdampingan, lihat perubahan.",
    tag: "JSON",
    iconColor: "#76ABAE",
    iconShape: "50%",
    href: "/tools/json-diff",
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    desc: "Encode dan decode teks atau file ke Base64.",
    tag: "ENCODE",
    iconColor: "#303841",
    iconShape: "2px",
    badge: "NEW",
    badgeColor: "#76ABAE",
    href: "/tools/base64-encoder",
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    desc: "Konversi gambar antar format PNG, JPG, WebP.",
    tag: "IMAGE",
    iconColor: "#76ABAE",
    iconShape: "50%",
    href: "/tools/image-converter",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    desc: "Encode dan decode URL dengan aman dan cepat.",
    tag: "ENCODE",
    iconColor: "#303841",
    iconShape: "3px",
    href: "/tools/url-encoder",
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    desc: "Konversi Unix timestamp ke tanggal, dan sebaliknya.",
    tag: "TIME",
    iconColor: "#FF5722",
    iconShape: "50%",
    href: "/tools/timestamp-converter",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    desc: "Uji ekspresi reguler dengan highlight hasil langsung.",
    tag: "DEV",
    iconColor: "#76ABAE",
    iconShape: "2px",
    badge: "BETA",
    badgeColor: "#303841",
    href: "/tools/regex-tester",
  },
  {
    slug: "markdown-previewer",
    name: "Markdown Previewer",
    desc: "Tulis markdown, lihat hasil render seketika.",
    tag: "DOC",
    iconColor: "#303841",
    iconShape: "2px",
    href: "/tools/markdown-previewer",
  },
  {
    slug: "color-palette-extractor",
    name: "Color Palette Extractor",
    desc: "Ekstrak palet warna dominan dari sebuah gambar.",
    tag: "DESIGN",
    iconColor: "#FF5722",
    iconShape: "50%",
    href: "/tools/color-palette-extractor",
  },
];
