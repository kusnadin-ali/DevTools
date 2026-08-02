function indentToSpace(indent: string): string | number | undefined {
  return indent === "tab" ? "\t" : Number(indent);
}

export function formatJson(input: string, indent: string): string {
  return JSON.stringify(JSON.parse(input), null, indentToSpace(indent));
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

/** Escapes special characters in place (backslash, quote, newline, tab, ...)
 * — no wrapping quotes added. Reuses JSON.stringify's own escaping (correct
 * for every edge case: \uXXXX, control chars, etc.) and just strips the
 * outer quote pair it adds. Never throws — any text can be escaped. */
export function escapeJson(input: string): string {
  const withQuotes = JSON.stringify(input);
  return withQuotes.slice(1, -1);
}

function manualUnescape(text: string): string {
  return text.replace(/\\(u[0-9a-fA-F]{4}|[\s\S])/g, (match, code: string) => {
    switch (code[0]) {
      case "n":
        return "\n";
      case "t":
        return "\t";
      case "r":
        return "\r";
      case "b":
        return "\b";
      case "f":
        return "\f";
      case '"':
        return '"';
      case "'":
        return "'";
      case "\\":
        return "\\";
      case "/":
        return "/";
      case "u":
        return code.length === 5 ? String.fromCharCode(parseInt(code.slice(1), 16)) : match;
      default:
        return match;
    }
  });
}

/** Reverse of escapeJson. Tries JSON's own (correct) string-literal decoding
 * first — with or without wrapping quotes — and only falls back to a manual
 * character substitution if that doesn't apply. Never throws: switching
 * between Escape/Unescape/etc. on whatever's currently in the box should
 * never surface a crash, just do the best sensible thing with the text. */
export function unescapeJson(input: string): string {
  const trimmed = input.trim();
  const candidates = trimmed.startsWith('"') && trimmed.endsWith('"') ? [trimmed] : [`"${trimmed}"`];
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (typeof parsed === "string") return parsed;
    } catch {
      // try the next candidate / fall through to the manual pass below
    }
  }
  return manualUnescape(trimmed);
}

/** Parses input as JSON, then re-encodes the compact result as an escaped
 * JSON string literal — useful for embedding a JSON payload as a string
 * value. Falls back to stringifying the raw text itself when the input
 * isn't valid JSON, so this never throws either. */
export function stringifyJson(input: string): string {
  try {
    return JSON.stringify(JSON.stringify(JSON.parse(input)));
  } catch {
    return JSON.stringify(input);
  }
}

/** Reverse of stringifyJson. Unwraps a string-literal layer (if present),
 * then pretty-prints the JSON inside it. Falls back gracefully at every
 * step — treats input as already-plain JSON if it isn't wrapped, and
 * returns unwrapped text as-is if what's inside isn't JSON either — so this
 * never throws regardless of what's currently in the box. */
export function parseEscapedJson(input: string, indent: string): string {
  const trimmed = input.trim();
  const candidates = trimmed.startsWith('"') && trimmed.endsWith('"') ? [trimmed] : [`"${trimmed}"`];

  for (const candidate of candidates) {
    try {
      const inner = JSON.parse(candidate);
      if (typeof inner === "string") {
        try {
          return JSON.stringify(JSON.parse(inner), null, indentToSpace(indent));
        } catch {
          return inner;
        }
      }
    } catch {
      // fall through
    }
  }

  try {
    return JSON.stringify(JSON.parse(trimmed), null, indentToSpace(indent));
  } catch {
    return trimmed;
  }
}
