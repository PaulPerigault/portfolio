// Garde-fou : le code source respecte la charte de design (voir scripts/lib/design-rules.mjs).
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { RULES } from './lib/design-rules.mjs';
import { reportAndExit } from './lib/report.mjs';
import { walk } from './lib/walk.mjs';

const EXTENSIONS = ['.astro', '.ts', '.css', '.json'];

const violation = (file, rule, line, content) => ({
  file,
  line,
  rule: rule.name,
  message: rule.message,
  excerpt: content.trim().slice(0, 80),
});

/** Règle `multiline` : motif appliqué au texte entier (une balise peut couvrir plusieurs lignes). */
function textViolations(file, rule, text, lines) {
  const global = new RegExp(rule.pattern.source, `${rule.pattern.flags}g`);
  return [...text.matchAll(global)].map((match) => {
    const line = text.slice(0, match.index).split('\n').length;
    return violation(file, rule, line, lines[line - 1]);
  });
}

function lineViolations(file, rule, lines) {
  return lines.flatMap((content, index) =>
    rule.pattern.test(content) ? [violation(file, rule, index + 1, content)] : [],
  );
}

/** @returns {{ file: string, line: number, rule: string, message: string, excerpt: string }[]} */
export function checkFile(file, text) {
  const extension = extname(file);
  const lines = text.split('\n');
  return RULES.filter(
    (rule) =>
      rule.only.includes(extension) && !(rule.allow ?? []).some((pattern) => pattern.test(file)),
  )
    .flatMap((rule) =>
      rule.multiline ? textViolations(file, rule, text, lines) : lineViolations(file, rule, lines),
    )
    .sort((left, right) => left.line - right.line);
}

export function run(root = 'src') {
  return walk(root, EXTENSIONS).flatMap((file) => checkFile(file, readFileSync(file, 'utf8')));
}

if (import.meta.main) {
  const problems = run().map(
    (v) => `${v.file}:${v.line} [${v.rule}] ${v.message}\n    ${v.excerpt}`,
  );
  reportAndExit('check-design', problems);
}
