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
export * from './render/json/types.ts';
export * from './dictionary/overlay.ts';
export * from './profile/types.ts';
export * from './profile/load.ts';
export * from './profile/resolve.ts';
export * from './validation/types.ts';
export * from './validation/policy.ts';
export * from './validation/validate.ts';
export * from './build/single.ts';
