/**
 * Generator evaluation. References are resolved against the profile's
 * generator definitions; unknown references produce a visible placeholder
 * rather than an error (the tool never refuses to render).
 */
import type { GeneratorContext, GeneratorDef, TimestampPrecision } from './types.ts';

export type GeneratorDefs = ReadonlyMap<string, GeneratorDef>;

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

export function formatFixTimestamp(date: Date, precision: TimestampPrecision): string {
  const base =
    `${pad(date.getUTCFullYear(), 4)}${pad(date.getUTCMonth() + 1, 2)}${pad(date.getUTCDate(), 2)}` +
    `-${pad(date.getUTCHours(), 2)}:${pad(date.getUTCMinutes(), 2)}:${pad(date.getUTCSeconds(), 2)}`;
  if (precision === 'seconds') return base;
  const millis = pad(date.getUTCMilliseconds(), 3);
  // JS clocks are millisecond-precision; micros render with a 000 suffix.
  return precision === 'millis' ? `${base}.${millis}` : `${base}.${millis}000`;
}

function formatDateToken(date: Date, format: string): string {
  return format
    .replaceAll('yyyy', pad(date.getUTCFullYear(), 4))
    .replaceAll('MM', pad(date.getUTCMonth() + 1, 2))
    .replaceAll('dd', pad(date.getUTCDate(), 2))
    .replaceAll('HH', pad(date.getUTCHours(), 2))
    .replaceAll('mm', pad(date.getUTCMinutes(), 2))
    .replaceAll('ss', pad(date.getUTCSeconds(), 2));
}

function randomHex(random: () => number, length: number): string {
  let out = '';
  while (out.length < length) {
    out += Math.floor(random() * 16).toString(16);
  }
  return out;
}

function randomUuid(random: () => number): string {
  // RFC-4122-shaped v4 from the injected entropy source.
  const hex = randomHex(random, 32);
  return (
    `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-` +
    `${((parseInt(hex[16]!, 16) & 0x3) | 0x8).toString(16)}${hex.slice(17, 20)}-${hex.slice(20, 32)}`
  );
}

/**
 * Interpolate a template: {date:yyyyMMdd}, {seq:4} (batch-scoped, zero-pad),
 * {rand:8} (hex). Unknown placeholders pass through verbatim.
 */
export function interpolateTemplate(
  template: string,
  templateKey: string,
  ctx: GeneratorContext
): string {
  return template.replace(/\{(\w+)(?::([^}]*))?\}/g, (whole, name: string, arg?: string) => {
    switch (name) {
      case 'date':
        return formatDateToken(ctx.clock(), arg || 'yyyyMMdd');
      case 'seq': {
        const width = arg ? Number(arg) : 0;
        const value = ctx.batch.nextCounter(`template:${templateKey}`, 1);
        return width > 0 ? pad(value, width) : String(value);
      }
      case 'rand':
        return randomHex(ctx.random, arg ? Number(arg) : 8);
      default:
        return whole;
    }
  });
}

export function evaluateGenerator(
  defs: GeneratorDefs,
  ref: string,
  ctx: GeneratorContext,
  seen: readonly string[] = []
): string {
  const def = defs.get(ref);
  if (!def || seen.includes(ref)) {
    return `{${ref}?}`;
  }
  switch (def.kind) {
    case 'sequence': {
      const start = def.start ?? 1;
      let value: number;
      if (def.scope === 'message') {
        value = ctx.message.get(ref) ?? start;
        ctx.message.set(ref, value + 1);
      } else if (def.scope === 'batch') {
        value = ctx.batch.nextCounter(`seq:${ref}`, start);
      } else {
        value = ctx.counters.next(ref, start);
      }
      return def.pad ? pad(value, def.pad) : String(value);
    }
    case 'timestamp':
      return formatFixTimestamp(ctx.clock(), def.precision);
    case 'template':
      return interpolateTemplate(def.template, ref, ctx);
    case 'shared': {
      const cached = ctx.batch.sharedValues.get(ref);
      if (cached !== undefined) return cached;
      const value = evaluateGenerator(defs, def.of, ctx, [...seen, ref]);
      ctx.batch.sharedValues.set(ref, value);
      return value;
    }
    case 'random':
      return def.style === 'uuid' ? randomUuid(ctx.random) : randomHex(ctx.random, def.length ?? 8);
  }
}

/** Seeded PRNG (mulberry32) — used by tests and per-session UI seeding. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
