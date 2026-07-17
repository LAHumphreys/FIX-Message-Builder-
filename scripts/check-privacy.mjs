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
 *
 * The fixb CLI bundle (dist-fixb/) carries the same promise on office
 * machines: it is additionally scanned for Node's network-capable modules
 * and process spawning. No CSP protects a CLI — this scan is the guarantee.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;
const DIST_FIXB = new URL('../dist-fixb', import.meta.url).pathname;

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
    } else if (/\.(js|mjs|cjs|css|html)$/.test(entry)) {
      yield path;
    }
  }
}

// Node-side network/spawn surface, forbidden in the CLI bundle. Matches both
// require('x') (CJS bundle) and import 'node:x' just in case the format changes.
const FORBIDDEN_NODE_MODULES = [
  'http',
  'https',
  'http2',
  'net',
  'tls',
  'dgram',
  'dns',
  'child_process',
  'worker_threads',
];
const NODE_PATTERNS = FORBIDDEN_NODE_MODULES.map((m) => ({
  name: `node module '${m}'`,
  regex: new RegExp(`require\\(["'](?:node:)?${m}["']\\)|from\\s*["'](?:node:)?${m}["']`),
}));

let files;
try {
  files = [...walk(DIST)];
} catch {
  console.error(`check-privacy: dist/ not found — run \`npm run build\` first.`);
  process.exit(1);
}

let fixbFiles;
try {
  fixbFiles = [...walk(DIST_FIXB)];
} catch {
  console.error(`check-privacy: dist-fixb/ not found — run \`npm run build:fixb\` first.`);
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

for (const file of fixbFiles) {
  const content = readFileSync(file, 'utf8');
  const rel = `dist-fixb/${relative(DIST_FIXB, file)}`;
  for (const { name, regex } of [...FORBIDDEN_PATTERNS, ...NODE_PATTERNS]) {
    if (regex.test(content)) {
      failures.push(`${rel}: contains ${name}`);
    }
  }
}

if (failures.length > 0) {
  console.error('check-privacy: FAILED\n');
  for (const failure of failures) {
    console.error(`  ✗ ${failure}`);
  }
  process.exit(1);
}

console.log(
  `check-privacy: OK — scanned ${files.length} app + ${fixbFiles.length} CLI bundle files, no network API usage.`
);
