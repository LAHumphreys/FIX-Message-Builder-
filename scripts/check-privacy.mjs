#!/usr/bin/env node
/**
 * Bundle privacy check (brief §2).
 *
 * The app must make zero network requests after page load. This script scans
 * the built bundle for network-capable API usage. Nothing is allowlisted:
 * the engine and UI should contain no network calls at all, so any hit fails
 * the build until a human reviews it.
 *
 * Also verifies the shipped index.html carries the CSP meta tag with
 * connect-src 'none', and that no asset references an external URL.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;

const FORBIDDEN_PATTERNS = [
  { name: 'fetch()', regex: /\bfetch\s*\(/ },
  { name: 'XMLHttpRequest', regex: /\bXMLHttpRequest\b/ },
  { name: 'navigator.sendBeacon', regex: /\bsendBeacon\b/ },
  { name: 'WebSocket', regex: /\bnew\s+WebSocket\b/ },
  { name: 'EventSource', regex: /\bnew\s+EventSource\b/ },
  { name: 'external http(s) URL', regex: /(?:src|href)\s*=\s*["']https?:\/\// },
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      yield* walk(path);
    } else if (/\.(js|mjs|css|html)$/.test(entry)) {
      yield path;
    }
  }
}

let files;
try {
  files = [...walk(DIST)];
} catch {
  console.error(`check-privacy: dist/ not found — run \`npm run build\` first.`);
  process.exit(1);
}

const failures = [];
let sawCsp = false;

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const rel = relative(DIST, file);

  for (const { name, regex } of FORBIDDEN_PATTERNS) {
    if (regex.test(content)) {
      failures.push(`${rel}: contains ${name}`);
    }
  }

  if (rel === 'index.html') {
    sawCsp =
      /http-equiv="Content-Security-Policy"/.test(content) && /connect-src 'none'/.test(content);
  }
}

if (!sawCsp) {
  failures.push(`index.html: missing CSP meta tag with connect-src 'none'`);
}

if (failures.length > 0) {
  console.error('check-privacy: FAILED\n');
  for (const failure of failures) {
    console.error(`  ✗ ${failure}`);
  }
  process.exit(1);
}

console.log(`check-privacy: OK — scanned ${files.length} bundle files, no network API usage.`);
