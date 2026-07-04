/**
 * Engine public surface. The UI layer imports from here only.
 *
 * This layer is pure TypeScript: no DOM, no browser APIs, no runtime
 * dependencies. The boundary is enforced by lint rules (eslint.config.js).
 */
export * from './message/types.ts';
export * from './message/builders.ts';
