#!/usr/bin/env node
/**
 * Convert a QuickFIX XML dictionary into the app's compact JSON format
 * (src/engine/dictionary/data/*.json). Dependency-free; re-runnable.
 *
 * Usage:
 *   node scripts/convert-quickfix.mjs <FIXxx.xml> --out <out.json> \
 *     [--fixt <FIXT11.xml>] [--fix-id FIX.4.4]
 *
 * --fixt merges the FIXT.1.1 session-layer header/trailer (and their field
 * definitions) into an application-layer dictionary (needed for FIX 5.0+,
 * whose own XML has no header/trailer), per BRIEF.md §3.2.
 *
 * The XML sources are not vendored into this repo; fetch them from the
 * QuickFIX project (github.com/quickfix/quickfix, spec/) when regenerating.
 */
import { readFileSync, writeFileSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Minimal XML parser — sufficient for QuickFIX spec files (elements with
// double-quoted attributes, comments, no CDATA/entities in structure).
// ---------------------------------------------------------------------------

function parseXml(text) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const re =
    /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<\/([\w:-]+)\s*>|<([\w:-]+)((?:\s+[\w:-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    const [token, closeTag, openTag, attrText, selfClose] = match;
    if (token.startsWith('<!--') || token.startsWith('<?')) continue;
    if (closeTag !== undefined) {
      if (stack.length < 2 || stack[stack.length - 1].tag !== closeTag) {
        throw new Error(`Mismatched </${closeTag}> at offset ${match.index}`);
      }
      stack.pop();
      continue;
    }
    const attrs = {};
    const attrRe = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let attrMatch;
    while ((attrMatch = attrRe.exec(attrText)) !== null) {
      attrs[attrMatch[1]] = decodeEntities(attrMatch[2] ?? attrMatch[3]);
    }
    const node = { tag: openTag, attrs, children: [] };
    stack[stack.length - 1].children.push(node);
    if (!selfClose) stack.push(node);
  }
  if (stack.length !== 1) {
    throw new Error(`Unclosed element <${stack[stack.length - 1].tag}>`);
  }
  return root;
}

function decodeEntities(s) {
  return s
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

function child(node, tag) {
  return node.children.find((c) => c.tag === tag);
}

// ---------------------------------------------------------------------------
// QuickFIX model extraction
// ---------------------------------------------------------------------------

function extractSpec(xmlPath) {
  const doc = parseXml(readFileSync(xmlPath, 'utf8'));
  const fix = child(doc, 'fix');
  if (!fix) throw new Error(`${xmlPath}: no <fix> root element`);

  const fields = new Map(); // name -> {tag, name, type, enums?}
  const fieldsByTag = new Map();
  for (const f of (child(fix, 'fields')?.children ?? []).filter((c) => c.tag === 'field')) {
    const tag = Number(f.attrs.number);
    const def = { tag, name: f.attrs.name, type: f.attrs.type };
    const values = f.children.filter((c) => c.tag === 'value');
    if (values.length > 0) {
      def.enums = values.map((v) => [v.attrs.enum, prettifyEnumLabel(v.attrs.description ?? '')]);
    }
    fields.set(def.name, def);
    fieldsByTag.set(tag, def);
  }

  const components = new Map();
  for (const c of (child(fix, 'components')?.children ?? []).filter((n) => n.tag === 'component')) {
    components.set(c.attrs.name, c.children);
  }

  const messages = (child(fix, 'messages')?.children ?? []).filter((c) => c.tag === 'message');

  return {
    attrs: fix.attrs,
    fields,
    fieldsByTag,
    components,
    messages,
    header: child(fix, 'header')?.children ?? [],
    trailer: child(fix, 'trailer')?.children ?? [],
  };
}

function prettifyEnumLabel(desc) {
  // "GOOD_TILL_CANCEL" -> "Good Till Cancel"; keep single letters/digits as-is.
  return desc
    .split('_')
    .map((w) => (w.length <= 1 ? w : w[0] + w.slice(1).toLowerCase()))
    .join(' ');
}

// ---------------------------------------------------------------------------
// Layout conversion: QuickFIX field/component/group nodes -> compact items
//   field:     [tag] optional, [tag, 1] required
//   component: ["#Name"] optional, ["#Name", 1] required
//   group:     {"g": countTag, "req": 0|1, "items": [...]}
// ---------------------------------------------------------------------------

function convertLayout(nodes, spec, context) {
  const items = [];
  for (const node of nodes) {
    const required = node.attrs.required === 'Y' ? 1 : 0;
    if (node.tag === 'field') {
      const def = spec.fields.get(node.attrs.name);
      if (!def) throw new Error(`${context}: unknown field name '${node.attrs.name}'`);
      items.push(required ? [def.tag, 1] : [def.tag]);
    } else if (node.tag === 'component') {
      items.push(required ? [`#${node.attrs.name}`, 1] : [`#${node.attrs.name}`]);
    } else if (node.tag === 'group') {
      const def = spec.fields.get(node.attrs.name);
      if (!def) throw new Error(`${context}: unknown group count field '${node.attrs.name}'`);
      const group = {
        g: def.tag,
        items: convertLayout(node.children, spec, `${context}/${node.attrs.name}`),
      };
      if (required) group.req = 1;
      items.push(group);
    }
  }
  return items;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}
const xmlPath = args[0] && !args[0].startsWith('--') ? args[0] : undefined;
const outPath = argValue('--out');
const fixtPath = argValue('--fixt');
if (!xmlPath || !outPath) {
  console.error(
    'Usage: node scripts/convert-quickfix.mjs <FIXxx.xml> --out <out.json> [--fixt <FIXT11.xml>] [--fix-id FIX.x.y]'
  );
  process.exit(1);
}

const spec = extractSpec(xmlPath);
const { major, minor, servicepack } = spec.attrs;
const inferredId =
  `FIX.${major}.${minor}` + (servicepack && servicepack !== '0' ? `SP${servicepack}` : '');
const fixId = argValue('--fix-id') ?? inferredId;

let header = spec.header;
let trailer = spec.trailer;
let headerSpec = spec;
if (fixtPath) {
  const fixt = extractSpec(fixtPath);
  header = fixt.header;
  trailer = fixt.trailer;
  headerSpec = fixt;
  // Merge FIXT field definitions the application dictionary lacks (8, 9, 10, 35...).
  for (const [name, def] of fixt.fields) {
    if (!spec.fields.has(name)) {
      spec.fields.set(name, def);
      spec.fieldsByTag.set(def.tag, def);
    }
  }
  // Header/trailer layouts may reference FIXT components (e.g. HopGrp).
  for (const [name, nodes] of fixt.components) {
    if (!spec.components.has(name)) spec.components.set(name, nodes);
  }
}

const out = {
  fix: fixId,
  formatVersion: 1,
  partial: false,
  generatedFrom: xmlPath.split('/').pop() + (fixtPath ? ` + ${fixtPath.split('/').pop()}` : ''),
  fields: Object.fromEntries(
    [...spec.fieldsByTag.entries()]
      .sort(([a], [b]) => a - b)
      .map(([tag, def]) => [
        String(tag),
        def.enums ? [def.name, def.type, Object.fromEntries(def.enums)] : [def.name, def.type],
      ])
  ),
  components: Object.fromEntries(
    [...spec.components.entries()].map(([name, nodes]) => [
      name,
      convertLayout(nodes, spec, `component/${name}`),
    ])
  ),
  header: convertLayout(header, headerSpec === spec ? spec : headerSpec, 'header'),
  trailer: convertLayout(trailer, headerSpec === spec ? spec : headerSpec, 'trailer'),
  messages: Object.fromEntries(
    spec.messages.map((m) => [
      m.attrs.msgtype,
      {
        name: m.attrs.name,
        cat: m.attrs.msgcat,
        items: convertLayout(m.children, spec, `message/${m.attrs.name}`),
      },
    ])
  ),
};

writeFileSync(outPath, JSON.stringify(out) + '\n');
const bytes = JSON.stringify(out).length;
console.log(
  `${outPath}: ${fixId}, ${Object.keys(out.fields).length} fields, ` +
    `${Object.keys(out.messages).length} messages, ${Object.keys(out.components).length} components, ` +
    `${(bytes / 1024).toFixed(0)} KB`
);
