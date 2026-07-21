#!/usr/bin/env node

import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: validate_srt.mjs <subtitles.srt>");
  process.exit(2);
}

function parseTime(value) {
  const match = value.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) return null;
  const [, hours, minutes, seconds, millis] = match.map(Number);
  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis;
}

const source = fs.readFileSync(file, "utf8").trim();
const blocks = source ? source.split(/\r?\n\s*\r?\n/) : [];
const errors = [];
const warnings = [];
let previousEnd = -1;
let maxCharacters = 0;

for (const [offset, block] of blocks.entries()) {
  const lines = block.split(/\r?\n/);
  const event = offset + 1;
  const timing = lines[1]?.match(/^(.+) --> (.+)$/);
  const text = lines.slice(2).join("").trim();

  if (!timing) {
    errors.push({ event, issue: "invalid timing line" });
    continue;
  }

  const start = parseTime(timing[1]);
  const end = parseTime(timing[2]);
  if (start === null || end === null) {
    errors.push({ event, issue: "invalid timestamp" });
    continue;
  }
  if (end <= start) errors.push({ event, issue: "non-positive duration" });
  if (start < previousEnd) errors.push({ event, issue: "overlap or out-of-order event" });
  previousEnd = Math.max(previousEnd, end);

  const length = [...text].length;
  maxCharacters = Math.max(maxCharacters, length);
  if (!text) errors.push({ event, issue: "empty subtitle" });
  if (/^[，。！？；、：,.!?;:\s]+$/.test(text)) errors.push({ event, issue: "orphan punctuation" });
  if (length > 30) warnings.push({ event, issue: "subtitle exceeds 30 characters", length });
  if (/^[A-Za-z][A-Za-z0-9.-]*$/.test(text)) warnings.push({ event, issue: "isolated English product name", text });
}

const result = {
  file,
  events: blocks.length,
  max_characters: maxCharacters,
  errors,
  warnings,
};

console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
