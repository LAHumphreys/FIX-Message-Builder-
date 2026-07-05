/**
 * Engine public surface. The UI layer imports from here only.
 *
 * This layer is pure TypeScript: no DOM, no browser APIs, no runtime
 * dependencies. The boundary is enforced by lint rules (eslint.config.js).
 */
export * from './message/types.ts';
export * from './message/builders.ts';
export * from './dictionary/types.ts';
export * from './dictionary/json.ts';
export * from './dictionary/layout.ts';
export { loadBaseDictionary } from './dictionary/data/index.ts';
export * from './fragment/types.ts';
export * from './fragment/merge.ts';
export * from './slot/types.ts';
export * from './generator/types.ts';
export * from './generator/evaluate.ts';
export * from './render/checksum.ts';
export * from './render/tagvalue.ts';
export * from './render/annotated.ts';
