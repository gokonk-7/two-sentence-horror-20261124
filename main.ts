// Two-Sentence Horror — make.fun bounty u-suroto-two-sentence-horror-acea9253
//
// A tiny program that writes exactly one horror story — two sentences,
// at most 400 characters — to /output/entry.txt, where the house judge
// reads it. The story is fixed and deterministic: the same text is
// written on every run, so both grading runs gate identically.
//
// The story (168 characters, exactly two sentences):
//   "The new tenant in 4B leaves a different shoe outside my door every
//    morning, always my size, always the left one. Today there were two,
//    and the right one was still warm."
//
// Why this one: the first sentence reads like a neighbour's odd habit;
// the second sentence turns it — the pair is complete today, and the
// right shoe is still warm, so whoever has been leaving them is standing
// right outside the door, barefoot, now. The horror is implied, never
// explained: no monster is named, no gore, and the reader fills in the
// worst of it on the second read.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const STORY =
  "The new tenant in 4B leaves a different shoe outside my door every morning, always my size, always the left one. Today there were two, and the right one was still warm.";

export const MAX_CHARS = 400;

export function countSentences(text: string): number {
  // A sentence ends on . ! or ? followed by whitespace or end of text.
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0).length;
}

export function validate(text: string): string[] {
  const problems: string[] = [];
  if (text.trim().length === 0) problems.push("entry is only white space");
  if (text.length > MAX_CHARS)
    problems.push(`entry is ${text.length} characters, over the 400 limit`);
  const sentences = countSentences(text);
  if (sentences !== 2)
    problems.push(`entry has ${sentences} sentences, expected exactly 2`);
  return problems;
}

function main(): void {
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  const problems = validate(STORY);
  if (problems.length > 0) {
    for (const p of problems) console.error(`invalid entry: ${p}`);
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, STORY, "utf8");
  console.log(
    `wrote ${outPath}: ${STORY.length} characters, ${countSentences(STORY)} sentences`,
  );
}

main();
