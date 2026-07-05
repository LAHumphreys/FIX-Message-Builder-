/**
 * Workspace provider seam (brief §3.9, Tier 1). The engine defines the
 * abstraction; the Chromium File System Access implementation lives in the
 * UI layer behind feature detection, and Tier 2 (file picker + download)
 * needs no provider at all. Files are the single source of truth.
 */

export interface WorkspaceEntry {
  /** Path relative to the workspace root, e.g. "scenarios/spread.scenario.json". */
  readonly path: string;
  /** Opaque modification token captured at read time (mtime-based). */
  readonly modifiedToken: string;
}

export interface WorkspaceFile extends WorkspaceEntry {
  readonly text: string;
}

export type WriteResult =
  | { readonly ok: true; readonly entry: WorkspaceEntry }
  | {
      /** The file changed externally since it was read (§3.9 optimistic
       * concurrency): never silently clobber. */
      readonly ok: false;
      readonly reason: 'conflict';
      readonly currentToken: string;
    };

export interface WorkspaceProvider {
  /** List files under a conventional directory (profile/, scenarios/...). */
  list(directory: string): Promise<readonly WorkspaceEntry[]>;
  read(path: string): Promise<WorkspaceFile | undefined>;
  /**
   * Write text at path. `expectedToken` is the token captured at load; a
   * mismatch reports a conflict instead of overwriting. Pass undefined for
   * new files.
   */
  write(path: string, text: string, expectedToken: string | undefined): Promise<WriteResult>;
}
