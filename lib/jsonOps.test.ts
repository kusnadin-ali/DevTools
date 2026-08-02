import { test } from "node:test";
import assert from "node:assert/strict";
import { formatJson, minifyJson, escapeJson, unescapeJson, stringifyJson, parseEscapedJson } from "./jsonOps.ts";

test("formatJson pretty-prints with the requested indent", () => {
  assert.equal(formatJson('{"a":1,"b":[1,2]}', "2"), '{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}');
});

test("formatJson throws on invalid JSON", () => {
  assert.throws(() => formatJson("{not json}", "2"));
});

test("minifyJson strips whitespace", () => {
  assert.equal(minifyJson('{\n  "a": 1\n}'), '{"a":1}');
});

test("escapeJson/unescapeJson round-trip special characters", () => {
  const raw = 'line1\nline2\t"quoted"\\end';
  assert.equal(unescapeJson(escapeJson(raw)), raw);
});

test("stringifyJson/parseEscapedJson round-trip a JSON payload", () => {
  const original = '{"a":1,"b":"x"}';
  const wrapped = stringifyJson(original);
  assert.equal(parseEscapedJson(wrapped, "2"), formatJson(original, "2"));
});
