/** True when the builder runs inside an iframe (embedded host mode). */
export function isEmbedded(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true; // cross-origin parent throws — definitely embedded
  }
}
