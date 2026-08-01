const KEY_COLOR = "#4FC1FF";
const VALUE_COLOR = "var(--color-accent)";

const TOKEN_RE =
  /"(?:\\.|[^"\\])*"(?:\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

/** Postman-style 2-tone highlight: keys blue, values orange. Returns safe HTML. */
export function highlightJson(json: string): string {
  const escaped = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(TOKEN_RE, (match) => {
    const color = match.endsWith(":") ? KEY_COLOR : VALUE_COLOR;
    return `<span style="color:${color}">${match}</span>`;
  });
}
